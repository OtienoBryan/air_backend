const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkChatTableStructure() {
  let connection;
  
  try {
    console.log('🧪 Checking chat_rooms table structure...\n');

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_moonsun1',
    });

    console.log('🔗 Connected to MySQL database:', process.env.DB_DATABASE || 'impulsep_moonsun1');

    // Check the structure of chat_rooms table
    console.log('\n📊 Chat_rooms table structure:');
    const [columns] = await connection.execute('DESCRIBE chat_rooms');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    // Check if description column exists
    const descriptionColumn = columns.find(col => col.Field === 'description');
    if (descriptionColumn) {
      console.log('\n✅ Description column exists');
    } else {
      console.log('\n❌ Description column does NOT exist');
      console.log('\n🔧 Adding description column...');
      
      try {
        await connection.execute('ALTER TABLE chat_rooms ADD COLUMN description TEXT AFTER name');
        console.log('✅ Description column added successfully');
      } catch (error) {
        console.error('❌ Error adding description column:', error.message);
      }
    }

    // Check the structure again
    console.log('\n📊 Updated chat_rooms table structure:');
    const [updatedColumns] = await connection.execute('DESCRIBE chat_rooms');
    updatedColumns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

    console.log('\n🎉 Table structure check completed!');

  } catch (error) {
    console.error('❌ Error checking table structure:', error.message);
    console.error('Full error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

checkChatTableStructure();
