const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugInventoryFull() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    console.log('🔍 Testing full inventory query...');
    
    // Test the exact query used by the API
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
    
    // Group by store
    const storeGroups = inventoryData.reduce((acc, item) => {
      const storeName = item.store_name || 'Unknown Store';
      if (!acc[storeName]) {
        acc[storeName] = [];
      }
      acc[storeName].push(item);
      return acc;
    }, {});
    
    console.log('\n🏪 Inventory by store:');
    Object.entries(storeGroups).forEach(([storeName, items]) => {
      console.log(`  ${storeName}: ${items.length} items`);
      console.log(`    Sample: ${items[0].product_name} (Qty: ${items[0].quantity})`);
    });
    
    // Check for any items with NULL product names
    const nullProducts = inventoryData.filter(item => !item.product_name);
    if (nullProducts.length > 0) {
      console.log(`\n❌ Items with NULL product names: ${nullProducts.length}`);
      nullProducts.slice(0, 3).forEach(item => {
        console.log(`  Store ID: ${item.store_id}, Product ID: ${item.product_id}, Qty: ${item.quantity}`);
      });
    }
    
    // Check for any items with NULL store names
    const nullStores = inventoryData.filter(item => !item.store_name);
    if (nullStores.length > 0) {
      console.log(`\n❌ Items with NULL store names: ${nullStores.length}`);
      nullStores.slice(0, 3).forEach(item => {
        console.log(`  Store ID: ${item.store_id}, Product ID: ${item.product_id}, Qty: ${item.quantity}`);
      });
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugInventoryFull();
