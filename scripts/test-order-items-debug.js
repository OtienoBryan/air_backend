const mysql = require('mysql2/promise');

async function testOrderItemsDebug() {
  let connection;
  
  try {
    // Database connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'impulsep_moonsun1'
    });

    console.log('🔗 Connected to database');

    // Test 1: Check if all required tables exist
    console.log('\n📋 Testing table existence...');
    
    const tables = ['sales_orders', 'sales_order_items', 'products', 'Clients'];
    for (const table of tables) {
      const [result] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
      console.log(`${result.length > 0 ? '✅' : '❌'} Table '${table}': ${result.length > 0 ? 'EXISTS' : 'MISSING'}`);
    }

    // Test 2: Check table structures
    console.log('\n📊 Checking table structures...');
    
    console.log('\n🔍 sales_orders structure:');
    const [salesOrdersCols] = await connection.execute('DESCRIBE sales_orders');
    console.table(salesOrdersCols);

    console.log('\n🔍 sales_order_items structure:');
    const [orderItemsCols] = await connection.execute('DESCRIBE sales_order_items');
    console.table(orderItemsCols);

    console.log('\n🔍 products structure:');
    const [productsCols] = await connection.execute('DESCRIBE products');
    console.table(productsCols);

    // Test 3: Check data counts
    console.log('\n📈 Checking data counts...');
    
    const [salesOrdersCount] = await connection.execute('SELECT COUNT(*) as count FROM sales_orders');
    console.log(`📊 Sales Orders: ${salesOrdersCount[0].count}`);
    
    const [orderItemsCount] = await connection.execute('SELECT COUNT(*) as count FROM sales_order_items');
    console.log(`📦 Order Items: ${orderItemsCount[0].count}`);
    
    const [productsCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log(`🛍️ Products: ${productsCount[0].count}`);
    
    const [clientsCount] = await connection.execute('SELECT COUNT(*) as count FROM Clients');
    console.log(`👥 Clients: ${clientsCount[0].count}`);

    // Test 4: Check for sample data
    console.log('\n🔍 Checking sample data...');
    
    console.log('\n📋 Sample sales orders:');
    const [sampleSalesOrders] = await connection.execute(`
      SELECT id, client_id, so_number, order_date, total_amount 
      FROM sales_orders 
      ORDER BY order_date DESC 
      LIMIT 5
    `);
    console.table(sampleSalesOrders);

    console.log('\n📋 Sample products:');
    const [sampleProducts] = await connection.execute(`
      SELECT id, name, price 
      FROM products 
      LIMIT 5
    `);
    console.table(sampleProducts);

    console.log('\n📋 Sample order items:');
    const [sampleOrderItems] = await connection.execute(`
      SELECT soi.id, soi.sales_order_id, soi.product_id, soi.quantity, soi.unit_price, soi.total_price
      FROM sales_order_items soi
      LIMIT 5
    `);
    console.table(sampleOrderItems);

    // Test 5: Test the actual query that's failing
    console.log('\n🧪 Testing the order items query...');
    
    const testClientId = sampleSalesOrders[0]?.client_id || 1;
    const testYear = 2025;
    const testMonth = 1;
    
    console.log(`Testing with clientId: ${testClientId}, year: ${testYear}, month: ${testMonth}`);
    
    try {
      const [testResult] = await connection.execute(`
        SELECT 
          soi.id,
          soi.sales_order_id as salesOrderId,
          soi.product_id as productId,
          p.name as productName,
          soi.quantity,
          soi.unit_price as unitPrice,
          soi.total_price as totalPrice,
          so.order_date as orderDate,
          so.so_number as soNumber
        FROM sales_order_items soi
        JOIN sales_orders so ON soi.sales_order_id = so.id
        JOIN products p ON soi.product_id = p.id
        WHERE so.client_id = ? 
          AND YEAR(so.order_date) = ? 
          AND MONTH(so.order_date) = ?
        ORDER BY so.order_date DESC, soi.id
      `, [testClientId, testYear, testMonth]);
      
      console.log(`✅ Query executed successfully! Found ${testResult.length} items:`);
      console.table(testResult);
      
    } catch (queryError) {
      console.error('❌ Query failed:', queryError.message);
      console.error('SQL Error:', queryError.sql);
    }

    // Test 6: Check if there are any sales orders for the test month
    console.log('\n🔍 Checking sales orders for test month...');
    
    const [monthCheck] = await connection.execute(`
      SELECT id, client_id, so_number, order_date, total_amount
      FROM sales_orders 
      WHERE client_id = ? AND YEAR(order_date) = ? AND MONTH(order_date) = ?
    `, [testClientId, testYear, testMonth]);
    
    console.log(`Found ${monthCheck.length} sales orders for ${testYear}-${testMonth}:`);
    console.table(monthCheck);

    console.log('\n🚀 Debug test completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

testOrderItemsDebug();
