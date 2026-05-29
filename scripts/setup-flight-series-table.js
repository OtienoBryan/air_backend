const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupFlightSeriesTable() {
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

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS flight_series (
        id INT(11) NOT NULL AUTO_INCREMENT,
        flt VARCHAR(50) NOT NULL,
        aircraft_id INT(11) NULL,
        flight_type VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        std TIME NULL,
        sta TIME NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_flt (flt),
        INDEX idx_aircraft_id (aircraft_id),
        INDEX idx_flight_type (flight_type),
        INDEX idx_start_date (start_date),
        INDEX idx_end_date (end_date),
        FOREIGN KEY (aircraft_id) REFERENCES aircrafts(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createTableSQL);
    console.log('✅ flight_series table created successfully');

  } catch (error) {
    console.error('❌ Error creating flight_series table:', error.message);
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('ℹ️  Table flight_series already exists');
    } else {
      throw error;
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

setupFlightSeriesTable().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});

