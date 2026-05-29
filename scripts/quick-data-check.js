const mysql = require('mysql2/promise');

async function quickDataCheck() {
  let connection;
  
  try {
    console.log('🔗 Attempting database connection...');
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'impulsep_moonsun1'
    });

    console.log('✅ Connected to database');

    // Quick check of all tables
    console.log('\n📊 Quick data check:');
    
    const tables = [
      { name: 'sales_orders', query: 'SELECT COUNT(*) as count FROM sales_orders' },
      { name: 'sales_order_items', query: 'SELECT COUNT(*) as count FROM sales_order_items' },
      { name: 'products', query: 'SELECT COUNT(*) as count FROM products' },
      { name: 'Clients', query: 'SELECT COUNT(*) as count FROM Clients' }
    ];

    for (const table of tables) {
      try {
        const [result] = await connection.execute(table.query);
        console.log(`   ${table.name}: ${result[0].count} records`);
      } catch (error) {
        console.log(`   ${table.name}: ERROR - ${error.message}`);
      }
    }

    // Check if we have any sales orders for January 2025
    console.log('\n🔍 Checking for January 2025 data:');
    try {
      const [jan2025] = await connection.execute(`
        SELECT COUNT(*) as count FROM sales_orders 
        WHERE YEAR(order_date) = 2025 AND MONTH(order_date) = 1
      `);
      console.log(`   January 2025 sales orders: ${jan2025[0].count}`);
    } catch (error) {
      console.log(`   January 2025 check failed: ${error.message}`);
    }

    // Show sample sales orders
    console.log('\n📋 Sample sales orders:');
    try {
      const [sample] = await connection.execute(`
        SELECT id, client_id, so_number, order_date, total_amount
        FROM sales_orders 
        ORDER BY order_date DESC 
        LIMIT 3
      `);
      console.table(sample);
    } catch (error) {
      console.log(`   Sample sales orders failed: ${error.message}`);
    }

    console.log('\n✅ Quick check completed');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 MySQL is not running. Start it with: net start mysql');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Database access denied. Check username/password.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Database does not exist. Check database name.');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

quickDataCheck();
