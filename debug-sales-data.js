const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugSalesData() {
  let connection;
  
  try {
    console.log('🔍 Debugging sales data...');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'moonsun_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database');

    // Check if tables exist
    const [tables] = await connection.execute("SHOW TABLES LIKE 'Clients'");
    console.log('📋 Clients table exists:', tables.length > 0);
    
    const [salesTables] = await connection.execute("SHOW TABLES LIKE 'sales_orders'");
    console.log('📋 sales_orders table exists:', salesTables.length > 0);

    // Check client count
    const [clientCount] = await connection.execute("SELECT COUNT(*) as count FROM Clients");
    console.log('👥 Total clients:', clientCount[0].count);

    // Check sales orders count
    const [orderCount] = await connection.execute("SELECT COUNT(*) as count FROM sales_orders");
    console.log('📦 Total sales orders:', orderCount[0].count);

    // Check recent orders
    const [recentOrders] = await connection.execute(`
      SELECT 
        so.id, 
        so.client_id, 
        so.order_date, 
        so.total_amount,
        c.name as client_name
      FROM sales_orders so
      LEFT JOIN Clients c ON so.client_id = c.id
      ORDER BY so.order_date DESC
      LIMIT 5
    `);
    
    console.log('📊 Recent orders:');
    recentOrders.forEach(order => {
      console.log(`  - Order ${order.id}: ${order.client_name} - $${order.total_amount} (${order.order_date})`);
    });

    // Check orders by year
    const currentYear = new Date().getFullYear();
    const [yearOrders] = await connection.execute(`
      SELECT 
        YEAR(order_date) as year,
        COUNT(*) as order_count,
        SUM(total_amount) as total_amount
      FROM sales_orders 
      WHERE YEAR(order_date) = ?
      GROUP BY YEAR(order_date)
    `, [currentYear]);
    
    console.log(`📅 Orders for ${currentYear}:`, yearOrders);

    // Check if there are any orders for the current year
    if (yearOrders.length === 0) {
      console.log('⚠️ No orders found for current year. Checking all years...');
      
      const [allYears] = await connection.execute(`
        SELECT 
          YEAR(order_date) as year,
          COUNT(*) as order_count,
          SUM(total_amount) as total_amount
        FROM sales_orders 
        GROUP BY YEAR(order_date)
        ORDER BY year DESC
      `);
      
      console.log('📅 Orders by year:');
      allYears.forEach(year => {
        console.log(`  - ${year.year}: ${year.order_count} orders, $${year.total_amount}`);
      });
    }

  } catch (error) {
    console.error('❌ Error debugging sales data:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the debug script
debugSalesData();
