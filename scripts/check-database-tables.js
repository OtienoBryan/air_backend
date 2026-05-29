const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabaseTables() {
  let connection;
  
  try {
    console.log('🔍 Checking database tables...\n');

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_moonsun1',
    });

    console.log('🔗 Connected to MySQL database:', process.env.DB_DATABASE || 'impulsep_moonsun1');

    // List all tables
    console.log('\n📊 All tables in database:');
    const [tables] = await connection.execute("SHOW TABLES");
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });

    // Check for chat-related tables
    console.log('\n📊 Chat-related tables:');
    const chatTables = ['chat_rooms', 'chat_room_members', 'room_members', 'chat_messages'];
    
    for (const tableName of chatTables) {
      const [exists] = await connection.execute(`SHOW TABLES LIKE '${tableName}'`);
      if (exists.length > 0) {
        console.log(`   ✅ ${tableName} exists`);
        
        // Show structure
        const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
        console.log(`   📋 Structure of ${tableName}:`);
        columns.forEach(col => {
          console.log(`      - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
        });
        
        // Show sample data
        const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`   📊 Row count: ${count[0].count}`);
        
        if (count[0].count > 0) {
          const [sample] = await connection.execute(`SELECT * FROM ${tableName} LIMIT 3`);
          console.log(`   📝 Sample data:`);
          sample.forEach(row => {
            console.log(`      ${JSON.stringify(row)}`);
          });
        }
        console.log('');
      } else {
        console.log(`   ❌ ${tableName} does not exist`);
      }
    }

  } catch (error) {
    console.error('❌ Error checking database tables:', error.message);
    console.error('Full error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

checkDatabaseTables();
