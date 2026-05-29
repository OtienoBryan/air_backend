const mysql = require('mysql2/promise');

async function setupReceivableAgingData() {
  let connection;
  
  try {
    console.log('🔍 [Setup] Setting up receivable aging test data...');
    
    // Database connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'impulsep_moonsun1'
    });
    
    console.log('✅ [Setup] Connected to database');
    
    // Check if we have clients
    const [clients] = await connection.execute('SELECT COUNT(*) as count FROM Clients');
    console.log(`👥 [Setup] Clients count: ${clients[0].count}`);
    
    if (clients[0].count === 0) {
      console.log('📝 [Setup] Adding sample clients...');
      await connection.execute(`
        INSERT INTO Clients (name, email, contact, address, region_id, region, route_id, route_name, balance) VALUES
        ('ABC Company Ltd', 'contact@abccompany.com', '+1234567890', '123 Business St', 1, 'Central', 1, 'Route A', 0),
        ('XYZ Corporation', 'billing@xyzcorp.com', '+1987654321', '456 Corporate Ave', 2, 'North', 2, 'Route B', 0),
        ('Global Industries', 'accounts@globalind.com', '+1122334455', '789 Industrial Blvd', 3, 'South', 3, 'Route C', 0)
      `);
      console.log('✅ [Setup] Sample clients added');
    }
    
    // Check if we have sales orders
    const [salesOrders] = await connection.execute('SELECT COUNT(*) as count FROM sales_orders');
    console.log(`📦 [Setup] Sales orders count: ${salesOrders[0].count}`);
    
    if (salesOrders[0].count === 0) {
      console.log('📝 [Setup] Adding sample sales orders...');
      await connection.execute(`
        INSERT INTO sales_orders (so_number, client_id, order_date, total_amount, status, my_status) VALUES
        ('SO-001', 1, '2024-11-15', 5000.00, 'confirmed', 3),
        ('SO-002', 1, '2024-12-01', 3000.00, 'confirmed', 3),
        ('SO-003', 2, '2024-10-20', 7500.00, 'confirmed', 3),
        ('SO-004', 2, '2024-11-05', 2000.00, 'confirmed', 3),
        ('SO-005', 3, '2024-09-10', 12000.00, 'confirmed', 3),
        ('SO-006', 3, '2024-11-25', 8000.00, 'confirmed', 3)
      `);
      console.log('✅ [Setup] Sample sales orders added');
    }
    
    // Check if we have client ledger entries
    const [ledger] = await connection.execute('SELECT COUNT(*) as count FROM client_ledger');
    console.log(`💰 [Setup] Client ledger count: ${ledger[0].count}`);
    
    if (ledger[0].count === 0) {
      console.log('📝 [Setup] Adding sample client ledger entries...');
      await connection.execute(`
        INSERT INTO client_ledger (client_id, transaction_date, description, debit, credit, balance, created_at) VALUES
        (1, '2024-11-20', 'Payment for SO-001', 0, 2000.00, -2000.00, '2024-11-20 10:00:00'),
        (1, '2024-12-05', 'Payment for SO-002', 0, 1000.00, -3000.00, '2024-12-05 10:00:00'),
        (2, '2024-10-25', 'Payment for SO-003', 0, 3000.00, -3000.00, '2024-10-25 10:00:00'),
        (3, '2024-09-15', 'Payment for SO-005', 0, 5000.00, -5000.00, '2024-09-15 10:00:00'),
        (3, '2024-11-30', 'Payment for SO-006', 0, 2000.00, -7000.00, '2024-11-30 10:00:00')
      `);
      console.log('✅ [Setup] Sample client ledger entries added');
    }
    
    // Test the receivable aging calculation
    console.log('\n🔍 [Setup] Testing receivable aging calculation...');
    const [result] = await connection.execute(`
      SELECT 
        c.id as clientId,
        c.name as clientName,
        c.email as clientEmail,
        c.contact as clientPhone,
        COALESCE(SUM(so.total_amount), 0) as totalSales,
        COALESCE(SUM(cl.credit), 0) as totalPayments,
        COALESCE(SUM(so.total_amount), 0) - COALESCE(SUM(cl.credit), 0) as outstandingAmount,
        MIN(so.order_date) as oldestOrderDate,
        MAX(cl.created_at) as lastPaymentDate
      FROM Clients c
      LEFT JOIN sales_orders so ON c.id = so.client_id
      LEFT JOIN client_ledger cl ON c.id = cl.client_id AND cl.credit > 0
      GROUP BY c.id, c.name, c.email, c.contact
      HAVING outstandingAmount > 0
      ORDER BY outstandingAmount DESC
    `);
    
    console.log('📊 [Setup] Receivable aging results:');
    result.forEach(row => {
      const daysSinceOrder = Math.floor((new Date() - new Date(row.oldestOrderDate)) / (1000 * 60 * 60 * 24));
      console.log(`   ${row.clientName}: $${row.outstandingAmount} outstanding (${daysSinceOrder} days old)`);
    });
    
    console.log('\n✅ [Setup] Receivable aging data setup completed successfully!');
    
  } catch (error) {
    console.error('❌ [Setup] Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 [Setup] Database connection closed');
    }
  }
}

setupReceivableAgingData();
