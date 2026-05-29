const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupChatTables() {
  let connection;
  
  try {
    console.log('🚀 Setting up chat tables...\n');

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_moonsun1',
    });

    console.log('🔗 Connected to MySQL database:', process.env.DB_DATABASE || 'impulsep_moonsun1');

    // Create chat_rooms table
    const createChatRoomsTableSQL = `
      CREATE TABLE IF NOT EXISTS chat_rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        isActive BOOLEAN DEFAULT TRUE,
        type VARCHAR(50) DEFAULT 'private',
        createdBy INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createChatRoomsTableSQL);
    console.log('✅ Chat rooms table created successfully');

    // Create chat_room_members table (junction table)
    const createChatRoomMembersTableSQL = `
      CREATE TABLE IF NOT EXISTS chat_room_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chatRoomId INT NOT NULL,
        staffId INT NOT NULL,
        joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chatRoomId) REFERENCES chat_rooms(id) ON DELETE CASCADE,
        FOREIGN KEY (staffId) REFERENCES staff(id) ON DELETE CASCADE,
        UNIQUE KEY unique_member_room (chatRoomId, staffId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createChatRoomMembersTableSQL);
    console.log('✅ Chat room members table created successfully');

    // Create chat_messages table
    const createChatMessagesTableSQL = `
      CREATE TABLE IF NOT EXISTS chat_messages (
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

    await connection.execute(createChatMessagesTableSQL);
    console.log('✅ Chat messages table created successfully');

    // Create indexes for better performance
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_chat_rooms_createdBy ON chat_rooms(createdBy)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_chat_room_members_staffId ON chat_room_members(staffId)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_chat_messages_roomId ON chat_messages(chatRoomId)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_chat_messages_senderId ON chat_messages(senderId)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_chat_messages_createdAt ON chat_messages(createdAt)');
    
    console.log('✅ Indexes created successfully');

    console.log('\n🎉 Chat tables setup completed successfully!');
    console.log('\n📝 Chat system is ready to use');

  } catch (error) {
    console.error('❌ Error setting up chat tables:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

setupChatTables();
