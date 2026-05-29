const mysql = require('mysql2/promise');

// Try different database configurations
const configs = [
  {
    name: 'Default (localhost, root, no password)',
    config: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'impulsep_moonsun1',
      port: 3306
    }
  },
  {
    name: 'Default with test database',
    config: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'test',
      port: 3306
    }
  },
  {
    name: 'Default with mysql database',
    config: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'mysql',
      port: 3306
    }
  },
  {
    name: 'Default without database',
    config: {
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    }
  }
];

async function testConnection(config) {
  let connection;
  try {
    console.log(`\n🔌 Testing: ${config.name}`);
    console.log(`   Host: ${config.config.host}:${config.config.port}`);
    console.log(`   User: ${config.config.user}`);
    console.log(`   Database: ${config.config.database || 'none'}`);
    
    connection = await mysql.createConnection(config.config);
    console.log('   ✅ Connection successful!');
    
    // Test a simple query
    const [result] = await connection.execute('SELECT 1 as test');
    console.log('   ✅ Query test successful!');
    
    // If we have a database, check for tables
    if (config.config.database) {
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`   📋 Found ${tables.length} tables`);
      
      if (tables.length > 0) {
        console.log('   Tables:');
        tables.forEach(table => {
          const tableName = Object.values(table)[0];
          console.log(`     - ${tableName}`);
        });
      }
    }
    
    return true;
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function testAllConnections() {
  console.log('🚀 Testing database connections...\n');
  
  let successCount = 0;
  for (const config of configs) {
    const success = await testConnection(config);
    if (success) successCount++;
  }
  
  console.log(`\n📊 Results: ${successCount}/${configs.length} connections successful`);
  
  if (successCount === 0) {
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Make sure MySQL server is running');
    console.log('   2. Check if MySQL is installed');
    console.log('   3. Try starting MySQL service:');
    console.log('      - Windows: net start mysql');
    console.log('      - macOS: brew services start mysql');
    console.log('      - Linux: sudo systemctl start mysql');
    console.log('   4. Check if MySQL is running on a different port');
    console.log('   5. Verify username/password credentials');
  }
}

testAllConnections().catch(console.error);
