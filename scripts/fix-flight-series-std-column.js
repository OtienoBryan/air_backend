const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixStdColumn() {
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

    // Check current column definition
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_TYPE 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'flight_series' AND COLUMN_NAME = 'std'`,
      [process.env.DB_DATABASE || 'impulsep_royal']
    );

    if (columns.length > 0) {
      console.log('ℹ️  Current std column definition:', columns[0]);
      const column = columns[0];
      
      // Check if it needs to be fixed
      if (column.DATA_TYPE !== 'time' || column.IS_NULLABLE !== 'YES') {
        console.log('🔧 Fixing std column...');
        await connection.execute(
          `ALTER TABLE flight_series MODIFY COLUMN std TIME NULL`
        );
        console.log('✅ std column fixed successfully');
      } else {
        console.log('✅ std column is already correct');
      }
    } else {
      console.log('ℹ️  std column does not exist, adding it...');
      await connection.execute(
        `ALTER TABLE flight_series ADD COLUMN std TIME NULL AFTER end_date`
      );
      console.log('✅ std column added successfully');
    }

    // Also check and fix sta column
    const [staColumns] = await connection.execute(
      `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_TYPE 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'flight_series' AND COLUMN_NAME = 'sta'`,
      [process.env.DB_DATABASE || 'impulsep_royal']
    );

    if (staColumns.length > 0) {
      console.log('ℹ️  Current sta column definition:', staColumns[0]);
      const staColumn = staColumns[0];
      
      if (staColumn.DATA_TYPE !== 'time' || staColumn.IS_NULLABLE !== 'YES') {
        console.log('🔧 Fixing sta column...');
        await connection.execute(
          `ALTER TABLE flight_series MODIFY COLUMN sta TIME NULL`
        );
        console.log('✅ sta column fixed successfully');
      } else {
        console.log('✅ sta column is already correct');
      }
    } else {
      console.log('ℹ️  sta column does not exist, adding it...');
      await connection.execute(
        `ALTER TABLE flight_series ADD COLUMN sta TIME NULL AFTER std`
      );
      console.log('✅ sta column added successfully');
    }

  } catch (error) {
    console.error('❌ Error fixing std/sta columns:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

fixStdColumn().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});

