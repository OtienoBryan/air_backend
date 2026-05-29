const mysql = require('mysql2/promise');
require('dotenv').config();

async function testLogin() {
  let connection;
  
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_moonsun1',
    });

    console.log('🔗 Connected to MySQL database');

    // Test the exact query that the auth service uses
    const email = 'admin@moonsun.com';
    const password = 'admin123';
    
    console.log(`\n🔍 Testing login for: ${email}`);
    
    const [staff] = await connection.execute(
      'SELECT id, name, business_email, password, is_active, role FROM staff WHERE business_email = ?',
      [email]
    );

    if (staff.length === 0) {
      console.log('❌ No staff found with this email');
    } else {
      const user = staff[0];
      console.log('✅ Staff found:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.business_email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Is Active: ${user.is_active}`);
      console.log(`   Role: ${user.role}`);
      
      if (user.password === password) {
        console.log('✅ Password matches!');
      } else {
        console.log('❌ Password does not match!');
        console.log(`   Expected: ${password}`);
        console.log(`   Actual: ${user.password}`);
      }
      
      if (user.is_active) {
        console.log('✅ User is active');
      } else {
        console.log('❌ User is not active');
      }
    }

    // Show all users with business_email
    console.log('\n📋 All users with business_email:');
    const [allUsers] = await connection.execute(
      'SELECT id, name, business_email, role, is_active FROM staff WHERE business_email IS NOT NULL AND business_email != ""'
    );
    
    allUsers.forEach(user => {
      console.log(`   ${user.id}: ${user.name} (${user.business_email}) - Role: ${user.role} - Active: ${user.is_active}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

testLogin();
