const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkStoresTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    console.log('🔍 Checking stores table...');
    
    // Check if stores table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'stores'");
    console.log('📋 Stores table exists:', tables.length > 0);
    
    if (tables.length > 0) {
      // Check table structure
      const [structure] = await connection.execute('DESCRIBE stores');
      console.log('📊 Stores table structure:');
      structure.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'}`);
      });
      
      // Check data
      const [stores] = await connection.execute('SELECT * FROM stores LIMIT 5');
      console.log('📝 Sample stores data:');
      stores.forEach(store => {
        console.log(`  ID: ${store.id}, Name: ${store.store_name}`);
      });
      
      const [count] = await connection.execute('SELECT COUNT(*) as count FROM stores');
      console.log(`📈 Total stores: ${count[0].count}`);
    } else {
      console.log('❌ Stores table does not exist. Creating it...');
      
      // Create stores table
      await connection.execute(`
        CREATE TABLE stores (
          id INT AUTO_INCREMENT PRIMARY KEY,
          store_name VARCHAR(255) NOT NULL,
          address TEXT,
          contact VARCHAR(50),
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Insert sample stores
      await connection.execute(`
        INSERT INTO stores (store_name, address, contact) VALUES
        ('Main Store', '123 Main Street', '555-0001'),
        ('Branch Store', '456 Branch Avenue', '555-0002'),
        ('Outlet Store', '789 Outlet Road', '555-0003'),
        ('Mall Store', '321 Mall Plaza', '555-0004'),
        ('Downtown Store', '654 Downtown Blvd', '555-0005')
      `);
      
      console.log('✅ Stores table created and populated');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkStoresTable();
