const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkChatMembersStructure() {
  let connection;
  
  try {
    console.log('🧪 Checking chat_room_members table structure...\n');

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_moonsun1',
    });

    console.log('🔗 Connected to MySQL database:', process.env.DB_DATABASE || 'impulsep_moonsun1');

    // Check the structure of chat_room_members table
    console.log('\n📊 Chat_room_members table structure:');
    const [columns] = await connection.execute('DESCRIBE chat_room_members');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    console.log('\n🎉 Table structure check completed!');

  } catch (error) {
    console.error('❌ Error checking table structure:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

checkChatMembersStructure();
