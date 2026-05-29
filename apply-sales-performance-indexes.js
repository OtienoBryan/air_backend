const mysql = require('mysql2/promise');
require('dotenv').config();

async function applyPerformanceIndexes() {
  let connection;
  
  try {
    console.log('🔧 Applying sales performance indexes...');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'moonsun_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database');

    // Read and execute the indexes SQL file
    const fs = require('fs');
    const path = require('path');
    
    const sqlFilePath = path.join(__dirname, 'database', 'sales-performance-indexes.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📊 Executing ${statements.length} index statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          await connection.execute(statement);
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } catch (error) {
          if (error.code === 'ER_DUP_KEYNAME') {
            console.log(`⚠️  Index already exists, skipping...`);
          } else {
            console.error(`❌ Error executing statement ${i + 1}:`, error.message);
            throw error;
          }
        }
      }
    }

    console.log('🎉 All performance indexes applied successfully!');
    console.log('📈 Sales summary page should now load much faster');

  } catch (error) {
    console.error('❌ Error applying performance indexes:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
applyPerformanceIndexes();
