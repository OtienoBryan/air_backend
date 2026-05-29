const mysql = require('mysql2/promise');
require('dotenv').config();

async function addNumberOfSeatsColumn() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_royal',
    });

    console.log('🔗 Connected to MySQL database');

    // Check if column already exists and add it if it doesn't
    try {
      const [columns] = await connection.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'flight_series' AND COLUMN_NAME = 'number_of_seats'`,
        [process.env.DB_DATABASE || 'impulsep_royal']
      );

      if (columns.length === 0) {
        await connection.execute(
          `ALTER TABLE flight_series ADD COLUMN number_of_seats INT(11) NULL AFTER sta`
        );
        console.log('✅ Added column: number_of_seats');
      } else {
        console.log('ℹ️  Column number_of_seats already exists');
      }
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        console.error('❌ Error adding column number_of_seats:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error updating flight_series table:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

addNumberOfSeatsColumn().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});

