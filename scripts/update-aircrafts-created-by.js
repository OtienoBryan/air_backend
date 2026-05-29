const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function updateCreatedByColumn() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_royal',
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // Check if created_by is already an INT
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'aircrafts' 
      AND COLUMN_NAME = 'created_by'
    `, [process.env.DB_DATABASE || 'impulsep_royal']);

    if (columns.length === 0) {
      console.log('⚠️ created_by column does not exist. Adding it...');
      await connection.query(`
        ALTER TABLE aircrafts 
        ADD COLUMN created_by INT(11) NULL AFTER category_id,
        ADD INDEX idx_created_by (created_by),
        ADD FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL
      `);
      console.log('✅ Added created_by column as INT');
    } else if (columns[0].DATA_TYPE === 'int') {
      console.log('✅ created_by column is already INT type');
    } else {
      console.log('⚠️ Converting created_by from VARCHAR to INT...');
      console.log('⚠️ WARNING: This will clear existing created_by values as they cannot be converted automatically');
      
      // Drop foreign key if exists
      try {
        await connection.query(`
          ALTER TABLE aircrafts 
          DROP FOREIGN KEY aircrafts_ibfk_2
        `);
      } catch (e) {
        // Foreign key might not exist or have different name
        console.log('ℹ️  No existing foreign key to drop');
      }

      // Drop index if exists
      try {
        await connection.query(`
          ALTER TABLE aircrafts 
          DROP INDEX idx_created_by
        `);
      } catch (e) {
        // Index might not exist
        console.log('ℹ️  No existing index to drop');
      }

      // Change column type
      await connection.query(`
        ALTER TABLE aircrafts 
        MODIFY COLUMN created_by INT(11) NULL,
        ADD INDEX idx_created_by (created_by),
        ADD FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL
      `);
      
      console.log('✅ Successfully converted created_by to INT with foreign key to staff table');
    }
  } catch (error) {
    console.error('❌ Error updating created_by column:', error.message);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('⚠️ aircrafts table does not exist. Please run setup-aircrafts-table.js first.');
    } else if (error.code === 'ER_NO_SUCH_TABLE_FK') {
      console.log('⚠️ staff table does not exist. Cannot add foreign key.');
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

updateCreatedByColumn()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

