const mysql = require('mysql2/promise');
require('dotenv').config();

async function testInventoryEndpoint() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    console.log('🧪 Testing inventory endpoint query...');
    
    // This is the exact query used by the inventory controller
    const query = `
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
      LIMIT 20
    `;
    
    const [result] = await connection.execute(query);
    
    console.log(`📊 Query returned ${result.length} items:`);
    console.log('\n🏪 Items by store:');
    
    const storeGroups = result.reduce((acc, item) => {
      const storeName = item.store_name || 'Unknown Store';
      if (!acc[storeName]) {
        acc[storeName] = [];
      }
      acc[storeName].push(item);
      return acc;
    }, {});
    
    Object.entries(storeGroups).forEach(([storeName, items]) => {
      console.log(`  ${storeName}: ${items.length} items`);
      items.slice(0, 2).forEach(item => {
        console.log(`    - ${item.product_name}: ${item.quantity} units`);
      });
    });
    
    console.log('\n📋 All items (first 10):');
    result.slice(0, 10).forEach(item => {
      console.log(`  Store: ${item.store_name} (ID: ${item.store_id}), Product: ${item.product_name}, Qty: ${item.quantity}`);
    });
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testInventoryEndpoint();
