const mysql = require('mysql2/promise');
require('dotenv').config();

async function addPassengerIdToSeatReservations() {
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

    // Add passenger_id column
    console.log('📝 Adding passenger_id column to seat_reservations table...');
    await connection.query(`
      ALTER TABLE seat_reservations 
      ADD COLUMN passenger_id INT(11) NULL AFTER flight_series_id,
      ADD INDEX idx_passenger_id (passenger_id),
      ADD FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE SET NULL
    `);
    
    console.log('✅ passenger_id column added successfully!');

  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  passenger_id column already exists, skipping...');
    } else {
      console.error('❌ Error adding passenger_id column:', error.message);
      throw error;
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

addPassengerIdToSeatReservations();


