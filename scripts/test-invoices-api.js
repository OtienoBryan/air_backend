const mysql = require('mysql2/promise');

async function testInvoicesAPI() {
  let connection;
  
  try {
    console.log('🔍 [Test] Testing Invoices API...');
    
    // Database connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'impulsep_moonsun1'
    });
    
    console.log('✅ [Test] Connected to database');
    
    // Check if sales_orders table exists and has data
    const [salesOrders] = await connection.execute('SELECT COUNT(*) as count FROM sales_orders');
    console.log(`📦 [Test] Sales orders count: ${salesOrders[0].count}`);
    
    if (salesOrders[0].count === 0) {
      console.log('📝 [Test] Adding sample sales orders...');
      await connection.execute(`
        INSERT INTO sales_orders (so_number, client_id, order_date, total_amount, subtotal, tax_amount, status, my_status, recepients_name, recepients_contact) VALUES
        ('SO-001', 1, '2024-12-01', 5000.00, 4300.00, 700.00, 'confirmed', 3, 'John Doe', '+1234567890'),
        ('SO-002', 2, '2024-12-02', 3200.00, 2800.00, 400.00, 'shipped', 3, 'Jane Smith', '+1987654321'),
        ('SO-003', 3, '2024-12-03', 7500.00, 6500.00, 1000.00, 'delivered', 3, 'Bob Johnson', '+1122334455'),
        ('SO-004', 1, '2024-12-04', 2100.00, 1800.00, 300.00, 'paid', 3, 'Alice Brown', '+1555666777'),
        ('SO-005', 2, '2024-12-05', 4800.00, 4200.00, 600.00, 'in payment', 2, 'Charlie Wilson', '+1444333222')
      `);
      console.log('✅ [Test] Sample sales orders added');
    }
    
    // Check if Clients table exists and has data
    const [clients] = await connection.execute('SELECT COUNT(*) as count FROM Clients');
    console.log(`👥 [Test] Clients count: ${clients[0].count}`);
    
    if (clients[0].count === 0) {
      console.log('📝 [Test] Adding sample clients...');
      await connection.execute(`
        INSERT INTO Clients (name, email, contact, address, region_id, region, route_id, route_name, balance) VALUES
        ('John Doe Company', 'john@example.com', '+1234567890', '123 Main St', 1, 'Central', 1, 'Route A', 0),
        ('Jane Smith Corp', 'jane@example.com', '+1987654321', '456 Oak Ave', 2, 'North', 2, 'Route B', 0),
        ('Bob Johnson Ltd', 'bob@example.com', '+1122334455', '789 Pine St', 3, 'South', 3, 'Route C', 0),
        ('Alice Brown Inc', 'alice@example.com', '+1555666777', '321 Elm St', 1, 'Central', 1, 'Route A', 0),
        ('Charlie Wilson Co', 'charlie@example.com', '+1444333222', '654 Maple Ave', 2, 'North', 2, 'Route B', 0)
      `);
      console.log('✅ [Test] Sample clients added');
    }
    
    // Test the invoices query
    console.log('\n🔍 [Test] Testing invoices query...');
    const [invoices] = await connection.execute(`
      SELECT 
        so.id as so_id,
        so.so_number as so_so_number,
        so.client_id as so_client_id,
        so.order_date as so_order_date,
        so.expected_delivery_date as so_expected_delivery_date,
        so.subtotal as so_subtotal,
        so.tax_amount as so_tax_amount,
        so.total_amount as so_total_amount,
        so.net_price as so_net_price,
        so.notes as so_notes,
        so.created_by as so_created_by,
        so.salesrep as so_salesrep,
        so.created_at as so_created_at,
        so.updated_at as so_updated_at,
        so.rider_id as so_rider_id,
        so.assigned_at as so_assigned_at,
        so.recepients_name as so_recepients_name,
        so.recepients_contact as so_recepients_contact,
        so.dispatched_by as so_dispatched_by,
        so.status as so_status,
        so.my_status as so_my_status,
        so.received_into_stock as so_received_into_stock,
        so.delivered_at as so_delivered_at,
        so.delivery_notes as so_delivery_notes,
        so.received_by as so_received_by,
        so.received_at as so_received_at,
        so.delivery_image as so_delivery_image,
        so.returned_at as so_returned_at,
        c.name as clientName,
        c.email as clientEmail,
        c.contact as clientPhone
      FROM sales_orders so
      LEFT JOIN Clients c ON so.client_id = c.id
      ORDER BY so.created_at DESC
      LIMIT 10
    `);
    
    console.log('📊 [Test] Invoices query results:');
    invoices.forEach((invoice, index) => {
      console.log(`   ${index + 1}. ${invoice.so_so_number} - ${invoice.clientName} - $${invoice.so_total_amount} - ${invoice.so_status}`);
    });
    
    // Test summary query
    console.log('\n🔍 [Test] Testing summary query...');
    const [summary] = await connection.execute(`
      SELECT 
        COUNT(*) as totalInvoices,
        SUM(total_amount) as totalAmount,
        SUM(subtotal) as totalSubtotal,
        SUM(tax_amount) as totalTax
      FROM sales_orders
    `);
    
    console.log('📊 [Test] Summary results:', summary[0]);
    
    // Test status counts
    const [statusCounts] = await connection.execute(`
      SELECT status, COUNT(*) as count
      FROM sales_orders
      GROUP BY status
    `);
    
    console.log('📊 [Test] Status counts:');
    statusCounts.forEach(status => {
      console.log(`   ${status.status}: ${status.count}`);
    });
    
    console.log('\n✅ [Test] Invoices API test completed successfully!');
    
  } catch (error) {
    console.error('❌ [Test] Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 [Test] Database connection closed');
    }
  }
}

testInvoicesAPI();
