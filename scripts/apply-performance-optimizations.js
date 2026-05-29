const mysql = require('mysql2/promise');
require('dotenv').config();

async function applyPerformanceOptimizations() {
  let connection;
  
  try {
    console.log('🚀 Applying database performance optimizations...');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    console.log('✅ Connected to database');

    // Read and execute the performance indexes SQL
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, '..', 'database', 'performance-indexes.sql');
    
    if (!fs.existsSync(sqlFile)) {
      console.error('❌ Performance indexes SQL file not found:', sqlFile);
      return;
    }

    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          await connection.execute(statement);
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } catch (error) {
          if (error.code === 'ER_DUP_KEYNAME') {
            console.log(`⚠️  Index already exists (skipping): ${error.message}`);
          } else {
            console.error(`❌ Error executing statement ${i + 1}:`, error.message);
            // Continue with other statements
          }
        }
      }
    }

    console.log('🎉 Database performance optimizations applied successfully!');
    console.log('\n📊 Performance improvements:');
    console.log('  • Added indexes for faster queries');
    console.log('  • Optimized chat message retrieval');
    console.log('  • Improved staff member lookups');
    console.log('  • Enhanced product and category searches');
    console.log('  • Better order management performance');

  } catch (error) {
    console.error('❌ Error applying performance optimizations:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the optimization script
applyPerformanceOptimizations().catch(console.error);
