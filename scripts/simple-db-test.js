const mysql = require('mysql2/promise');

async function testConnection() {
  let connection;
  
  try {
    console.log('🔌 Testing database connection...');
    
    // Try different database configurations
    const configs = [
      {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'impulsep_moonsun1',
        port: 3306
      },
      {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'impulsep_drinks',
        port: 3306
      },
      {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mysql',
        port: 3306
      }
    ];

    for (let i = 0; i < configs.length; i++) {
      const config = configs[i];
      console.log(`\n🔍 Trying config ${i + 1}: ${config.database}@${config.host}:${config.port}`);
      
      try {
        connection = await mysql.createConnection(config);
        console.log(`✅ Connected to ${config.database} successfully!`);
        
        // Test a simple query
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log(`✅ Query test successful: ${JSON.stringify(rows[0])}`);
        
        // Check if sales_orders table exists
        const [tables] = await connection.execute("SHOW TABLES LIKE 'sales_orders'");
        if (tables.length > 0) {
          console.log('✅ sales_orders table exists');
        } else {
          console.log('❌ sales_orders table does not exist');
        }
        
        await connection.end();
        console.log('🔌 Connection closed');
        return;
        
      } catch (error) {
        console.log(`❌ Failed to connect to ${config.database}: ${error.message}`);
        if (connection) {
          try {
            await connection.end();
          } catch (e) {
            // Ignore close errors
          }
        }
      }
    }
    
    console.log('\n❌ Could not connect to any database configuration');
    console.log('💡 Please check:');
    console.log('  1. MySQL server is running');
    console.log('  2. Database credentials are correct');
    console.log('  3. Database exists');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection();
