const mysql = require('mysql2/promise');

async function quickSetup() {
  let connection;
  
  try {
    console.log('🔌 Attempting database connection...');
    
    // Try to connect to MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    });
    
    console.log('✅ Connected to MySQL server');
    
    // Create database if it doesn't exist
    console.log('📝 Creating database...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS impulsep_moonsun1');
    await connection.execute('USE impulsep_moonsun1');
    console.log('✅ Database ready');
    
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
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM clients');
    const count = rows[0].count;
    
    if (count === 0) {
      console.log('📝 Inserting sample data...');
      
      const sampleData = [
        ['ABC Corporation', 'contact@abccorp.com', '+1-555-0101', '123 Business St, New York, NY 10001', 'North Region', 1, 'Route A', 1, 5000.00, 40.7128, -74.0060],
        ['XYZ Industries', 'orders@xyzind.com', '+1-555-0102', '456 Industrial Ave, Los Angeles, CA 90210', 'West Region', 2, 'Route B', 2, 3200.50, 34.0522, -118.2437],
        ['Tech Solutions Ltd', 'info@techsolutions.com', '+1-555-0103', '789 Tech Blvd, San Francisco, CA 94105', 'West Region', 2, 'Route C', 3, 7500.75, 37.7749, -122.4194],
        ['Global Trading Co', 'sales@globaltrading.com', '+1-555-0104', '321 Trade Center, Chicago, IL 60601', 'Central Region', 3, 'Route D', 4, 2100.25, 41.8781, -87.6298],
        ['Local Restaurant', 'manager@localrestaurant.com', '+1-555-0105', '654 Main St, Boston, MA 02101', 'East Region', 4, 'Route E', 5, 1200.00, 42.3601, -71.0589],
        ['New Client Inc', 'new@newclient.com', '+1-555-0106', '999 New St, Miami, FL 33101', 'South Region', 5, 'Route F', 6, 0.00, 25.7617, -80.1918]
      ];
      
      for (const data of sampleData) {
        await connection.execute(
          `INSERT INTO clients (name, email, contact, address, region, region_id, route_name, route_id, balance, latitude, longitude) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          data
        );
      }
      
      console.log(`✅ Inserted ${sampleData.length} sample clients`);
    } else {
      console.log(`✅ Found ${count} existing clients`);
    }
    
    // Show current clients
    console.log('\n👥 Current clients:');
    const [clients] = await connection.execute('SELECT id, name, email, region, balance FROM clients ORDER BY name');
    clients.forEach(client => {
      console.log(`  ${client.id}. ${client.name} (${client.region}) - $${client.balance}`);
    });
    
    console.log('\n🎉 Database setup complete! The Master Sales page should now fetch real data.');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Please ensure:');
    console.log('1. MySQL server is running');
    console.log('2. MySQL is accessible on localhost:3306');
    console.log('3. Username "root" has access (or update the script with correct credentials)');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

quickSetup();
