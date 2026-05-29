const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupStaffTable() {
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

    // Create staff table
    const createStaffTableSQL = `
      CREATE TABLE IF NOT EXISTS staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(50) DEFAULT 'staff',
        isActive BOOLEAN DEFAULT TRUE,
        isEmailVerified BOOLEAN DEFAULT FALSE,
        emailVerificationToken VARCHAR(255),
        passwordResetToken VARCHAR(255),
        passwordResetExpires DATETIME,
        lastLoginAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createStaffTableSQL);
    console.log('✅ Staff table created successfully');

    // Check if admin user already exists
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM staff WHERE email = ?',
      ['admin@moonsun.com']
    );

    if (existingAdmin.length === 0) {
      // Create default admin user
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await connection.execute(
        'INSERT INTO staff (email, password, firstName, lastName, role, isActive, isEmailVerified) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['admin@moonsun.com', hashedPassword, 'Admin', 'User', 'admin', true, true]
      );
      
      console.log('✅ Default admin user created');
      console.log('   Email: admin@moonsun.com');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Show all staff members
    const [staff] = await connection.execute('SELECT id, email, firstName, lastName, role, isActive FROM staff');
    console.log('\n📋 Current staff members:');
    staff.forEach(member => {
      console.log(`   ${member.id}: ${member.firstName} ${member.lastName} (${member.email}) - Role: ${member.role}`);
    });

  } catch (error) {
    console.error('❌ Error setting up staff table:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

setupStaffTable();
