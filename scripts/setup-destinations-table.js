const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDestinationsTable() {
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
      CREATE TABLE IF NOT EXISTS destinations (
        id INT(11) NOT NULL AUTO_INCREMENT,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        country_id INT(11) NULL,
        longitude DECIMAL(10,7) NULL,
        latitude DECIMAL(10,7) NULL,
        timezone VARCHAR(100) NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        father_code VARCHAR(50) NULL,
        destination VARCHAR(255) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_code (code),
        INDEX idx_status (status),
        INDEX idx_country_id (country_id),
        INDEX idx_father_code (father_code),
        FOREIGN KEY (country_id) REFERENCES Country(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createTableSQL);
    console.log('✅ destinations table created successfully');

  } catch (error) {
    console.error('❌ Error creating destinations table:', error.message);
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('ℹ️  Table destinations already exists');
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

setupDestinationsTable().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});

