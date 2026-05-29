const mysql = require('mysql2/promise');
require('dotenv').config();

async function testInventoryUpdate() {
  let connection;
  
  try {
    console.log('🧪 Testing inventory update functionality...');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'moonsun_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database');

    // Check if store_inventory table exists and has data
    const [tables] = await connection.execute("SHOW TABLES LIKE 'store_inventory'");
    console.log('📋 store_inventory table exists:', tables.length > 0);
    
    if (tables.length === 0) {
      console.log('❌ store_inventory table does not exist');
      return;
    }

    // Check inventory count
    const [inventoryCount] = await connection.execute("SELECT COUNT(*) as count FROM store_inventory");
    console.log('📦 Total inventory items:', inventoryCount[0].count);

    if (inventoryCount[0].count === 0) {
      console.log('⚠️ No inventory items found. Creating test data...');
      
      // Create test inventory items
      await connection.execute(`
        INSERT INTO store_inventory (store_id, product_id, quantity) 
        VALUES (1, 1, 10), (1, 2, 20), (2, 1, 15)
      `);
      console.log('✅ Test inventory data created');
    }

    // Get a sample inventory item
    const [sampleItem] = await connection.execute(`
      SELECT si.*, p.product_name, s.store_name 
      FROM store_inventory si
      LEFT JOIN products p ON si.product_id = p.id
      LEFT JOIN stores s ON si.store_id = s.id
      LIMIT 1
    `);
    
    if (sampleItem.length === 0) {
      console.log('❌ No inventory items found even after creating test data');
      return;
    }

    const item = sampleItem[0];
    console.log('📦 Sample inventory item:', {
      id: item.id,
      store_id: item.store_id,
      product_id: item.product_id,
      quantity: item.quantity,
      product_name: item.product_name,
      store_name: item.store_name
    });

    // Test updating the quantity
    const newQuantity = item.quantity + 5;
    console.log(`🔄 Testing update: changing quantity from ${item.quantity} to ${newQuantity}`);
    
    await connection.execute(
      'UPDATE store_inventory SET quantity = ? WHERE id = ?',
      [newQuantity, item.id]
    );
    
    console.log('✅ Update query executed successfully');
    
    // Verify the update
    const [updatedItem] = await connection.execute(
      'SELECT * FROM store_inventory WHERE id = ?',
      [item.id]
    );
    
    console.log('🔍 Updated item:', updatedItem[0]);
    
    if (updatedItem[0].quantity === newQuantity) {
      console.log('🎉 Inventory update test PASSED!');
    } else {
      console.log('❌ Inventory update test FAILED!');
    }

  } catch (error) {
    console.error('❌ Error testing inventory update:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the test
testInventoryUpdate();
