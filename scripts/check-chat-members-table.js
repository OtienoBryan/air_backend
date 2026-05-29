const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkChatMembersTable() {
  let connection;
  
  try {
    console.log('🧪 Checking chat_room_members table...\n');

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
    console.log('\n📊 Checking if chat_room_members table exists...');
    const [tables] = await connection.execute("SHOW TABLES LIKE 'chat_room_members'");
    
    if (tables.length === 0) {
      console.log('❌ chat_room_members table does NOT exist');
      console.log('\n🔧 Creating chat_room_members table...');
      
      const createTableSQL = `
        CREATE TABLE chat_room_members (
          id INT AUTO_INCREMENT PRIMARY KEY,
          chatRoomId INT NOT NULL,
          staffId INT NOT NULL,
          joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (chatRoomId) REFERENCES chat_rooms(id) ON DELETE CASCADE,
          FOREIGN KEY (staffId) REFERENCES staff(id) ON DELETE CASCADE,
          UNIQUE KEY unique_member_room (chatRoomId, staffId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
      
      await connection.execute(createTableSQL);
      console.log('✅ chat_room_members table created successfully');
    } else {
      console.log('✅ chat_room_members table exists');
    }

    // Check table structure
    console.log('\n📊 chat_room_members table structure:');
    const [columns] = await connection.execute('DESCRIBE chat_room_members');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Check existing data
    console.log('\n📊 Existing chat_room_members data:');
    const [members] = await connection.execute('SELECT COUNT(*) as count FROM chat_room_members');
    console.log(`   Total memberships: ${members[0].count}`);

    if (members[0].count > 0) {
      const [sampleMembers] = await connection.execute('SELECT * FROM chat_room_members LIMIT 5');
      console.log('   Sample data:');
      sampleMembers.forEach(member => {
        console.log(`   - Room ${member.chatRoomId}: Staff ${member.staffId}`);
      });
    }

    console.log('\n🎉 Chat members table check completed!');

  } catch (error) {
    console.error('❌ Error checking chat members table:', error.message);
    console.error('Full error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

checkChatMembersTable();
