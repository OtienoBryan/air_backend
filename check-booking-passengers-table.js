// Script to check if booking_passengers table exists
const mysql = require('mysql2/promise');

async function checkTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'impulsep_drinks',
  });

  try {
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'booking_passengers'
    `, [process.env.DB_NAME || 'impulsep_drinks']);

    if (tables.length === 0) {
      console.log('❌ booking_passengers table does NOT exist!');
      console.log('📝 Please run the migration SQL:');
      console.log('   backend/database/booking-passengers-table.sql');
    } else {
      console.log('✅ booking_passengers table exists');
      
      // Check table structure
      const [columns] = await connection.execute(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'booking_passengers'
        ORDER BY ORDINAL_POSITION
      `, [process.env.DB_NAME || 'impulsep_drinks']);
      
      console.log('\nTable structure:');
      columns.forEach(col => {
        console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (nullable: ${col.IS_NULLABLE})`);
      });
    }
  } catch (error) {
    console.error('Error checking table:', error.message);
  } finally {
    await connection.end();
  }
}

checkTable();

