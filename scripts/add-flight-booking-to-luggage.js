const mysql = require('mysql2/promise');
require('dotenv').config();

async function addFlightBookingToLuggage() {
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

    // Read and execute the SQL file
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, '../database/add-flight-booking-to-luggage.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      try {
        if (statement.trim()) {
          await connection.execute(statement);
          console.log('✅ Executed SQL statement');
        }
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_DUP_KEYNAME') {
          console.log('ℹ️  Column/Index already exists, skipping...');
        } else {
          console.error('❌ Error executing statement:', error.message);
          throw error;
        }
      }
    }

    console.log('✅ Flight and booking references added to luggage table');

    // Update existing luggage records with flight_series_id and booking_id
    console.log('🔄 Updating existing luggage records...');
    const updateQuery = `
      UPDATE luggage l
      INNER JOIN booking_passengers bp ON l.passenger_id = bp.passenger_id
      INNER JOIN bookings b ON bp.booking_id = b.id
      SET l.flight_series_id = b.flight_series_id,
          l.booking_id = b.id
      WHERE l.flight_series_id IS NULL OR l.booking_id IS NULL
    `;
    
    const [result] = await connection.execute(updateQuery);
    console.log(`✅ Updated ${result.affectedRows} luggage records with flight and booking references`);

  } catch (error) {
    console.error('❌ Error updating luggage table:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

addFlightBookingToLuggage().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

