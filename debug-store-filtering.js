const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugStoreFiltering() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    console.log('🔍 Debugging store filtering issue...');
    
    // Check the exact query used by the inventory API
    const [inventoryData] = await connection.execute(`
      SELECT 
        si.id,
        si.store_id,
        si.product_id,
        si.quantity,
        p.product_name,
        s.store_name
      FROM store_inventory si
      LEFT JOIN products p ON si.product_id = p.id
      LEFT JOIN stores s ON si.store_id = s.id
      ORDER BY s.store_name, p.product_name
    `);
    
    console.log(`📊 Total inventory items: ${inventoryData.length}`);
    
    // Group by store to see distribution
    const storeGroups = inventoryData.reduce((acc, item) => {
      const storeName = item.store_name || 'Unknown Store';
      const storeId = item.store_id;
      if (!acc[storeId]) {
        acc[storeId] = { name: storeName, items: [], totalQuantity: 0 };
      }
      acc[storeId].items.push(item);
      acc[storeId].totalQuantity += item.quantity;
      return acc;
    }, {});
    
    console.log('\n🏪 Inventory distribution by store:');
    Object.entries(storeGroups).forEach(([storeId, data]) => {
      console.log(`  Store ID ${storeId} (${data.name}): ${data.items.length} items, Total Qty: ${data.totalQuantity}`);
      
      // Show first few items for each store
      data.items.slice(0, 3).forEach(item => {
        console.log(`    - ${item.product_name}: ${item.quantity} units`);
      });
    });
    
    // Check if there are any items with NULL values
    const nullProducts = inventoryData.filter(item => !item.product_name);
    const nullStores = inventoryData.filter(item => !item.store_name);
    
    if (nullProducts.length > 0) {
      console.log(`\n❌ Items with NULL product names: ${nullProducts.length}`);
    }
    if (nullStores.length > 0) {
      console.log(`\n❌ Items with NULL store names: ${nullStores.length}`);
    }
    
    // Check if there's a LIMIT in the query that might be causing issues
    console.log('\n🧪 Testing with different ORDER BY clauses...');
    
    const [testData1] = await connection.execute(`
      SELECT si.store_id, s.store_name, COUNT(*) as item_count, SUM(si.quantity) as total_qty
      FROM store_inventory si
      LEFT JOIN stores s ON si.store_id = s.id
      GROUP BY si.store_id, s.store_name
      ORDER BY si.store_id
    `);
    
    console.log('📊 Summary by store:');
    testData1.forEach(row => {
      console.log(`  Store ${row.store_id} (${row.store_name}): ${row.item_count} items, ${row.total_qty} total quantity`);
    });
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugStoreFiltering();
