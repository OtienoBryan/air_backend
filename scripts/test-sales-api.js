const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'impulsep_moonsun1',
  port: process.env.DB_PORT || 3306
};

async function testSalesOrdersAPI() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully');

    // Test 1: Check if sales_orders table exists
    console.log('\n📋 Testing sales_orders table...');
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'sales_orders'"
    );
    
    if (tables.length === 0) {
      console.log('❌ sales_orders table does not exist');
      console.log('📝 Creating sales_orders table...');
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS sales_orders (
          id int(11) NOT NULL AUTO_INCREMENT,
          so_number varchar(20) NOT NULL UNIQUE,
          client_id int(11) NOT NULL,
          order_date date NOT NULL,
          expected_delivery_date date DEFAULT NULL,
          subtotal decimal(15,2) DEFAULT 0.00,
          tax_amount decimal(15,2) DEFAULT 0.00,
          total_amount decimal(15,2) DEFAULT 0.00,
          net_price decimal(11,2) NOT NULL,
          notes text DEFAULT NULL,
          created_by varchar(255) DEFAULT NULL,
          salesrep int(11) DEFAULT NULL,
          created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          rider_id int(11) DEFAULT NULL,
          assigned_at timestamp NULL DEFAULT '0000-00-00 00:00:00',
          recepients_name varchar(255) DEFAULT NULL,
          recepients_contact varchar(255) DEFAULT NULL,
          dispatched_by int(11) DEFAULT NULL,
          status enum('draft','confirmed','shipped','delivered','cancelled','in payment','paid') DEFAULT 'draft',
          my_status tinyint(3) NOT NULL,
          received_into_stock tinyint(1) NOT NULL DEFAULT 0,
          delivered_at timestamp NULL DEFAULT NULL,
          delivery_notes varchar(255) NOT NULL,
          received_by int(11) NOT NULL,
          received_at datetime DEFAULT NULL,
          delivery_image varchar(500) DEFAULT NULL,
          returned_at datetime DEFAULT NULL,
          PRIMARY KEY (id),
          KEY idx_client_id (client_id),
          KEY idx_order_date (order_date),
          KEY idx_status (status),
          KEY idx_created_by (created_by),
          KEY idx_salesrep (salesrep),
          KEY idx_rider_id (rider_id),
          KEY idx_delivery_image (delivery_image)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
      
      await connection.execute(createTableSQL);
      console.log('✅ sales_orders table created successfully');
    } else {
      console.log('✅ sales_orders table exists');
    }

    // Test 2: Check table structure
    console.log('\n🔍 Checking table structure...');
    const [columns] = await connection.execute('DESCRIBE sales_orders');
    console.log('📊 Table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });

    // Test 3: Insert sample data if table is empty
    console.log('\n📊 Checking for existing data...');
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM sales_orders');
    const recordCount = countResult[0].count;
    
    if (recordCount === 0) {
      console.log('📝 No data found, inserting sample sales orders...');
      
      const sampleOrders = [
        {
          so_number: 'SO-2024-001',
          client_id: 1,
          order_date: '2024-01-15',
          expected_delivery_date: '2024-01-20',
          subtotal: 1000.00,
          tax_amount: 100.00,
          total_amount: 1100.00,
          net_price: 1000.00,
          notes: 'Sample order 1',
          created_by: 'admin',
          salesrep: 1,
          status: 'delivered',
          my_status: 1,
          received_into_stock: 1,
          delivery_notes: 'Delivered successfully',
          received_by: 1,
          recepients_name: 'John Doe',
          recepients_contact: '+1234567890'
        },
        {
          so_number: 'SO-2024-002',
          client_id: 2,
          order_date: '2024-01-20',
          expected_delivery_date: '2024-01-25',
          subtotal: 1500.00,
          tax_amount: 150.00,
          total_amount: 1650.00,
          net_price: 1500.00,
          notes: 'Sample order 2',
          created_by: 'admin',
          salesrep: 1,
          status: 'confirmed',
          my_status: 1,
          received_into_stock: 0,
          delivery_notes: 'Ready for delivery',
          received_by: 1,
          recepients_name: 'Jane Smith',
          recepients_contact: '+1234567891'
        },
        {
          so_number: 'SO-2024-003',
          client_id: 1,
          order_date: '2024-02-10',
          expected_delivery_date: '2024-02-15',
          subtotal: 800.00,
          tax_amount: 80.00,
          total_amount: 880.00,
          net_price: 800.00,
          notes: 'Sample order 3',
          created_by: 'admin',
          salesrep: 2,
          status: 'shipped',
          my_status: 1,
          received_into_stock: 0,
          delivery_notes: 'Shipped via courier',
          received_by: 1,
          recepients_name: 'John Doe',
          recepients_contact: '+1234567890'
        }
      ];

      for (const order of sampleOrders) {
        await connection.execute(
          `INSERT INTO sales_orders (
            so_number, client_id, order_date, expected_delivery_date,
            subtotal, tax_amount, total_amount, net_price, notes,
            created_by, salesrep, status, my_status, received_into_stock,
            delivery_notes, received_by, recepients_name, recepients_contact
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            order.so_number, order.client_id, order.order_date, order.expected_delivery_date,
            order.subtotal, order.tax_amount, order.total_amount, order.net_price, order.notes,
            order.created_by, order.salesrep, order.status, order.my_status, order.received_into_stock,
            order.delivery_notes, order.received_by, order.recepients_name, order.recepients_contact
          ]
        );
      }
      
      console.log(`✅ Inserted ${sampleOrders.length} sample sales orders`);
    } else {
      console.log(`✅ Found ${recordCount} existing sales orders`);
    }

    // Test 4: Test sales analytics query
    console.log('\n📈 Testing sales analytics query...');
    const currentYear = new Date().getFullYear();
    
    const [analyticsResult] = await connection.execute(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value
      FROM sales_orders 
      WHERE YEAR(order_date) = ?
    `, [currentYear]);
    
    console.log('📊 Sales Analytics for', currentYear, ':');
    console.log(`  - Total Orders: ${analyticsResult[0].total_orders}`);
    console.log(`  - Total Revenue: $${analyticsResult[0].total_revenue || 0}`);
    console.log(`  - Average Order Value: $${analyticsResult[0].average_order_value || 0}`);

    // Test 5: Test monthly breakdown
    console.log('\n📅 Testing monthly breakdown...');
    const [monthlyResult] = await connection.execute(`
      SELECT 
        MONTH(order_date) as month,
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM sales_orders 
      WHERE YEAR(order_date) = ?
      GROUP BY MONTH(order_date)
      ORDER BY month
    `, [currentYear]);
    
    console.log('📊 Monthly Breakdown:');
    monthlyResult.forEach(row => {
      const monthName = new Date(0, row.month - 1).toLocaleString('default', { month: 'short' });
      console.log(`  - ${monthName}: ${row.orders} orders, $${row.revenue || 0} revenue`);
    });

    // Test 6: Test client breakdown
    console.log('\n👥 Testing client breakdown...');
    const [clientResult] = await connection.execute(`
      SELECT 
        client_id,
        recepients_name as client_name,
        recepients_contact as client_contact,
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue
      FROM sales_orders 
      WHERE YEAR(order_date) = ?
      GROUP BY client_id, recepients_name, recepients_contact
      ORDER BY total_revenue DESC
    `, [currentYear]);
    
    console.log('📊 Client Breakdown:');
    clientResult.forEach(row => {
      console.log(`  - Client ${row.client_id} (${row.client_name}): ${row.total_orders} orders, $${row.total_revenue || 0} revenue`);
    });

    console.log('\n✅ All tests completed successfully!');
    console.log('\n🚀 The sales_orders table is ready for the Master Sales page.');
    console.log('📝 You can now start the backend server and test the API endpoints.');

  } catch (error) {
    console.error('❌ Error testing sales orders API:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the test
testSalesOrdersAPI().catch(console.error);
