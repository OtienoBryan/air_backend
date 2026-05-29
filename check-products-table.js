require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkProductsTable() {
  let connection;
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    console.log('✅ Database connection successful.');

    // Check products table structure
    const [columns] = await connection.execute('DESCRIBE products');
    console.log('📋 Products table structure:');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'}`);
    });

    // Check if products table has data
    const [rows] = await connection.execute('SELECT * FROM products LIMIT 3');
    console.log(`\n📦 Sample products (${rows.length} rows):`);
    console.log(rows);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Disconnected from database.');
    }
  }
}

checkProductsTable();
