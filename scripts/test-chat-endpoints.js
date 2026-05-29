const mysql = require('mysql2/promise');
require('dotenv').config();

async function testChatEndpoints() {
  let connection;
  
  try {
    console.log('🧪 Testing chat endpoints...\n');

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_moonsun1',
    });

    console.log('🔗 Connected to MySQL database:', process.env.DB_DATABASE || 'impulsep_moonsun1');

    // Test 1: Check if staff table has data
    console.log('\n📊 Test 1: Checking staff table...');
    const [staff] = await connection.execute('SELECT id, name, business_email, role, is_active FROM staff');
    console.log(`   Found ${staff.length} staff members:`);
    staff.forEach(member => {
      console.log(`   - ${member.id}: ${member.name} (${member.business_email}) - Active: ${member.is_active}`);
    });

    // Test 2: Check active staff specifically
    console.log('\n📊 Test 2: Checking active staff...');
    const [activeStaff] = await connection.execute('SELECT id, name, business_email, role FROM staff WHERE is_active = 1');
    console.log(`   Found ${activeStaff.length} active staff members:`);
    activeStaff.forEach(member => {
      console.log(`   - ${member.id}: ${member.name} (${member.business_email})`);
    });

    // Test 3: Check chat tables
    console.log('\n📊 Test 3: Checking chat tables...');
    const [chatRooms] = await connection.execute('SELECT COUNT(*) as count FROM chat_rooms');
    const [chatMessages] = await connection.execute('SELECT COUNT(*) as count FROM chat_messages');
    const [chatMembers] = await connection.execute('SELECT COUNT(*) as count FROM chat_room_members');
    
    console.log(`   Chat rooms: ${chatRooms[0].count}`);
    console.log(`   Chat messages: ${chatMessages[0].count}`);
    console.log(`   Chat room members: ${chatMembers[0].count}`);

    // Test 4: Test the exact query from ChatService
    console.log('\n📊 Test 4: Testing ChatService query...');
    const [testStaff] = await connection.execute(`
      SELECT staff.id, staff.name, staff.business_email, staff.role, staff.avatar_url 
      FROM staff 
      WHERE staff.is_active = 1
    `);
    console.log(`   Query result: ${testStaff.length} staff members`);
    testStaff.forEach(member => {
      console.log(`   - ${member.id}: ${member.name} (${member.business_email})`);
    });

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Error testing chat endpoints:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

testChatEndpoints();
