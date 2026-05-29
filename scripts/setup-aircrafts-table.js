const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupAircraftsTable() {
  let connection;
  
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_royal',
    });

    console.log('🔗 Connected to MySQL database');

    // Create aircrafts table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS aircrafts (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        registration VARCHAR(50) NOT NULL UNIQUE,
        capacity INT(11) NULL,
        max_cargo_weight DECIMAL(10,2) NULL,
        category_id INT(11) NULL,
        created_by INT(11) NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_registration (registration),
        INDEX idx_status (status),
        INDEX idx_created_by (created_by),
        INDEX idx_category_id (category_id),
        INDEX idx_created_by (created_by),
        FOREIGN KEY (category_id) REFERENCES Category(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createTableSQL);
    console.log('✅ Aircrafts table created successfully');

    // Check existing aircrafts
    const [aircrafts] = await connection.execute('SELECT COUNT(*) as count FROM aircrafts');
    console.log(`📊 Current aircrafts in database: ${aircrafts[0].count}`);

  } catch (error) {
    console.error('❌ Error setting up aircrafts table:', error.message);
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('ℹ️  Table already exists');
    } else {
      process.exit(1);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

setupAircraftsTable();

