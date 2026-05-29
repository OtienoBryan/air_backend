const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateSeatReservationsTable() {
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

    // Drop unique constraint on flight+seat if exists
    try {
      await connection.execute('ALTER TABLE seat_reservations DROP INDEX unique_flight_seat');
      console.log('✅ Dropped unique_flight_seat constraint');
    } catch (error) {
      if (error.code !== 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('ℹ️  unique_flight_seat constraint does not exist or already dropped');
      }
    }

    // Drop seat_number index if exists
    try {
      await connection.execute('ALTER TABLE seat_reservations DROP INDEX idx_seat_number');
      console.log('✅ Dropped idx_seat_number index');
    } catch (error) {
      if (error.code !== 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('ℹ️  idx_seat_number index does not exist');
      }
    }

    // Add number_of_seats column if it doesn't exist
    try {
      await connection.execute('ALTER TABLE seat_reservations ADD COLUMN number_of_seats INT(11) NOT NULL DEFAULT 1 AFTER flight_series_id');
      console.log('✅ Added number_of_seats column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  number_of_seats column already exists');
      } else {
        throw error;
      }
    }

    // Drop seat_number column
    try {
      await connection.execute('ALTER TABLE seat_reservations DROP COLUMN seat_number');
      console.log('✅ Dropped seat_number column');
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('ℹ️  seat_number column does not exist');
      } else {
        throw error;
      }
    }

    // Make booking_reference NOT NULL
    try {
      await connection.execute('ALTER TABLE seat_reservations MODIFY COLUMN booking_reference VARCHAR(50) NOT NULL');
      console.log('✅ Updated booking_reference to NOT NULL');
    } catch (error) {
      console.log('ℹ️  Error updating booking_reference:', error.message);
    }

    // Generate booking references for existing records without one
    try {
      const [rows] = await connection.execute('SELECT id FROM seat_reservations WHERE booking_reference IS NULL OR booking_reference = ""');
      for (const row of rows) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let ref = '';
        for (let i = 0; i < 6; i++) {
          ref += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        await connection.execute('UPDATE seat_reservations SET booking_reference = ? WHERE id = ?', [ref, row.id]);
      }
      console.log(`✅ Generated booking references for ${rows.length} existing records`);
    } catch (error) {
      console.log('ℹ️  Error generating booking references:', error.message);
    }

    console.log('✅ Seat reservations table update completed');

  } catch (error) {
    console.error('❌ Error updating seat reservations table:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

updateSeatReservationsTable().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});

