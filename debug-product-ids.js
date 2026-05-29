const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugProductIds() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    console.log('🔍 Checking product ID mismatches...');
    
    // Get all product IDs from products table
    const [products] = await connection.execute('SELECT id, product_name FROM products ORDER BY id');
    console.log('📦 Products in products table:');
    products.forEach(p => {
      console.log(`  ID: ${p.id}, Name: ${p.product_name}`);
    });
    
    // Get all unique product IDs from store_inventory
    const [inventoryProducts] = await connection.execute('SELECT DISTINCT product_id FROM store_inventory ORDER BY product_id');
    console.log('\n📊 Product IDs in store_inventory:');
    inventoryProducts.forEach(p => {
      console.log(`  Product ID: ${p.product_id}`);
    });
    
    // Find mismatches
    const productIds = products.map(p => p.id);
    const inventoryProductIds = inventoryProducts.map(p => p.product_id);
    
    const missingProducts = inventoryProductIds.filter(id => !productIds.includes(id));
    const missingInventory = productIds.filter(id => !inventoryProductIds.includes(id));
    
    console.log('\n❌ Product IDs in store_inventory but NOT in products table:', missingProducts);
    console.log('❌ Product IDs in products table but NOT in store_inventory:', missingInventory);
    
    // Test a specific product that exists in both
    if (products.length > 0 && inventoryProducts.length > 0) {
      const testProductId = products[0].id;
      console.log(`\n🧪 Testing with product ID ${testProductId}:`);
      
      const [testQuery] = await connection.execute(`
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
        WHERE si.product_id = ?
        LIMIT 3
      `, [testProductId]);
      
      console.log('Test results:');
      testQuery.forEach(row => {
        console.log(`  Store: ${row.store_name}, Product: ${row.product_name}, Qty: ${row.quantity}`);
      });
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugProductIds();
