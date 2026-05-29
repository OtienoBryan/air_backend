const mysql = require('mysql2/promise');

async function quickDbCheck() {
  let connection;
  
  try {
    console.log('🔍 [Quick Check] Testing database connection...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'impulsep_moonsun1'
    });
    
    console.log('✅ [Quick Check] Connected to database');
    
    // Check sales_orders table
    const [salesOrders] = await connection.execute('SELECT COUNT(*) as count FROM sales_orders');
    console.log(`📦 [Quick Check] Sales orders count: ${salesOrders[0].count}`);
    
    if (salesOrders[0].count > 0) {
      // Show a few sample records
      const [samples] = await connection.execute(`
        SELECT so_number, client_id, total_amount, status, my_status 
        FROM sales_orders 
        ORDER BY created_at DESC 
        LIMIT 3
      `);
      
      console.log('\n📊 [Quick Check] Sample records:');
      samples.forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.so_number} - Client: ${record.client_id} - $${record.total_amount} - ${record.status} (${record.my_status})`);
      });
      
      console.log('\n✅ [Quick Check] Database has data! Invoices page should work.');
    } else {
      console.log('⚠️ [Quick Check] No sales orders found in database');
      console.log('💡 [Quick Check] You may need to add sample data or check if data exists in the table');
    }
    
  } catch (error) {
    console.error('❌ [Quick Check] Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 [Quick Check] MySQL server is not running. Please start MySQL first.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 [Quick Check] Database access denied. Check credentials.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 [Quick Check] Database does not exist. Check database name.');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 [Quick Check] Database connection closed');
    }
  }
}

quickDbCheck();
