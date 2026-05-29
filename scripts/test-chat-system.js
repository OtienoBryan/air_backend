const mysql = require('mysql2/promise');
require('dotenv').config();

async function testChatSystem() {
  let connection;
  
  try {
    console.log('🧪 Testing chat system...\n');

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_moonsun1',
    });

    console.log('🔗 Connected to MySQL database:', process.env.DB_DATABASE || 'impulsep_moonsun1');

    // Check if chat tables exist
    const [chatRooms] = await connection.execute('SHOW TABLES LIKE "chat_rooms"');
    const [chatMessages] = await connection.execute('SHOW TABLES LIKE "chat_messages"');
    const [chatRoomMembers] = await connection.execute('SHOW TABLES LIKE "chat_room_members"');

    console.log('\n📊 Chat Tables Status:');
    console.log(`   chat_rooms: ${chatRooms.length > 0 ? '✅ Exists' : '❌ Missing'}`);
    console.log(`   chat_messages: ${chatMessages.length > 0 ? '✅ Exists' : '❌ Missing'}`);
    console.log(`   chat_room_members: ${chatRoomMembers.length > 0 ? '✅ Exists' : '❌ Missing'}`);

    if (chatRooms.length > 0) {
      // Check existing chat rooms
      const [rooms] = await connection.execute('SELECT COUNT(*) as count FROM chat_rooms');
      console.log(`\n💬 Chat Rooms: ${rooms[0].count} existing`);

      // Check existing messages
      const [messages] = await connection.execute('SELECT COUNT(*) as count FROM chat_messages');
      console.log(`💬 Messages: ${messages[0].count} existing`);

      // Check staff members
      const [staff] = await connection.execute('SELECT COUNT(*) as count FROM staff WHERE is_active = 1');
      console.log(`👥 Active Staff: ${staff[0].count} members`);
    }

    // Test creating a sample chat room
    console.log('\n🚀 Testing chat room creation...');
    
    // Get first two staff members
    const [staffMembers] = await connection.execute('SELECT id, name FROM staff WHERE is_active = 1 LIMIT 2');
    
    if (staffMembers.length >= 2) {
      // Create a test chat room
      const [roomResult] = await connection.execute(
        'INSERT INTO chat_rooms (name, description, created_by, is_group) VALUES (?, ?, ?, ?)',
        ['Test Chat Room', 'A test chat room for development', staffMembers[0].id, 1]
      );

      const roomId = roomResult.insertId;

      // Add members to the room
      for (const member of staffMembers) {
        await connection.execute(
          'INSERT INTO chat_room_members (room_id, staff_id) VALUES (?, ?)',
          [roomId, member.id]
        );
      }

      console.log(`✅ Test chat room created with ID: ${roomId}`);

      // Add a test message
      await connection.execute(
        'INSERT INTO chat_messages (message, room_id, sender_id, messageType) VALUES (?, ?, ?, ?)',
        ['Hello! This is a test message.', roomId, staffMembers[0].id, 'text']
      );

      console.log('✅ Test message added');

      // Clean up test data
      await connection.execute('DELETE FROM chat_messages WHERE room_id = ?', [roomId]);
      await connection.execute('DELETE FROM chat_room_members WHERE room_id = ?', [roomId]);
      await connection.execute('DELETE FROM chat_rooms WHERE id = ?', [roomId]);

      console.log('🧹 Test data cleaned up');
    } else {
      console.log('⚠️  Need at least 2 staff members to test chat room creation');
    }

    console.log('\n🎉 Chat system test completed successfully!');

  } catch (error) {
    console.error('❌ Error testing chat system:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

testChatSystem();
