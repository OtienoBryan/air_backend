require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupPurchaseOrderItems() {
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

    // Get existing products
    const [products] = await connection.execute('SELECT id, product_name, product_code FROM products LIMIT 5');
    console.log('📦 Found products:', products);

    if (products.length === 0) {
      console.log('❌ No products found. Please create products first.');
      return;
    }

    // Get existing suppliers
    const [suppliers] = await connection.execute('SELECT id FROM suppliers LIMIT 1');
    if (suppliers.length === 0) {
      console.log('❌ No suppliers found. Please create suppliers first.');
      return;
    }

    const supplierId = suppliers[0].id;

    // Create purchase orders if they don't exist
    const [existingPOs] = await connection.execute('SELECT COUNT(*) as count FROM purchase_orders');
    if (existingPOs[0].count === 0) {
      console.log('📋 Creating sample purchase orders...');
      const insertPOsSql = `
        INSERT INTO purchase_orders (po_number, invoice_number, supplier_id, order_date, expected_delivery_date, status, subtotal, tax_amount, total_amount, amount_paid, balance, notes, created_by) VALUES
        ('PO-2024-001', 'INV-2024-001', ?, '2024-01-15', '2024-01-25', 'received', 2500.00, 250.00, 2750.00, 2750.00, 0.00, 'Electronics components order', 1),
        ('PO-2024-002', 'INV-2024-002', ?, '2024-01-20', '2024-02-01', 'sent', 1504.00, 150.40, 1654.40, 0.00, 1654.40, 'Industrial components', 1);
      `;
      await connection.execute(insertPOsSql, [supplierId, supplierId]);
      console.log('✅ Purchase orders created.');
    }

    // Get purchase order IDs
    const [purchaseOrders] = await connection.execute('SELECT id, po_number FROM purchase_orders ORDER BY id LIMIT 2');
    console.log('📋 Found purchase orders:', purchaseOrders);

    // Create purchase order items
    const [existingItems] = await connection.execute('SELECT COUNT(*) as count FROM purchase_order_items');
    if (existingItems[0].count === 0) {
      console.log('📦 Creating purchase order items...');
      
      for (let i = 0; i < purchaseOrders.length && i < products.length; i++) {
        const po = purchaseOrders[i];
        const product = products[i];
        
        const insertItemSql = `
          INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, unit_price, total_price, received_quantity, tax_amount, tax_type) VALUES
          (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const quantity = 10 + (i * 5);
        const unitPrice = 100.00 + (i * 50.00);
        const totalPrice = quantity * unitPrice;
        const receivedQuantity = i === 0 ? quantity : Math.floor(quantity * 0.8); // First order fully received, second partially
        const taxAmount = totalPrice * 0.16;
        
        await connection.execute(insertItemSql, [
          po.id,
          product.id,
          quantity,
          unitPrice,
          totalPrice,
          receivedQuantity,
          taxAmount,
          'VAT'
        ]);
        
        console.log(`✅ Created item for PO ${po.po_number} with product ${product.product_name}`);
      }
    } else {
      console.log('ℹ️ Purchase order items already exist.');
    }

    // Test the query with JOIN
    console.log('🔍 Testing purchase order items with product data...');
    const [testRows] = await connection.execute(`
      SELECT 
        poi.*,
        p.product_name,
        p.product_code,
        p.description,
        p.category
      FROM purchase_order_items poi
      LEFT JOIN products p ON poi.product_id = p.id
      ORDER BY poi.purchase_order_id, poi.id
    `);
    console.log('✅ Test query results:');
    testRows.forEach(row => {
      console.log(`  PO ${row.purchase_order_id}: ${row.product_name} (${row.product_code}) - Qty: ${row.quantity}, Price: ${row.unit_price}`);
    });

    console.log('🎉 Purchase order items setup completed successfully.');

  } catch (error) {
    console.error('❌ Error setting up purchase order items:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Disconnected from database.');
    }
  }
}

setupPurchaseOrderItems();