require('dotenv').config();
const mysql = require('mysql2/promise');

async function testPurchaseOrders() {
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

    // Check if purchase_orders table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'purchase_orders'");
    if (tables.length === 0) {
      console.log('❌ purchase_orders table does not exist. Creating it...');
      
      const createTableSql = `
        CREATE TABLE purchase_orders (
            id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            po_number VARCHAR(20) NOT NULL UNIQUE,
            invoice_number VARCHAR(200) NOT NULL,
            supplier_id INT(11) NOT NULL,
            order_date DATE NOT NULL,
            expected_delivery_date DATE,
            status ENUM('draft','sent','received','cancelled') DEFAULT 'draft',
            subtotal DECIMAL(15,2) DEFAULT 0.00,
            tax_amount DECIMAL(15,2) DEFAULT 0.00,
            total_amount DECIMAL(15,2) DEFAULT 0.00,
            amount_paid DECIMAL(11,2) NOT NULL,
            balance DECIMAL(11,2) NOT NULL,
            notes TEXT,
            created_by INT(11) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `;
      await connection.execute(createTableSql);
      console.log('✅ purchase_orders table created.');
      
      // Insert sample data
      const insertDataSql = `
        INSERT INTO purchase_orders (po_number, invoice_number, supplier_id, order_date, expected_delivery_date, status, subtotal, tax_amount, total_amount, amount_paid, balance, notes, created_by) VALUES
        ('PO-2024-001', 'INV-2024-001', 1, '2024-01-15', '2024-01-25', 'received', 2500.00, 250.00, 2750.00, 2750.00, 0.00, 'Electronics components order', 1),
        ('PO-2024-002', 'INV-2024-002', 1, '2024-01-20', '2024-02-01', 'sent', 1504.00, 150.40, 1654.40, 0.00, 1654.40, 'Industrial components', 1);
      `;
      await connection.execute(insertDataSql);
      console.log('✅ Sample data inserted.');
    } else {
      console.log('✅ purchase_orders table exists.');
    }

    // Test query
    const [rows] = await connection.execute('SELECT * FROM purchase_orders WHERE supplier_id = ?', [1]);
    console.log(`✅ Found ${rows.length} purchase orders for supplier 1:`, rows);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Disconnected from database.');
    }
  }
}

testPurchaseOrders();
