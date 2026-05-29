require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupPurchaseOrdersTable() {
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
      CREATE TABLE IF NOT EXISTS purchase_orders (
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
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_supplier_id (supplier_id),
          INDEX idx_created_by (created_by)
      );
    `;
    await connection.execute(createTableSql);
    console.log('✅ "purchase_orders" table ensured to exist.');

    // Check if table is empty and insert sample data if it is
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM purchase_orders');
    if (rows[0].count === 0) {
      console.log('ℹ️ "purchase_orders" table is empty. Inserting sample data...');
      const insertDataSql = `
        INSERT INTO purchase_orders (po_number, invoice_number, supplier_id, order_date, expected_delivery_date, status, subtotal, tax_amount, total_amount, amount_paid, balance, notes, created_by) VALUES
        ('PO-2024-001', 'INV-2024-001', 1, '2024-01-15', '2024-01-25', 'received', 2500.00, 250.00, 2750.00, 2750.00, 0.00, 'Electronics components order', 1),
        ('PO-2024-002', 'INV-2024-002', 1, '2024-01-20', '2024-02-01', 'sent', 1504.00, 150.40, 1654.40, 0.00, 1654.40, 'Industrial components', 1),
        ('PO-2024-003', 'INV-2024-003', 2, '2024-01-25', '2024-02-05', 'received', 1540.00, 154.00, 1694.00, 1694.00, 0.00, 'Hydraulic systems', 1),
        ('PO-2024-004', 'INV-2024-004', 2, '2024-02-01', '2024-02-15', 'draft', 1125.00, 112.50, 1237.50, 0.00, 1237.50, 'Control systems', 1);
      `;
      await connection.execute(insertDataSql);
      console.log('✅ Sample data inserted into "purchase_orders" table.');
    } else {
      console.log('ℹ️ "purchase_orders" table already contains data. Skipping sample data insertion.');
    }

    console.log('🎉 Database setup for purchase orders table completed successfully.');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Disconnected from database.');
    }
  }
}

setupPurchaseOrdersTable();
