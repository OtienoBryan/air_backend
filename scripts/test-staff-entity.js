const mysql = require('mysql2/promise');
require('dotenv').config();

async function testStaffEntity() {
  let connection;
  
  try {
    console.log('🧪 Testing Staff entity queries...\n');

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_moonsun1',
    });

    console.log('🔗 Connected to MySQL database:', process.env.DB_DATABASE || 'impulsep_moonsun1');

    // Test the exact query that AuthService uses
    console.log('\n📊 Test 1: Testing AuthService query...');
    const [staff] = await connection.execute(
      'SELECT * FROM staff WHERE business_email = ?',
      ['admin@moonsun.com']
    );
    
    console.log(`   Found ${staff.length} staff with business_email 'admin@moonsun.com':`);
    if (staff.length > 0) {
      const member = staff[0];
      console.log(`   - ID: ${member.id}`);
      console.log(`   - Name: ${member.name}`);
      console.log(`   - Business Email: ${member.business_email}`);
      console.log(`   - Is Active: ${member.is_active}`);
      console.log(`   - Password: ${member.password ? 'Set' : 'Not set'}`);
    }

    // Test with different email formats
    console.log('\n📊 Test 2: Testing with different email formats...');
    const [staff2] = await connection.execute(
      'SELECT * FROM staff WHERE business_email = ? OR business_email = ?',
      ['admin@moonsun.com', 'admin@moonsun.com']
    );
    console.log(`   Found ${staff2.length} staff with various email formats`);

    // Check all staff with business_email
    console.log('\n📊 Test 3: All staff with business_email...');
    const [allStaff] = await connection.execute(
      'SELECT id, name, business_email, is_active FROM staff WHERE business_email IS NOT NULL AND business_email != ""'
    );
    console.log(`   Found ${allStaff.length} staff with business emails:`);
    allStaff.forEach(member => {
      console.log(`   - ${member.id}: ${member.name} (${member.business_email}) - Active: ${member.is_active}`);
    });

    // Test the exact query structure that might be causing issues
    console.log('\n📊 Test 4: Testing query with NULL handling...');
    const [staff3] = await connection.execute(`
      SELECT id, name, business_email, is_active, password 
      FROM staff 
      WHERE business_email = ? AND is_active = 1
    `, ['admin@moonsun.com']);
    
    console.log(`   Query result: ${staff3.length} active staff`);
    if (staff3.length > 0) {
      const member = staff3[0];
      console.log(`   - Valid staff found: ${member.name}`);
      console.log(`   - Password match test: ${member.password === 'admin123' ? 'YES' : 'NO'}`);
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Error testing staff entity:', error.message);
    console.error('Full error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

testStaffEntity();
