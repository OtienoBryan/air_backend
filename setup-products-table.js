require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupProductsTable() {
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

    const createTableSql = `
      CREATE TABLE IF NOT EXISTS products (
          id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
          product_name VARCHAR(255) NOT NULL,
          product_code VARCHAR(50),
          description TEXT,
          brand VARCHAR(100),
          category_id INT(11),
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await connection.execute(createTableSql);
    console.log('✅ "products" table ensured to exist.');

    // Check if table is empty and insert sample data if it is
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      console.log('ℹ️ "products" table is empty. Inserting sample data...');
      const insertDataSql = `
        INSERT INTO products (product_name, product_code, description, brand, category_id, is_active) VALUES
        ('Electronics Component A', 'ECA001', 'High-quality electronic component for industrial use', 'TechCorp', 1, 1),
        ('Industrial Part B', 'IPB002', 'Durable industrial component for heavy machinery', 'Industrial Solutions', 2, 1),
        ('Circuit Board C', 'CBC003', 'Advanced circuit board with multiple layers', 'ElectroTech', 1, 1),
        ('Mechanical Gear D', 'MGD004', 'Precision mechanical gear for automotive applications', 'MechPro', 3, 1),
        ('Sensor Module E', 'SME005', 'IoT sensor module with wireless connectivity', 'SmartTech', 1, 1),
        ('Hydraulic Pump F', 'HPF006', 'High-pressure hydraulic pump for industrial equipment', 'FluidSystems', 4, 1),
        ('Control Panel G', 'CPG007', 'Digital control panel with touch interface', 'ControlTech', 1, 1),
        ('Steel Bracket H', 'SBH008', 'Heavy-duty steel bracket for structural support', 'MetalWorks', 5, 1);
      `;
      await connection.execute(insertDataSql);
      console.log('✅ Sample data inserted into "products" table.');
    } else {
      console.log('ℹ️ "products" table already contains data. Skipping sample data insertion.');
    }

    console.log('🎉 Database setup for products table completed successfully.');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Disconnected from database.');
    }
  }
}

setupProductsTable();
