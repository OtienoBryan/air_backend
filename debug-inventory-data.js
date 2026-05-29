const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugInventoryData() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    console.log('🔍 Debugging inventory data...');
    
    // Check what store IDs exist in store_inventory
    const [storeIds] = await connection.execute(`
      SELECT DISTINCT store_id, COUNT(*) as count 
      FROM store_inventory 
      GROUP BY store_id 
      ORDER BY store_id
    `);
    
    console.log('📊 Store IDs in store_inventory:');
    storeIds.forEach(row => {
      console.log(`  Store ID: ${row.store_id} - ${row.count} items`);
    });
    
    // Check the inventory query that the API uses
    console.log('\n🧪 Testing inventory query...');
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
      LIMIT 10
    `);
    
    console.log('📋 Sample inventory data:');
    inventoryData.forEach(row => {
      console.log(`  Store: ${row.store_name} (ID: ${row.store_id}), Product: ${row.product_name}, Qty: ${row.quantity}`);
    });
    
    // Check if there are any NULL store names
    const [nullStores] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM store_inventory si
      LEFT JOIN stores s ON si.store_id = s.id
      WHERE s.store_name IS NULL
    `);
    
    console.log(`\n❌ Inventory items with NULL store names: ${nullStores[0].count}`);
    
    // Check what stores exist
    const [stores] = await connection.execute('SELECT id, store_name FROM stores ORDER BY id');
    console.log('\n🏪 Available stores:');
    stores.forEach(store => {
      console.log(`  ID: ${store.id}, Name: ${store.store_name}`);
    });
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugInventoryData();
