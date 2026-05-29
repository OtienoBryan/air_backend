const mysql = require('mysql2/promise');

async function updateSalesOrderItemsTable() {
  let connection;
  
  try {
    // Database connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'impulsep_moonsun1'
    });

    console.log('🔗 Connected to database');

    // Check if sales_order_items table exists
    console.log('\n📋 Checking sales_order_items table...');
    const [tables] = await connection.execute("SHOW TABLES LIKE 'sales_order_items'");
    
    if (tables.length === 0) {
      console.log('❌ sales_order_items table does not exist');
      console.log('📝 Creating sales_order_items table...');
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS sales_order_items (
          id int(11) NOT NULL AUTO_INCREMENT,
          sales_order_id int(11) NOT NULL,
          product_id int(11) NOT NULL,
          quantity int(11) NOT NULL,
          unit_price decimal(10,2) NOT NULL,
          total_price decimal(10,2) NOT NULL,
          created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          KEY idx_sales_order_id (sales_order_id),
          KEY idx_product_id (product_id),
          FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
      
      await connection.execute(createTableSQL);
      console.log('✅ sales_order_items table created successfully');
    } else {
      console.log('✅ sales_order_items table exists');
      
      // Check if product_name column exists and remove it
      const [columns] = await connection.execute('DESCRIBE sales_order_items');
      const hasProductNameColumn = columns.some(col => col.Field === 'product_name');
      
      if (hasProductNameColumn) {
        console.log('📝 Removing product_name column (will fetch from products table)...');
        await connection.execute('ALTER TABLE sales_order_items DROP COLUMN product_name');
        console.log('✅ product_name column removed');
      } else {
        console.log('✅ product_name column already removed');
      }
    }

    // Check table structure
    console.log('\n📊 Updated table structure:');
    const [updatedColumns] = await connection.execute('DESCRIBE sales_order_items');
    console.table(updatedColumns);

    // Check if table has data
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM sales_order_items');
    const count = countResult[0].count;
    console.log(`\n📈 Current records: ${count}`);

    // Insert sample data if table is empty
    if (count === 0) {
      console.log('\n📝 Inserting sample sales order items...');
      
      // First, let's check if we have sales orders and products
      const [salesOrders] = await connection.execute('SELECT id FROM sales_orders LIMIT 5');
      const [products] = await connection.execute('SELECT id, name FROM products LIMIT 10');
      
      if (salesOrders.length > 0 && products.length > 0) {
        const sampleItems = [
          // Items for first sales order
          [salesOrders[0].id, products[0].id, 2, 8.99, 17.98],
          [salesOrders[0].id, products[1]?.id || products[0].id, 1, 24.99, 24.99],
          
          // Items for second sales order (if exists)
          ...(salesOrders[1] ? [
            [salesOrders[1].id, products[2]?.id || products[0].id, 3, 7.99, 23.97],
            [salesOrders[1].id, products[3]?.id || products[1].id, 2, 19.99, 39.98]
          ] : []),
          
          // Items for third sales order (if exists)
          ...(salesOrders[2] ? [
            [salesOrders[2].id, products[4]?.id || products[0].id, 1, 45.99, 45.99],
            [salesOrders[2].id, products[5]?.id || products[1].id, 1, 89.99, 89.99]
          ] : [])
        ];

        for (const item of sampleItems) {
          await connection.execute(
            `INSERT INTO sales_order_items (sales_order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)`,
            item
          );
        }
        
        console.log(`✅ Inserted ${sampleItems.length} sample sales order items`);
      } else {
        console.log('⚠️ No sales orders or products found. Please create them first.');
      }
    }

    // Show sample data with product names
    console.log('\n📋 Sample sales order items with product names:');
    const [sampleData] = await connection.execute(`
      SELECT 
        soi.id,
        soi.sales_order_id,
        so.so_number,
        p.name as product_name,
        soi.quantity,
        soi.unit_price,
        soi.total_price,
        so.order_date
      FROM sales_order_items soi
      JOIN sales_orders so ON soi.sales_order_id = so.id
      JOIN products p ON soi.product_id = p.id
      ORDER BY so.order_date DESC, soi.id
      LIMIT 10
    `);
    
    if (sampleData.length > 0) {
      console.table(sampleData);
    } else {
      console.log('No data found');
    }

    console.log('\n🚀 The sales_order_items table is updated and ready!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

updateSalesOrderItemsTable();
