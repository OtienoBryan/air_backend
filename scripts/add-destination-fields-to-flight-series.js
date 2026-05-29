const mysql = require('mysql2/promise');
require('dotenv').config();

async function addDestinationFields() {
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

    // Check if columns already exist and add them if they don't
    const columnsToAdd = [
      { name: 'from_destination_id', type: 'INT(11) NULL', after: 'sta' },
      { name: 'from_terminal', type: 'VARCHAR(100) NULL', after: 'from_destination_id' },
      { name: 'to_terminal', type: 'VARCHAR(100) NULL', after: 'from_terminal' },
      { name: 'via_destination_id', type: 'INT(11) NULL', after: 'to_terminal' },
      { name: 'via_std', type: 'TIME NULL', after: 'via_destination_id' },
      { name: 'via_sta', type: 'TIME NULL', after: 'via_std' },
      { name: 'to_destination_id', type: 'INT(11) NULL', after: 'via_sta' },
    ];

    for (const column of columnsToAdd) {
      try {
        // Check if column exists
        const [columns] = await connection.execute(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'flight_series' AND COLUMN_NAME = ?`,
          [process.env.DB_DATABASE || 'impulsep_royal', column.name]
        );

        if (columns.length === 0) {
          await connection.execute(
            `ALTER TABLE flight_series ADD COLUMN ${column.name} ${column.type} AFTER ${column.after}`
          );
          console.log(`✅ Added column: ${column.name}`);
        } else {
          console.log(`ℹ️  Column ${column.name} already exists`);
        }
      } catch (error) {
        if (error.code !== 'ER_DUP_FIELDNAME') {
          console.error(`❌ Error adding column ${column.name}:`, error.message);
        }
      }
    }

    // Add indexes
    const indexesToAdd = [
      { name: 'idx_from_destination_id', column: 'from_destination_id' },
      { name: 'idx_via_destination_id', column: 'via_destination_id' },
      { name: 'idx_to_destination_id', column: 'to_destination_id' },
    ];

    for (const index of indexesToAdd) {
      try {
        await connection.execute(
          `CREATE INDEX ${index.name} ON flight_series(${index.column})`
        );
        console.log(`✅ Added index: ${index.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_KEYNAME') {
          console.log(`ℹ️  Index ${index.name} already exists`);
        } else {
          console.error(`❌ Error adding index ${index.name}:`, error.message);
        }
      }
    }

    // Add foreign keys
    const foreignKeys = [
      { column: 'from_destination_id', ref: 'destinations(id)' },
      { column: 'via_destination_id', ref: 'destinations(id)' },
      { column: 'to_destination_id', ref: 'destinations(id)' },
    ];

    for (const fk of foreignKeys) {
      try {
        await connection.execute(
          `ALTER TABLE flight_series 
           ADD CONSTRAINT fk_flight_series_${fk.column} 
           FOREIGN KEY (${fk.column}) REFERENCES ${fk.ref} ON DELETE SET NULL`
        );
        console.log(`✅ Added foreign key: ${fk.column}`);
      } catch (error) {
        if (error.code === 'ER_DUP_KEY' || error.code === 'ER_DUP_KEYNAME') {
          console.log(`ℹ️  Foreign key for ${fk.column} already exists`);
        } else {
          console.error(`❌ Error adding foreign key ${fk.column}:`, error.message);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error updating flight_series table:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

addDestinationFields().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});

