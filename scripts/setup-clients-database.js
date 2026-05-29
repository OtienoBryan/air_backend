const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'impulsep_moonsun1',
  port: process.env.DB_PORT || 3306
};

async function setupClientsDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');

    // Check if clients table exists
    console.log('\n📋 Checking clients table...');
    const [tables] = await connection.execute("SHOW TABLES LIKE 'clients'");
    
    if (tables.length === 0) {
      console.log('❌ clients table does not exist');
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
          PRIMARY KEY (id),
          KEY idx_region_id (region_id),
          KEY idx_route_id (route_id),
          KEY idx_name (name),
          KEY idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
      
      await connection.execute(createTableSQL);
      console.log('✅ clients table created successfully');
    } else {
      console.log('✅ clients table exists');
    }

    // Check for existing data
    console.log('\n📊 Checking for existing data...');
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM clients');
    const recordCount = countResult[0].count;
    console.log(`📈 Found ${recordCount} clients`);

    if (recordCount === 0) {
      console.log('📝 No data found, inserting sample clients...');
      
      const sampleClients = [
        {
          name: 'ABC Corporation',
          email: 'contact@abccorp.com',
          contact: '+1-555-0101',
          address: '123 Business St, New York, NY 10001',
          region: 'North Region',
          region_id: 1,
          route_name: 'Route A',
          route_id: 1,
          balance: 5000.00,
          latitude: 40.7128,
          longitude: -74.0060
        },
        {
          name: 'XYZ Industries',
          email: 'orders@xyzind.com',
          contact: '+1-555-0102',
          address: '456 Industrial Ave, Los Angeles, CA 90210',
          region: 'West Region',
          region_id: 2,
          route_name: 'Route B',
          route_id: 2,
          balance: 3200.50,
          latitude: 34.0522,
          longitude: -118.2437
        },
        {
          name: 'Tech Solutions Ltd',
          email: 'info@techsolutions.com',
          contact: '+1-555-0103',
          address: '789 Tech Blvd, San Francisco, CA 94105',
          region: 'West Region',
          region_id: 2,
          route_name: 'Route C',
          route_id: 3,
          balance: 7500.75,
          latitude: 37.7749,
          longitude: -122.4194
        },
        {
          name: 'Global Trading Co',
          email: 'sales@globaltrading.com',
          contact: '+1-555-0104',
          address: '321 Trade Center, Chicago, IL 60601',
          region: 'Central Region',
          region_id: 3,
          route_name: 'Route D',
          route_id: 4,
          balance: 2100.25,
          latitude: 41.8781,
          longitude: -87.6298
        },
        {
          name: 'Local Restaurant',
          email: 'manager@localrestaurant.com',
          contact: '+1-555-0105',
          address: '654 Main St, Boston, MA 02101',
          region: 'East Region',
          region_id: 4,
          route_name: 'Route E',
          route_id: 5,
          balance: 1200.00,
          latitude: 42.3601,
          longitude: -71.0589
        },
        {
          name: 'New Client Inc',
          email: 'new@newclient.com',
          contact: '+1-555-0106',
          address: '999 New St, Miami, FL 33101',
          region: 'South Region',
          region_id: 5,
          route_name: 'Route F',
          route_id: 6,
          balance: 0.00,
          latitude: 25.7617,
          longitude: -80.1918
        }
      ];

      for (const client of sampleClients) {
        await connection.execute(
          `INSERT INTO clients (
            name, email, contact, address, region, region_id, 
            route_name, route_id, balance, latitude, longitude
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            client.name, client.email, client.contact, client.address,
            client.region, client.region_id, client.route_name, client.route_id,
            client.balance, client.latitude, client.longitude
          ]
        );
      }
      
      console.log(`✅ Inserted ${sampleClients.length} sample clients`);
    }

    // Display clients
    console.log('\n👥 Current clients:');
    const [clients] = await connection.execute(`
      SELECT id, name, email, contact, region, balance 
      FROM clients 
      ORDER BY name
    `);
    
    clients.forEach(client => {
      console.log(`  - ${client.name} (${client.region}) - Balance: $${client.balance}`);
    });

    console.log('\n✅ Clients database setup completed successfully!');
    console.log('🚀 The clients table is ready for the Master Sales page.');

  } catch (error) {
    console.error('❌ Error setting up clients database:', error.message);
    console.error('💡 Please check:');
    console.error('  1. MySQL server is running');
    console.error('  2. Database credentials are correct');
    console.error('  3. Database exists');
    console.error('  4. .env file has correct database configuration');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the setup
setupClientsDatabase().catch(console.error);
