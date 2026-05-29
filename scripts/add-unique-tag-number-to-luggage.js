const mysql = require('mysql2/promise');
require('dotenv').config();

async function addUniqueTagNumberToLuggage() {
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

    // Check for duplicate tag numbers first
    console.log('🔍 Checking for duplicate tag numbers...');
    const [duplicates] = await connection.execute(`
      SELECT tag_number, COUNT(*) as count 
      FROM luggage 
      WHERE tag_number IS NOT NULL AND tag_number != ''
      GROUP BY tag_number 
      HAVING count > 1
    `);

    if (duplicates.length > 0) {
      console.log(`⚠️  Found ${duplicates.length} duplicate tag numbers:`);
      duplicates.forEach(dup => {
        console.log(`   - ${dup.tag_number}: ${dup.count} occurrences`);
      });
      console.log('⚠️  Please resolve duplicates before adding unique constraint.');
      console.log('   You may need to update or remove duplicate entries manually.');
      return;
    }

    // Read and execute the SQL file
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, '../database/add-unique-tag-number-to-luggage.sql');
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
        if (error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_DUP_ENTRY') {
          console.log('ℹ️  Unique constraint already exists or duplicate found, skipping...');
        } else {
          console.error('❌ Error executing statement:', error.message);
          throw error;
        }
      }
    }

    console.log('✅ Unique constraint added to tag_number column');

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

addUniqueTagNumberToLuggage().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

