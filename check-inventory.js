const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkInventory() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    console.log('🔍 Checking store_inventory table...');
    
    // Check if table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'store_inventory'");
    console.log('📋 Tables found:', tables.length > 0 ? 'store_inventory exists' : 'store_inventory NOT found');
    
    if (tables.length > 0) {
      // Check table structure
      const [structure] = await connection.execute('DESCRIBE store_inventory');
      console.log('📊 Table structure:');
      structure.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'}`);
      });
      
      // Check data count
      const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM store_inventory');
      console.log(`📈 Total records: ${countResult[0].count}`);
      
      // Show sample data
      const [sampleData] = await connection.execute('SELECT * FROM store_inventory LIMIT 5');
      console.log('📝 Sample data:');
      sampleData.forEach(row => {
        console.log(`  ID: ${row.id}, Store: ${row.store_id}, Product: ${row.product_id}, Qty: ${row.quantity}`);
      });
    }
    
    // Check if stores table exists
    const [storesTables] = await connection.execute("SHOW TABLES LIKE 'stores'");
    console.log('🏪 Stores table:', storesTables.length > 0 ? 'exists' : 'NOT found');
    
    if (storesTables.length > 0) {
      const [storesCount] = await connection.execute('SELECT COUNT(*) as count FROM stores');
      console.log(`🏪 Total stores: ${storesCount[0].count}`);
    }
    
    // Check if products table exists  
    const [productsTables] = await connection.execute("SHOW TABLES LIKE 'products'");
    console.log('📦 Products table:', productsTables.length > 0 ? 'exists' : 'NOT found');
    
    if (productsTables.length > 0) {
      const [productsCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
      console.log(`📦 Total products: ${productsCount[0].count}`);
    }
    
    // Test the inventory query
    if (tables.length > 0 && storesTables.length > 0 && productsTables.length > 0) {
      console.log('🧪 Testing inventory query...');
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
        LIMIT 5
      `;
      
      const [inventoryData] = await connection.execute(query);
      console.log('📊 Inventory query results:');
      inventoryData.forEach(row => {
        console.log(`  Store: ${row.store_name}, Product: ${row.product_name}, Qty: ${row.quantity}`);
      });
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkInventory();
