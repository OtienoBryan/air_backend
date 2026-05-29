const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function addCategoryColumn() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'impulsep_royal',
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // Check if category_id column already exists
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'aircrafts' 
      AND COLUMN_NAME = 'category_id'
    `, [process.env.DB_NAME || 'impulsep_royal']);

    if (columns.length > 0) {
      console.log('✅ category_id column already exists in aircrafts table');
      return;
    }

    // Add category_id column
    console.log('Adding category_id column to aircrafts table...');
    await connection.query(`
      ALTER TABLE aircrafts 
      ADD COLUMN category_id INT(11) NULL AFTER max_cargo_weight,
      ADD INDEX idx_category_id (category_id),
      ADD FOREIGN KEY (category_id) REFERENCES Category(id) ON DELETE SET NULL
    `);

    console.log('✅ Successfully added category_id column to aircrafts table');
  } catch (error) {
    console.error('❌ Error adding category_id column:', error.message);
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️ category_id column already exists');
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('⚠️ aircrafts table does not exist. Please run setup-aircrafts-table.js first.');
    } else {
      throw error;
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Database connection closed');
    }
  }
}

addCategoryColumn()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

