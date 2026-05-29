const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkColumn() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'royal_air',
    });

    console.log('🔍 Checking if default_currency column exists in agencies table...\n');

    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'agencies'
      AND COLUMN_NAME = 'default_currency'
    `, [process.env.DB_NAME || 'royal_air']);

    if (columns.length === 0) {
      console.log('❌ Column default_currency does NOT exist in agencies table!');
      console.log('\n📝 Please run the migration:');
      console.log('   Run the SQL in: backend/database/add-currency-to-agencies.sql');
      console.log('\n   Or execute:');
      console.log('   ALTER TABLE agencies ADD COLUMN default_currency VARCHAR(3) NULL AFTER max_pax_per_booking;');
      console.log('   CREATE INDEX idx_default_currency ON agencies (default_currency);');
    } else {
      console.log('✅ Column default_currency EXISTS in agencies table!');
      console.log('\nColumn details:');
      columns.forEach(col => {
        console.log(`  - Name: ${col.COLUMN_NAME}`);
        console.log(`  - Type: ${col.DATA_TYPE}`);
        console.log(`  - Nullable: ${col.IS_NULLABLE}`);
        console.log(`  - Default: ${col.COLUMN_DEFAULT || 'NULL'}`);
      });
    }

    // Also check all columns in agencies table
    const [allColumns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'agencies'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'royal_air']);

    console.log('\n📋 All columns in agencies table:');
    allColumns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE})`);
    });

  } catch (error) {
    console.error('❌ Error checking column:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkColumn();

