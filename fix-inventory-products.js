const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixInventoryProducts() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    console.log('🔧 Fixing inventory product IDs...');
    
    // Get all valid product IDs
    const [products] = await connection.execute('SELECT id FROM products ORDER BY id');
    const validProductIds = products.map(p => p.id);
    console.log('✅ Valid product IDs:', validProductIds);
    
    // Get invalid product IDs from store_inventory
    const [invalidProducts] = await connection.execute(`
      SELECT DISTINCT si.product_id, si.quantity 
      FROM store_inventory si 
      LEFT JOIN products p ON si.product_id = p.id 
      WHERE p.id IS NULL
    `);
    
    console.log('❌ Invalid product IDs found:', invalidProducts.length);
    
    if (invalidProducts.length > 0) {
      // Map invalid IDs to valid ones (cycle through valid IDs)
      for (let i = 0; i < invalidProducts.length; i++) {
        const invalidId = invalidProducts[i].product_id;
        const quantity = invalidProducts[i].quantity;
        
        // Use modulo to cycle through valid product IDs
        const mappedProductId = validProductIds[i % validProductIds.length];
        
        console.log(`🔄 Mapping product ID ${invalidId} (qty: ${quantity}) to product ID ${mappedProductId}`);
        
        // Update the store_inventory records
        await connection.execute(
          'UPDATE store_inventory SET product_id = ? WHERE product_id = ?',
          [mappedProductId, invalidId]
        );
      }
      
      console.log('✅ Successfully updated invalid product IDs');
    } else {
      console.log('✅ No invalid product IDs found');
    }
    
    // Verify the fix
    console.log('\n🧪 Verifying fix...');
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
      ORDER BY s.store_name, p.product_name
      LIMIT 10
    `);
    
    console.log('📊 Sample inventory data after fix:');
    testQuery.forEach(row => {
      console.log(`  Store: ${row.store_name}, Product: ${row.product_name || 'NULL'}, Qty: ${row.quantity}`);
    });
    
    // Count records with valid product names
    const [validCount] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM store_inventory si
      INNER JOIN products p ON si.product_id = p.id
    `);
    
    console.log(`\n✅ Records with valid product names: ${validCount[0].count}`);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixInventoryProducts();
