const mysql = require('mysql2/promise');

async function testMySQLConnection() {
  console.log('🔌 Testing MySQL connection...\n');
  
  // Try different connection configurations
  const configs = [
    { name: 'Default (root, no password)', host: 'localhost', user: 'root', password: '', port: 3306 },
    { name: 'Root with password', host: 'localhost', user: 'root', password: 'root', port: 3306 },
    { name: 'Root with password 123', host: 'localhost', user: 'root', password: '123', port: 3306 },
    { name: 'Root with password password', host: 'localhost', user: 'root', password: 'password', port: 3306 },
    { name: 'Different port 3307', host: 'localhost', user: 'root', password: '', port: 3307 },
    { name: 'Different port 3308', host: 'localhost', user: 'root', password: '', port: 3308 },
  ];

  for (const config of configs) {
    let connection;
    try {
      console.log(`Testing: ${config.name}...`);
      connection = await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        port: config.port
      });
      
      console.log(`✅ SUCCESS: ${config.name}`);
      console.log(`   Host: ${config.host}:${config.port}`);
      console.log(`   User: ${config.user}`);
      console.log(`   Password: ${config.password ? '***' : 'none'}`);
      
      // Test creating database
      await connection.execute('CREATE DATABASE IF NOT EXISTS impulsep_moonsun1');
      await connection.execute('USE impulsep_moonsun1');
      console.log('   ✅ Database created/accessed successfully');
      
      // Test creating clients table
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS Clients (
          id int(11) NOT NULL AUTO_INCREMENT,
          name varchar(191) NOT NULL,
          password varchar(119) DEFAULT NULL,
          address varchar(191) DEFAULT NULL,
          latitude double DEFAULT NULL,
          longitude double DEFAULT NULL,
          balance decimal(11,2) DEFAULT NULL,
          email varchar(191) DEFAULT NULL,
          region_id int(11) NOT NULL,
          region varchar(191) NOT NULL,
          route_id int(11) DEFAULT NULL,
          route_name varchar(191) DEFAULT NULL,
          route_id_update int(11) DEFAULT NULL,
          route_name_update varchar(100) DEFAULT NULL,
          contact varchar(191) NOT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
      
      await connection.execute(createTableSQL);
      console.log('   ✅ Clients table created successfully');
      
      // Insert sample data
      const sampleData = [
        ['ABC Corporation', 'contact@abccorp.com', '+1-555-0101', '123 Business St, New York, NY 10001', 'North Region', 1, 'Route A', 1, 5000.00, 40.7128, -74.0060],
        ['XYZ Industries', 'orders@xyzind.com', '+1-555-0102', '456 Industrial Ave, Los Angeles, CA 90210', 'West Region', 2, 'Route B', 2, 3200.50, 34.0522, -118.2437],
        ['Tech Solutions Ltd', 'info@techsolutions.com', '+1-555-0103', '789 Tech Blvd, San Francisco, CA 94105', 'West Region', 2, 'Route C', 3, 7500.75, 37.7749, -122.4194],
        ['Global Trading Co', 'sales@globaltrading.com', '+1-555-0104', '321 Trade Center, Chicago, IL 60601', 'Central Region', 3, 'Route D', 4, 2100.25, 41.8781, -87.6298],
        ['Local Restaurant', 'manager@localrestaurant.com', '+1-555-0105', '654 Main St, Boston, MA 02101', 'East Region', 4, 'Route E', 5, 1200.00, 42.3601, -71.0589],
        ['New Client Inc', 'new@newclient.com', '+1-555-0106', '999 New St, Miami, FL 33101', 'South Region', 5, 'Route F', 6, 0.00, 25.7617, -80.1918]
      ];
      
      // Check if data already exists
      const [existingRows] = await connection.execute('SELECT COUNT(*) as count FROM clients');
      if (existingRows[0].count === 0) {
        for (const data of sampleData) {
          await connection.execute(
            `INSERT INTO clients (name, email, contact, address, region, region_id, route_name, route_id, balance, latitude, longitude) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            data
          );
        }
        console.log(`   ✅ Inserted ${sampleData.length} sample clients`);
      } else {
        console.log(`   ✅ Found ${existingRows[0].count} existing clients`);
      }
      
      // Show clients
      const [clients] = await connection.execute('SELECT id, name, region, balance FROM clients ORDER BY name');
      console.log('   📋 Clients in database:');
      clients.forEach(client => {
        console.log(`      ${client.id}. ${client.name} (${client.region}) - $${client.balance}`);
      });
      
      console.log('\n🎉 DATABASE SETUP COMPLETE!');
      console.log('✅ The Master Sales page can now fetch real data from the Clients table.');
      console.log('\nNext steps:');
      console.log('1. Start the backend server: npm run start:dev');
      console.log('2. Set USE_MOCK_DATA = false in admin/src/services/api.ts');
      console.log('3. Refresh the Master Sales page');
      
      await connection.end();
      return;
      
    } catch (error) {
      console.log(`❌ FAILED: ${config.name} - ${error.message}`);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (e) {
          // Ignore connection end errors
        }
      }
    }
  }
  
  console.log('\n❌ No working MySQL connection found.');
  console.log('\n💡 Please check:');
  console.log('1. MySQL server is installed and running');
  console.log('2. Try starting MySQL service: net start mysql');
  console.log('3. Check if MySQL is running on a different port');
  console.log('4. Verify MySQL credentials');
  console.log('5. Check if XAMPP/WAMP is running MySQL');
}

testMySQLConnection().catch(console.error);
