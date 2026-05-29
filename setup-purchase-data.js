require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupPurchaseData() {
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

    // Create purchase_orders table
    const createPurchaseOrdersSql = `
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
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await connection.execute(createPurchaseOrdersSql);
    console.log('✅ purchase_orders table created.');

    // Create purchase_order_items table
    const createPurchaseOrderItemsSql = `
      CREATE TABLE IF NOT EXISTS purchase_order_items (
          id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
          purchase_order_id INT(11) NOT NULL,
          product_id INT(11) NOT NULL,
          quantity INT(11) NOT NULL,
          unit_price DECIMAL(10,2) NOT NULL,
          total_price DECIMAL(15,2) NOT NULL,
          received_quantity INT(11) DEFAULT 0,
          tax_amount DECIMAL(15,2) DEFAULT 0.00,
          tax_type VARCHAR(20),
          INDEX idx_purchase_order_id (purchase_order_id),
          INDEX idx_product_id (product_id)
      );
    `;
    await connection.execute(createPurchaseOrderItemsSql);
    console.log('✅ purchase_order_items table created.');

    // Check if we have suppliers
    const [supplierRows] = await connection.execute('SELECT COUNT(*) as count FROM suppliers');
    if (supplierRows[0].count === 0) {
      console.log('ℹ️ No suppliers found. Creating sample supplier...');
      const insertSupplierSql = `
        INSERT INTO suppliers (supplier_code, company_name, contact_person, email, phone, address, tax_id, payment_terms, credit_limit, is_active) VALUES
        ('SUP001', 'ABC Electronics Ltd', 'John Smith', 'john@abcelectronics.com', '+1-555-0123', '123 Tech Street, Silicon Valley, CA 94000', 'TAX123456789', 30, 50000.00, 1);
      `;
      await connection.execute(insertSupplierSql);
      console.log('✅ Sample supplier created.');
    }

    // Check if we have products
    const [productRows] = await connection.execute('SELECT COUNT(*) as count FROM products');
    if (productRows[0].count === 0) {
      console.log('ℹ️ No products found. Creating sample products...');
      const insertProductsSql = `
        INSERT INTO products (product_name, product_code, description, brand, category_id, is_active) VALUES
        ('Electronics Component A', 'ECA001', 'High-quality electronic component for industrial use', 'TechCorp', 1, 1),
        ('Industrial Part B', 'IPB002', 'Durable industrial component for heavy machinery', 'Industrial Solutions', 2, 1),
        ('Circuit Board C', 'CBC003', 'Advanced circuit board with multiple layers', 'ElectroTech', 1, 1),
        ('Mechanical Gear D', 'MGD004', 'Precision mechanical gear for automotive applications', 'MechPro', 3, 1),
        ('Sensor Module E', 'SME005', 'IoT sensor module with wireless connectivity', 'SmartTech', 1, 1);
      `;
      await connection.execute(insertProductsSql);
      console.log('✅ Sample products created.');
    }

    // Check if we have purchase orders
    const [poRows] = await connection.execute('SELECT COUNT(*) as count FROM purchase_orders');
    if (poRows[0].count === 0) {
      console.log('ℹ️ No purchase orders found. Creating sample purchase orders...');
      const insertPurchaseOrdersSql = `
        INSERT INTO purchase_orders (po_number, invoice_number, supplier_id, order_date, expected_delivery_date, status, subtotal, tax_amount, total_amount, amount_paid, balance, notes, created_by) VALUES
        ('PO-2024-001', 'INV-2024-001', 1, '2024-01-15', '2024-01-25', 'received', 2500.00, 250.00, 2750.00, 2750.00, 0.00, 'Electronics components order', 1),
        ('PO-2024-002', 'INV-2024-002', 1, '2024-01-20', '2024-02-01', 'sent', 1504.00, 150.40, 1654.40, 0.00, 1654.40, 'Industrial components', 1);
      `;
      await connection.execute(insertPurchaseOrdersSql);
      console.log('✅ Sample purchase orders created.');
    }

    // Check if we have purchase order items
    const [poiRows] = await connection.execute('SELECT COUNT(*) as count FROM purchase_order_items');
    if (poiRows[0].count === 0) {
      console.log('ℹ️ No purchase order items found. Creating sample purchase order items...');
      const insertPurchaseOrderItemsSql = `
        INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, unit_price, total_price, received_quantity, tax_amount, tax_type) VALUES
        (1, 1, 10, 150.00, 1500.00, 10, 150.00, 'VAT'),
        (1, 2, 5, 200.00, 1000.00, 5, 100.00, 'VAT'),
        (2, 3, 8, 75.50, 604.00, 6, 60.40, 'VAT'),
        (2, 4, 3, 300.00, 900.00, 0, 90.00, 'VAT');
      `;
      await connection.execute(insertPurchaseOrderItemsSql);
      console.log('✅ Sample purchase order items created.');
    }

    // Test the query with JOIN
    console.log('🔍 Testing purchase order items with product data...');
    const [testRows] = await connection.execute(`
      SELECT 
        poi.*,
        p.product_name,
        p.product_code,
        p.description,
        p.brand
      FROM purchase_order_items poi
      LEFT JOIN products p ON poi.product_id = p.id
      WHERE poi.purchase_order_id = 1
    `);
    console.log('✅ Test query results:', testRows);

    console.log('🎉 Database setup for purchase data completed successfully.');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Disconnected from database.');
    }
  }
}

setupPurchaseData();
