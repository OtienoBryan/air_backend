const mysql = require('mysql2/promise');

async function testSalesOrdersData() {
  let connection;
  
  try {
    console.log('🔍 [Test] Testing sales_orders table data...');
    
    // Database connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'impulsep_moonsun1'
    });
    
    console.log('✅ [Test] Connected to database');
    
    // Check sales_orders table
    const [salesOrders] = await connection.execute('SELECT COUNT(*) as count FROM sales_orders');
    console.log(`📦 [Test] Sales orders count: ${salesOrders[0].count}`);
    
    if (salesOrders[0].count > 0) {
      // Show sample data
      const [sampleData] = await connection.execute(`
        SELECT 
          so.id,
          so.so_number,
          so.client_id,
          so.order_date,
          so.total_amount,
          so.status,
          so.my_status,
          c.name as client_name,
          c.email as client_email,
          c.contact as client_phone
        FROM sales_orders so
        LEFT JOIN Clients c ON so.client_id = c.id
        ORDER BY so.created_at DESC
        LIMIT 5
      `);
      
      console.log('\n📊 [Test] Sample sales orders:');
      sampleData.forEach((order, index) => {
        console.log(`   ${index + 1}. ${order.so_number} - ${order.client_name || 'Unknown'} - $${order.total_amount} - ${order.status} (${order.my_status})`);
      });
      
      // Test summary query
      const [summary] = await connection.execute(`
        SELECT 
          COUNT(*) as totalInvoices,
          SUM(total_amount) as totalAmount,
          SUM(subtotal) as totalSubtotal,
          SUM(tax_amount) as totalTax
        FROM sales_orders
      `);
      
      console.log('\n📊 [Test] Summary:');
      console.log(`   Total Invoices: ${summary[0].totalInvoices}`);
      console.log(`   Total Amount: $${summary[0].totalAmount || 0}`);
      console.log(`   Total Subtotal: $${summary[0].totalSubtotal || 0}`);
      console.log(`   Total Tax: $${summary[0].totalTax || 0}`);
      
      // Test status counts
      const [statusCounts] = await connection.execute(`
        SELECT status, COUNT(*) as count
        FROM sales_orders
        GROUP BY status
        ORDER BY count DESC
      `);
      
      console.log('\n📊 [Test] Status breakdown:');
      statusCounts.forEach(status => {
        console.log(`   ${status.status}: ${status.count}`);
      });
      
      console.log('\n✅ [Test] Sales orders data is ready for Invoices API!');
    } else {
      console.log('⚠️ [Test] No sales orders found in database');
    }
    
  } catch (error) {
    console.error('❌ [Test] Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 [Test] MySQL server is not running. Please start MySQL first.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 [Test] Database access denied. Check credentials.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 [Test] Database does not exist. Check database name.');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 [Test] Database connection closed');
    }
  }
}

testSalesOrdersData();
