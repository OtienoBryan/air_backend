const mysql = require('mysql2/promise');
require('dotenv').config();

async function applyInvoiceOptimizations() {
  let connection;
  
  try {
    console.log('🚀 Starting invoice performance optimizations...');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'impulsep_drinks',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database');

    // Read and execute the performance indexes SQL
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, '../database/invoice-performance-indexes.sql');
    
    if (!fs.existsSync(sqlFile)) {
      throw new Error(`SQL file not found: ${sqlFile}`);
    }

    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          await connection.execute(statement);
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } catch (error) {
          if (error.code === 'ER_DUP_KEYNAME') {
            console.log(`⚠️  Index already exists (statement ${i + 1}) - skipping`);
          } else {
            console.error(`❌ Error executing statement ${i + 1}:`, error.message);
            // Continue with other statements
          }
        }
      }
    }

    console.log('🎉 Invoice performance optimizations applied successfully!');
    
    // Show current indexes
    console.log('\n📊 Current indexes on sales_orders table:');
    const [indexes] = await connection.execute('SHOW INDEX FROM sales_orders');
    indexes.forEach(index => {
      console.log(`  - ${index.Key_name}: ${index.Column_name} (${index.Index_type})`);
    });

    console.log('\n📊 Current indexes on Clients table:');
    const [clientIndexes] = await connection.execute('SHOW INDEX FROM Clients');
    clientIndexes.forEach(index => {
      console.log(`  - ${index.Key_name}: ${index.Column_name} (${index.Index_type})`);
    });

  } catch (error) {
    console.error('❌ Error applying optimizations:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the optimization
applyInvoiceOptimizations();
