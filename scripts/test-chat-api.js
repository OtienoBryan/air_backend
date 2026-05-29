const mysql = require('mysql2/promise');
require('dotenv').config();

async function testChatAPI() {
  let connection;
  
  try {
    console.log('🧪 Testing chat API data...\n');

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_moonsun1',
    });

    console.log('🔗 Connected to MySQL database:', process.env.DB_DATABASE || 'impulsep_moonsun1');

    // Test the query that the ChatService uses
    console.log('\n📊 Testing ChatService query for user ID 2:');
    
    const query = `
      SELECT 
        room.id,
        room.name,
        room.description,
        room.is_group,
        room.created_by,
        room.created_at,
        members.id as member_id,
        members.name as member_name,
        members.business_email,
        members.role
      FROM chat_rooms room
      LEFT JOIN chat_room_members crm ON room.id = crm.room_id
      LEFT JOIN staff members ON crm.staff_id = members.id
      WHERE crm.staff_id = ?
      ORDER BY room.created_at DESC
    `;
    
    const [results] = await connection.execute(query, [2]);
    console.log(`Found ${results.length} room memberships for user 2`);
    
    // Group by room
    const roomsMap = new Map();
    results.forEach(row => {
      if (!roomsMap.has(row.id)) {
        roomsMap.set(row.id, {
          id: row.id,
          name: row.name,
          description: row.description,
          isGroup: row.is_group,
          createdBy: row.created_by,
          createdAt: row.created_at,
          members: []
        });
      }
      
      if (row.member_id) {
        roomsMap.get(row.id).members.push({
          id: row.member_id,
          name: row.member_name,
          business_email: row.business_email,
          role: row.role
        });
      }
    });
    
    console.log('\n📋 Formatted results:');
    roomsMap.forEach((room, roomId) => {
      console.log(`\n🏠 Room ${roomId}: ${room.name}`);
      console.log(`   Members (${room.members.length}):`);
      room.members.forEach(member => {
        console.log(`   - ${member.name} (${member.business_email}) - ${member.role}`);
      });
    });

    // Also test getting all members for a specific room
    console.log('\n📊 Testing: Get all members for room 1:');
    const roomMembersQuery = `
      SELECT s.id, s.name, s.business_email, s.role
      FROM staff s
      INNER JOIN chat_room_members crm ON s.id = crm.staff_id
      WHERE crm.room_id = ?
    `;
    
    const [roomMembers] = await connection.execute(roomMembersQuery, [1]);
    console.log(`Room 1 has ${roomMembers.length} members:`);
    roomMembers.forEach(member => {
      console.log(`   - ${member.name} (${member.business_email}) - ${member.role}`);
    });

  } catch (error) {
    console.error('❌ Error testing chat API:', error.message);
    console.error('Full error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

testChatAPI();