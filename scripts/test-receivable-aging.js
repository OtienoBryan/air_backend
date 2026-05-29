const mysql = require('mysql2/promise');

async function testReceivableAging() {
  let connection;
  
  try {
    console.log('🔍 [Test] Starting receivable aging test...');
    
    // Database connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'impulsep_moonsun1'
    });
    
    console.log('✅ [Test] Connected to database');
    
    // Check if tables exist
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'impulsep_moonsun1' 
      AND TABLE_NAME IN ('Clients', 'sales_orders', 'client_ledger')
    `);
    
    console.log('📊 [Test] Available tables:', tables.map(t => t.TABLE_NAME));
    
    // Check Clients table
    const [clients] = await connection.execute('SELECT COUNT(*) as count FROM Clients');
    console.log(`👥 [Test] Clients count: ${clients[0].count}`);
    
    // Check sales_orders table
    const [salesOrders] = await connection.execute('SELECT COUNT(*) as count FROM sales_orders');
    console.log(`📦 [Test] Sales orders count: ${salesOrders[0].count}`);
    
    // Check client_ledger table
    const [ledger] = await connection.execute('SELECT COUNT(*) as count FROM client_ledger');
    console.log(`💰 [Test] Client ledger count: ${ledger[0].count}`);
    
    // Test receivable aging calculation
    console.log('\n🔍 [Test] Testing receivable aging calculation...');
    
    // Get sample data
    const [sampleClients] = await connection.execute(`
      SELECT c.id, c.name, c.email, c.contact
      FROM Clients c 
      LIMIT 3
    `);
    
    console.log('📋 [Test] Sample clients:', sampleClients);
    
    for (const client of sampleClients) {
      console.log(`\n👤 [Test] Processing client: ${client.name} (ID: ${client.id})`);
      
      // Get sales orders for this client
      const [orders] = await connection.execute(`
        SELECT so.id, so.total_amount, so.order_date
        FROM sales_orders so 
        WHERE so.client_id = ?
      `, [client.id]);
      
      console.log(`   📦 Orders: ${orders.length}`);
      if (orders.length > 0) {
        const totalSales = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
        console.log(`   💰 Total sales: ${totalSales}`);
      }
      
      // Get payments for this client
      const [payments] = await connection.execute(`
        SELECT cl.credit, cl.transaction_date
        FROM client_ledger cl 
        WHERE cl.client_id = ? AND cl.credit > 0
        ORDER BY cl.transaction_date DESC
      `, [client.id]);
      
      console.log(`   💳 Payments: ${payments.length}`);
      if (payments.length > 0) {
        const totalPayments = payments.reduce((sum, payment) => sum + Number(payment.credit || 0), 0);
        console.log(`   💰 Total payments: ${totalPayments}`);
      }
      
      // Calculate outstanding
      const totalSales = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
      const totalPayments = payments.reduce((sum, payment) => sum + Number(payment.credit || 0), 0);
      const outstanding = totalSales - totalPayments;
      
      console.log(`   📊 Outstanding: ${outstanding}`);
      
      if (outstanding > 0 && orders.length > 0) {
        const oldestOrder = orders.sort((a, b) => new Date(a.order_date) - new Date(b.order_date))[0];
        const daysSinceOrder = Math.floor((new Date() - new Date(oldestOrder.order_date)) / (1000 * 60 * 60 * 24));
        console.log(`   📅 Days since oldest order: ${daysSinceOrder}`);
      }
    }
    
    console.log('\n✅ [Test] Receivable aging test completed successfully!');
    
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

testReceivableAging();
