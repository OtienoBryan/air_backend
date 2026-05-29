// Script to check if fare price columns exist in the flight_series table
const mysql = require('mysql2/promise');

async function checkColumns() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'impulsep_drinks',
  });

  try {
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'flight_series'
      AND COLUMN_NAME IN ('adult_fare', 'child_fare', 'infant_fare')
    `, [process.env.DB_NAME || 'impulsep_drinks']);

    console.log('Fare price columns in flight_series table:');
    if (columns.length === 0) {
      console.log('❌ No fare price columns found! You need to run the migration.');
      console.log('Run: ALTER TABLE flight_series ADD COLUMN adult_fare DECIMAL(10, 2) NULL, ADD COLUMN child_fare DECIMAL(10, 2) NULL, ADD COLUMN infant_fare DECIMAL(10, 2) NULL;');
    } else {
      columns.forEach(col => {
        console.log(`✅ ${col.COLUMN_NAME}: ${col.DATA_TYPE} (nullable: ${col.IS_NULLABLE})`);
      });
    }
  } catch (error) {
    console.error('Error checking columns:', error.message);
  } finally {
    await connection.end();
  }
}

checkColumns();

