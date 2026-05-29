const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupNewDatabase() {
  let connection;
  
  try {
    console.log('🚀 Setting up MoonSun database with staff authentication...\n');

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_moonsun1',
    });

    console.log('🔗 Connected to MySQL database:', process.env.DB_DATABASE || 'impulsep_moonsun1');

    // Note: Staff table already exists with the correct schema
    console.log('ℹ️  Staff table already exists with the correct schema');


    // Check if admin user already exists
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM staff WHERE business_email = ?',
      ['admin@moonsun.com']
    );

    if (existingAdmin.length === 0) {
      // Create default admin user with all required fields
      const password = 'admin123';
      
      await connection.execute(
        `INSERT INTO staff (
          name, photo_url, empl_no, id_no, role, designation, phone_number, 
          password, department, business_email, department_email, 
          employment_type, gender, is_active, avatar_url, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Admin User',           // name
          '',                     // photo_url
          'ADMIN001',            // empl_no
          'ID001',               // id_no
          'admin',               // role
          'System Administrator', // designation
          '0000000000',          // phone_number
          password,              // password
          'IT',                  // department
          'admin@moonsun.com',   // business_email
          'admin@moonsun.com',   // department_email
          'Full-time',           // employment_type
          'Other',               // gender
          1,                     // is_active
          '',                    // avatar_url
          1                      // status
        ]
      );
      
      console.log('✅ Default admin user created');
      console.log('   Email: admin@moonsun.com');
      console.log('   Password: admin123');
      console.log('   Name: Admin User');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Show all staff members
    const [staff] = await connection.execute('SELECT id, business_email, name, role, is_active FROM staff');
    console.log('\n📋 Current staff members:');
    staff.forEach(member => {
      console.log(`   ${member.id}: ${member.name} (${member.business_email}) - Role: ${member.role}`);
    });

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Make sure your .env file has DB_DATABASE=impulsep_moonsun1');
    console.log('2. Install bcrypt dependency: npm install bcrypt @types/bcrypt');
    console.log('3. Start your backend server: npm run start:dev');
    console.log('4. Start your frontend admin panel: npm run dev');
    console.log('5. Login with admin@moonsun.com / admin123');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Tip: Make sure the database "impulsep_moonsun1" exists in MySQL');
      console.log('   You can create it with: CREATE DATABASE impulsep_moonsun1;');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

setupNewDatabase();
