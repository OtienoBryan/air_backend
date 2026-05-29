const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../../.env' });

async function testProductPerformance() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('🔍 Testing Product Performance...');
    await connection.connect();
    console.log('✅ Database connected.');

    // Check if products table exists
    console.log('\n📋 Checking products table...');
    const [tables] = await connection.execute("SHOW TABLES LIKE 'products'");
    
    if (tables.length === 0) {
      console.log('❌ Products table does not exist. Creating it...');
      
      const createProductsTable = `
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_name VARCHAR(255) NOT NULL,
          description TEXT,
          category_id INT,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
      
      await connection.execute(createProductsTable);
      console.log('✅ Products table created.');
    } else {
      console.log('✅ Products table exists.');
    }

    // Check if products exist
    console.log('\n📦 Checking products...');
    const [productsCount] = await connection.execute("SELECT COUNT(*) as count FROM products");
    console.log(`📊 Total products: ${productsCount[0].count}`);

    if (productsCount[0].count === 0) {
      console.log('🛍️ No products found. Creating sample products...');
      
      await connection.execute(`
        INSERT INTO products (product_name, description, category_id, is_active) VALUES
        ('Craft IPA Beer', 'Premium craft beer', 1, 1),
        ('Cabernet Sauvignon', 'Red wine 2020', 2, 1),
        ('Wheat Beer', 'Organic wheat beer', 1, 1),
        ('Chardonnay', 'White wine', 2, 1),
        ('Premium Vodka', 'Distilled vodka', 3, 1),
        ('Single Malt Scotch', 'Aged scotch whisky', 3, 1)
      `);
      
      console.log('✅ Sample products created.');
    }

    // Check if we have products with sales data
    console.log('\n📊 Checking products with sales data...');
    const [productsWithSales] = await connection.execute(`
      SELECT COUNT(DISTINCT p.id) as count 
      FROM products p
      INNER JOIN sales_order_items soi ON p.id = soi.product_id
      INNER JOIN sales_orders so ON soi.sales_order_id = so.id
    `);
    console.log(`📈 Products with sales data: ${productsWithSales[0].count}`);

    // Show products
    console.log('\n📋 Current products:');
    const [products] = await connection.execute("SELECT id, product_name, description, is_active FROM products ORDER BY product_name");
    console.table(products);

    // Check sales_order_items table
    console.log('\n📋 Checking sales_order_items table...');
    const [orderItemsCount] = await connection.execute("SELECT COUNT(*) as count FROM sales_order_items");
    console.log(`📊 Total order items: ${orderItemsCount[0].count}`);

    if (orderItemsCount[0].count === 0) {
      console.log('📦 No order items found. Creating sample data...');
      
      // First check if we have sales orders
      const [salesOrdersCount] = await connection.execute("SELECT COUNT(*) as count FROM sales_orders");
      console.log(`📊 Total sales orders: ${salesOrdersCount[0].count}`);
      
      if (salesOrdersCount[0].count === 0) {
        console.log('🛒 No sales orders found. Creating sample sales orders...');
        
        // Create sample sales orders with my_status = 3
        await connection.execute(`
          INSERT INTO sales_orders (so_number, client_id, order_date, total_amount, status, my_status, recepients_name, recepients_contact) VALUES
          ('SO-001', 1, '2025-01-15', 42.97, 'delivered', 3, 'John Doe', '555-0101'),
          ('SO-002', 2, '2025-01-20', 31.96, 'delivered', 3, 'Jane Smith', '555-0102'),
          ('SO-003', 1, '2025-01-25', 8.99, 'delivered', 3, 'John Doe', '555-0101')
        `);
        
        console.log('✅ Sample sales orders created.');
      }
      
      // Get the sales order IDs
      const [salesOrders] = await connection.execute("SELECT id, so_number FROM sales_orders ORDER BY id LIMIT 3");
      console.log('📋 Sales orders:', salesOrders);
      
      // Create sample order items
      if (salesOrders.length > 0) {
        await connection.execute(`
          INSERT INTO sales_order_items (
            sales_order_id, product_id, quantity, unit_price, tax_amount, total_price, 
            tax_type, net_price, unit_cost, cost_price, shipped_quantity
          ) VALUES
          (${salesOrders[0].id}, 1, 2, 8.99, 2.88, 17.98, '16%', 15.10, 5.00, 10.00, 2),
          (${salesOrders[0].id}, 2, 1, 24.99, 4.00, 24.99, '16%', 20.99, 15.00, 15.00, 1),
          (${salesOrders[1].id}, 3, 3, 7.99, 3.84, 23.97, '16%', 20.13, 4.00, 12.00, 3),
          (${salesOrders[1].id}, 4, 1, 19.99, 3.20, 19.99, '16%', 16.79, 12.00, 12.00, 1),
          (${salesOrders[2].id}, 1, 1, 8.99, 1.44, 8.99, '16%', 7.55, 5.00, 5.00, 1)
        `);
        
        console.log('✅ Sample order items created.');
      }
    }

    // Show products with sales data
    console.log('\n📈 Products with sales data:');
    const [productsWithSalesData] = await connection.execute(`
      SELECT DISTINCT 
        p.id, 
        p.product_name, 
        COUNT(soi.id) as order_items_count,
        SUM(soi.quantity) as total_quantity,
        SUM(soi.total_price) as total_revenue
      FROM products p
      INNER JOIN sales_order_items soi ON p.id = soi.product_id
      INNER JOIN sales_orders so ON soi.sales_order_id = so.id
      GROUP BY p.id, p.product_name
      ORDER BY total_revenue DESC
    `);
    console.table(productsWithSalesData);

    // Show sales orders with my_status values
    console.log('\n📊 Sales orders with my_status values:');
    const [salesOrdersWithStatus] = await connection.execute(`
      SELECT so_number, order_date, my_status, status, total_amount
      FROM sales_orders 
      ORDER BY order_date DESC
    `);
    console.table(salesOrdersWithStatus);

    // Show sample order items with product names and my_status
    console.log('\n📋 Sample order items with product names and my_status:');
    const [sampleOrderItems] = await connection.execute(`
      SELECT soi.id, so.so_number, so.my_status, p.product_name, soi.quantity, soi.unit_price, soi.total_price
      FROM sales_order_items soi
      JOIN sales_orders so ON soi.sales_order_id = so.id
      JOIN products p ON soi.product_id = p.id
      ORDER BY so.order_date DESC
      LIMIT 5
    `);
    console.table(sampleOrderItems);

    console.log('\n✅ Product Performance test completed successfully!');
    console.log('🚀 You can now test the Product Performance page in the frontend.');

  } catch (error) {
    console.error('❌ Error during Product Performance test:', error.message);
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Hint: The database specified in .env (DB_NAME) might not exist. Please create it.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Hint: Could not connect to the database. Ensure MySQL server is running and credentials in .env are correct.');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

testProductPerformance();
