const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupPassengersTable() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // Read SQL file
    const fs = require('fs');
    const path = require('path');
    const sqlFilePath = path.join(__dirname, '../database/passengers-table.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('📝 Creating passengers table...');
    await connection.query(sql);
    console.log('✅ Passengers table created successfully!');

  } catch (error) {
    console.error('❌ Error setting up passengers table:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

setupPassengersTable();

