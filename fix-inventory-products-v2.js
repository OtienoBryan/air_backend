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

    console.log('🔧 Fixing inventory product IDs (handling duplicates)...');
    
    // Get all valid product IDs
    const [products] = await connection.execute('SELECT id FROM products ORDER BY id');
    const validProductIds = products.map(p => p.id);
    console.log('✅ Valid product IDs:', validProductIds);
    
    // Get invalid product IDs from store_inventory with their store_id and quantity
    const [invalidProducts] = await connection.execute(`
      SELECT DISTINCT si.store_id, si.product_id, si.quantity, si.id
      FROM store_inventory si 
      LEFT JOIN products p ON si.product_id = p.id 
      WHERE p.id IS NULL
      ORDER BY si.store_id, si.product_id
    `);
    
    console.log('❌ Invalid product records found:', invalidProducts.length);
    
    if (invalidProducts.length > 0) {
      for (const record of invalidProducts) {
        const { store_id, product_id: invalidProductId, quantity, id } = record;
        
        // Find a valid product ID that doesn't already exist for this store
        let mappedProductId = null;
        for (const validId of validProductIds) {
          const [existing] = await connection.execute(
            'SELECT COUNT(*) as count FROM store_inventory WHERE store_id = ? AND product_id = ?',
            [store_id, validId]
          );
          
          if (existing[0].count === 0) {
            mappedProductId = validId;
            break;
          }
        }
        
        // If all valid products already exist for this store, use the first valid product
        if (!mappedProductId) {
          mappedProductId = validProductIds[0];
          
          // Update the existing record with the same store_id and valid product_id
          const [existingRecord] = await connection.execute(
            'SELECT id FROM store_inventory WHERE store_id = ? AND product_id = ?',
            [store_id, mappedProductId]
          );
          
          if (existingRecord.length > 0) {
            // Add quantities together and delete the invalid record
            await connection.execute(
              'UPDATE store_inventory SET quantity = quantity + ? WHERE id = ?',
              [quantity, existingRecord[0].id]
            );
            await connection.execute('DELETE FROM store_inventory WHERE id = ?', [id]);
            console.log(`🔄 Merged product ID ${invalidProductId} (qty: ${quantity}) with existing product ID ${mappedProductId} for store ${store_id}`);
            continue;
          }
        }
        
        console.log(`🔄 Mapping product ID ${invalidProductId} (qty: ${quantity}) to product ID ${mappedProductId} for store ${store_id}`);
        
        // Update the record
        await connection.execute(
          'UPDATE store_inventory SET product_id = ? WHERE id = ?',
          [mappedProductId, id]
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
      LIMIT 15
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
    
    const [totalCount] = await connection.execute('SELECT COUNT(*) as count FROM store_inventory');
    
    console.log(`\n✅ Records with valid product names: ${validCount[0].count}/${totalCount[0].count}`);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixInventoryProducts();
