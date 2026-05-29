const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixChatMessagesTable() {
  let connection;
  
  try {
    console.log('🔧 Fixing chat_messages table structure...\n');

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_moonsun1',
    });

    console.log('🔗 Connected to MySQL database:', process.env.DB_DATABASE || 'impulsep_moonsun1');

    // Check current structure
    console.log('\n📊 Current chat_messages table structure:');
    const [columns] = await connection.execute('DESCRIBE chat_messages');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Add missing columns
    const columnsToAdd = [
      { name: 'messageType', sql: 'ADD COLUMN messageType VARCHAR(50) DEFAULT "text" AFTER message' },
      { name: 'isRead', sql: 'ADD COLUMN isRead BOOLEAN DEFAULT FALSE AFTER sender_id' },
      { name: 'readAt', sql: 'ADD COLUMN readAt TIMESTAMP NULL AFTER isRead' }
    ];

    for (const column of columnsToAdd) {
      const exists = columns.find(col => col.Field === column.name);
      if (!exists) {
        try {
          console.log(`\n➕ Adding column: ${column.name}`);
          await connection.execute(`ALTER TABLE chat_messages ${column.sql}`);
          console.log(`✅ Column ${column.name} added successfully`);
        } catch (error) {
          console.error(`❌ Error adding column ${column.name}:`, error.message);
        }
      } else {
        console.log(`ℹ️  Column ${column.name} already exists`);
      }
    }

    // Check final structure
    console.log('\n📊 Final chat_messages table structure:');
    const [finalColumns] = await connection.execute('DESCRIBE chat_messages');
    finalColumns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    console.log('\n🎉 Chat messages table structure fix completed!');

  } catch (error) {
    console.error('❌ Error fixing chat messages table structure:', error.message);
    console.error('Full error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

fixChatMessagesTable();
