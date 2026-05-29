const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function hashPasswords() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'moonsun_db',
    port: process.env.DB_PORT || 3306,
  });

  try {
    console.log('🔐 Starting password hashing process...');
    
    // Get all staff with unhashed passwords
    const [staff] = await connection.execute(
      'SELECT id, password FROM staff WHERE password IS NOT NULL AND password NOT LIKE "$2a$%"'
    );

    console.log(`Found ${staff.length} staff members with unhashed passwords`);

    for (const member of staff) {
      const hashedPassword = await bcrypt.hash(member.password, 12);
      
      await connection.execute(
        'UPDATE staff SET password = ? WHERE id = ?',
        [hashedPassword, member.id]
      );
      
      console.log(`✅ Hashed password for staff ID: ${member.id}`);
    }

    console.log('🎉 Password hashing completed successfully!');
  } catch (error) {
    console.error('❌ Error hashing passwords:', error);
  } finally {
    await connection.end();
  }
}

hashPasswords();
