const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkChatMessagesTable() {
  let connection;
  
  try {
    console.log('🧪 Checking chat_messages table structure...\n');

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_moonsun1',
    });

    console.log('🔗 Connected to MySQL database:', process.env.DB_DATABASE || 'impulsep_moonsun1');

    // Check if table exists
    console.log('\n📊 Checking if chat_messages table exists...');
    const [tables] = await connection.execute("SHOW TABLES LIKE 'chat_messages'");
    
    if (tables.length === 0) {
      console.log('❌ chat_messages table does NOT exist');
      console.log('\n🔧 Creating chat_messages table...');
      
      const createTableSQL = `
        CREATE TABLE chat_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          content TEXT NOT NULL,
          messageType VARCHAR(50) DEFAULT 'text',
          chatRoomId INT NOT NULL,
          senderId INT NOT NULL,
          isRead BOOLEAN DEFAULT FALSE,
          readAt TIMESTAMP NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (chatRoomId) REFERENCES chat_rooms(id) ON DELETE CASCADE,
          FOREIGN KEY (senderId) REFERENCES staff(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
      
      await connection.execute(createTableSQL);
      console.log('✅ chat_messages table created successfully');
    } else {
      console.log('✅ chat_messages table exists');
    }

    // Check table structure
    console.log('\n📊 chat_messages table structure:');
    const [columns] = await connection.execute('DESCRIBE chat_messages');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Check existing data
    console.log('\n📊 Existing chat_messages data:');
    const [messages] = await connection.execute('SELECT COUNT(*) as count FROM chat_messages');
    console.log(`   Total messages: ${messages[0].count}`);

    if (messages[0].count > 0) {
      const [sampleMessages] = await connection.execute('SELECT * FROM chat_messages LIMIT 5');
      console.log('   Sample data:');
      sampleMessages.forEach(message => {
        console.log(`   - ID ${message.id}: Room ${message.chatRoomId}, Sender ${message.senderId}`);
      });
    }

    console.log('\n🎉 Chat messages table check completed!');

  } catch (error) {
    console.error('❌ Error checking chat messages table:', error.message);
    console.error('Full error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

checkChatMessagesTable();
