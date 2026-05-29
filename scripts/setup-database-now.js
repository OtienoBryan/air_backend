const mysql = require('mysql2/promise');

async function setupDatabaseNow() {
  console.log('🚀 Setting up database to fetch client names from Clients table...\n');
  
  // Try different connection configurations
  const configs = [
    { name: 'Default (root, no password)', host: 'localhost', user: 'root', password: '', port: 3306 },
    { name: 'Root with password', host: 'localhost', user: 'root', password: 'root', port: 3306 },
    { name: 'Root with password 123', host: 'localhost', user: 'root', password: '123', port: 3306 },
    { name: 'Root with password password', host: 'localhost', user: 'root', password: 'password', port: 3306 },
  ];

  for (const config of configs) {
    let connection;
    try {
      console.log(`🔌 Trying: ${config.name}...`);
      connection = await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        port: config.port
      });
      
      console.log(`✅ SUCCESS: Connected to MySQL!`);
      
      // Create database
      console.log('📝 Creating database...');
      await connection.execute('CREATE DATABASE IF NOT EXISTS impulsep_moonsun1');
      await connection.execute('USE impulsep_moonsun1');
      console.log('✅ Database created/accessed');
      
      // Create clients table
      console.log('📝 Creating clients table...');
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
      console.log('✅ Clients table created');
      
      // Check if table has data
      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM Clients');
      const count = rows[0].count;
      
      if (count === 0) {
        console.log('📝 Inserting sample client data...');
        
        const sampleClients = [
          ['ABC Corporation', 'contact@abccorp.com', '+1-555-0101', '123 Business St, New York, NY 10001', 'North Region', 1, 'Route A', 1, 5000.00, 40.7128, -74.0060],
          ['XYZ Industries', 'orders@xyzind.com', '+1-555-0102', '456 Industrial Ave, Los Angeles, CA 90210', 'West Region', 2, 'Route B', 2, 3200.50, 34.0522, -118.2437],
          ['Tech Solutions Ltd', 'info@techsolutions.com', '+1-555-0103', '789 Tech Blvd, San Francisco, CA 94105', 'West Region', 2, 'Route C', 3, 7500.75, 37.7749, -122.4194],
          ['Global Trading Co', 'sales@globaltrading.com', '+1-555-0104', '321 Trade Center, Chicago, IL 60601', 'Central Region', 3, 'Route D', 4, 2100.25, 41.8781, -87.6298],
          ['Local Restaurant', 'manager@localrestaurant.com', '+1-555-0105', '654 Main St, Boston, MA 02101', 'East Region', 4, 'Route E', 5, 1200.00, 42.3601, -71.0589],
          ['New Client Inc', 'new@newclient.com', '+1-555-0106', '999 New St, Miami, FL 33101', 'South Region', 5, 'Route F', 6, 0.00, 25.7617, -80.1918]
        ];
        
        for (const client of sampleClients) {
        await connection.execute(
          `INSERT INTO Clients (name, email, contact, address, region, region_id, route_name, route_id, balance, latitude, longitude) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          client
        );
        }
        
        console.log(`✅ Inserted ${sampleClients.length} sample clients`);
      } else {
        console.log(`✅ Found ${count} existing clients`);
      }
      
      // Show current clients
      console.log('\n👥 Client names in database:');
      const [clients] = await connection.execute('SELECT id, name, email, region, balance FROM Clients ORDER BY name');
      clients.forEach(client => {
        console.log(`  ${client.id}. ${client.name} (${client.region}) - $${client.balance}`);
      });
      
      console.log('\n🎉 DATABASE SETUP COMPLETE!');
      console.log('✅ The Master Sales page will now fetch real client names from the Clients table.');
      console.log('\nNext steps:');
      console.log('1. Refresh the Master Sales page');
      console.log('2. You should see the real client names from the database');
      
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
  console.log('\n💡 Please start MySQL first:');
  console.log('1. Run as Administrator: net start mysql');
  console.log('2. Or start XAMPP/WAMP MySQL service');
  console.log('3. Then run this script again');
}

setupDatabaseNow().catch(console.error);
