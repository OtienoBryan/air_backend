const mysql = require('mysql2/promise');

async function populateTestData() {
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

    // Check if we have any data
    const [salesOrdersCount] = await connection.execute('SELECT COUNT(*) as count FROM sales_orders');
    const [orderItemsCount] = await connection.execute('SELECT COUNT(*) as count FROM sales_order_items');
    const [productsCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
    const [clientsCount] = await connection.execute('SELECT COUNT(*) as count FROM Clients');

    console.log(`📊 Current data counts:`);
    console.log(`   Sales Orders: ${salesOrdersCount[0].count}`);
    console.log(`   Order Items: ${orderItemsCount[0].count}`);
    console.log(`   Products: ${productsCount[0].count}`);
    console.log(`   Clients: ${clientsCount[0].count}`);

    // If we have no data, create some test data
    if (salesOrdersCount[0].count === 0 || orderItemsCount[0].count === 0) {
      console.log('\n📝 Creating test data...');

      // First, ensure we have products
      if (productsCount[0].count === 0) {
        console.log('🛍️ Creating products...');
        await connection.execute(`
          INSERT INTO products (product_name, price, description, categoryId, isActive) VALUES
          ('Craft IPA Beer', 8.99, 'Premium craft beer', 1, 1),
          ('Cabernet Sauvignon', 24.99, 'Red wine 2020', 2, 1),
          ('Wheat Beer', 7.99, 'Organic wheat beer', 1, 1),
          ('Chardonnay', 19.99, 'White wine', 2, 1),
          ('Premium Vodka', 45.99, 'Distilled vodka', 3, 1),
          ('Single Malt Scotch', 89.99, 'Aged scotch whisky', 3, 1)
        `);
      }

      // Ensure we have clients
      if (clientsCount[0].count === 0) {
        console.log('👥 Creating clients...');
        await connection.execute(`
          INSERT INTO Clients (name, email, contact, region, region_id, balance) VALUES
          ('John Doe', 'john@example.com', '+1234567890', 'North Region', 1, 0.00),
          ('Jane Smith', 'jane@example.com', '+1234567891', 'South Region', 2, 0.00),
          ('Bob Johnson', 'bob@example.com', '+1234567892', 'East Region', 3, 0.00)
        `);
      }

      // Create sales orders
      if (salesOrdersCount[0].count === 0) {
        console.log('📋 Creating sales orders...');
        await connection.execute(`
          INSERT INTO sales_orders (so_number, client_id, order_date, subtotal, tax_amount, total_amount, net_price, status, my_status, received_into_stock, delivery_notes, received_by) VALUES
          ('SO-001', 1, '2025-01-15', 42.97, 3.44, 46.41, 42.97, 'delivered', 1, 1, 'Delivered successfully', 1),
          ('SO-002', 1, '2025-01-20', 63.96, 5.12, 69.08, 63.96, 'delivered', 1, 1, 'Delivered successfully', 1),
          ('SO-003', 2, '2025-01-25', 89.95, 7.20, 97.15, 89.95, 'delivered', 1, 1, 'Delivered successfully', 1),
          ('SO-004', 2, '2025-02-10', 127.97, 10.24, 138.21, 127.97, 'delivered', 1, 1, 'Delivered successfully', 1),
          ('SO-005', 3, '2025-02-15', 45.99, 3.68, 49.67, 45.99, 'delivered', 1, 1, 'Delivered successfully', 1)
        `);
      }

      // Create order items
      if (orderItemsCount[0].count === 0) {
        console.log('📦 Creating order items...');
        await connection.execute(`
          INSERT INTO sales_order_items (sales_order_id, product_id, quantity, unit_price, total_price) VALUES
          (1, 1, 2, 8.99, 17.98),
          (1, 2, 1, 24.99, 24.99),
          (2, 3, 3, 7.99, 23.97),
          (2, 4, 2, 19.99, 39.98),
          (3, 5, 1, 45.99, 45.99),
          (3, 6, 1, 89.99, 89.99),
          (4, 1, 4, 8.99, 35.96),
          (4, 2, 2, 24.99, 49.98),
          (4, 3, 2, 7.99, 15.98),
          (5, 5, 1, 45.99, 45.99)
        `);
      }

      console.log('✅ Test data created successfully!');
    } else {
      console.log('✅ Data already exists, skipping creation');
    }

    // Show final counts
    const [finalSalesOrdersCount] = await connection.execute('SELECT COUNT(*) as count FROM sales_orders');
    const [finalOrderItemsCount] = await connection.execute('SELECT COUNT(*) as count FROM sales_order_items');
    const [finalProductsCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
    const [finalClientsCount] = await connection.execute('SELECT COUNT(*) as count FROM Clients');

    console.log(`\n📊 Final data counts:`);
    console.log(`   Sales Orders: ${finalSalesOrdersCount[0].count}`);
    console.log(`   Order Items: ${finalOrderItemsCount[0].count}`);
    console.log(`   Products: ${finalProductsCount[0].count}`);
    console.log(`   Clients: ${finalClientsCount[0].count}`);

    // Show sample data
    console.log('\n📋 Sample sales orders:');
    const [sampleSalesOrders] = await connection.execute(`
      SELECT s.id, s.so_number, s.client_id, s.order_date, s.total_amount, c.name as client_name
      FROM sales_orders s
      LEFT JOIN Clients c ON s.client_id = c.id
      ORDER BY s.order_date DESC
      LIMIT 5
    `);
    console.table(sampleSalesOrders);

    console.log('\n📋 Sample order items with product names:');
    const [sampleOrderItems] = await connection.execute(`
      SELECT soi.id, soi.sales_order_id, so.so_number, p.product_name, soi.quantity, soi.unit_price, soi.total_price
      FROM sales_order_items soi
      JOIN sales_orders so ON soi.sales_order_id = so.id
      JOIN products p ON soi.product_id = p.id
      ORDER BY so.order_date DESC
      LIMIT 5
    `);
    console.table(sampleOrderItems);

    console.log('\n🚀 Test data population completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure MySQL is running: net start mysql');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

populateTestData();
