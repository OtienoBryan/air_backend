const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'impulsep_moonsun1',
  port: process.env.DB_PORT || 3306
};

async function setupClientsTable() {
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
          name varchar(255) NOT NULL,
          email varchar(255) DEFAULT NULL,
          phone varchar(255) DEFAULT NULL,
          address text DEFAULT NULL,
          company varchar(255) DEFAULT NULL,
          contact_person varchar(255) DEFAULT NULL,
          status enum('active','inactive','suspended') DEFAULT 'active',
          notes text DEFAULT NULL,
          created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          KEY idx_status (status),
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
          phone: '+1-555-0101',
          address: '123 Business St, New York, NY 10001',
          company: 'ABC Corporation',
          contact_person: 'John Smith',
          status: 'active',
          notes: 'Premium client with regular orders'
        },
        {
          name: 'XYZ Industries',
          email: 'orders@xyzind.com',
          phone: '+1-555-0102',
          address: '456 Industrial Ave, Los Angeles, CA 90210',
          company: 'XYZ Industries',
          contact_person: 'Jane Doe',
          status: 'active',
          notes: 'Bulk order client'
        },
        {
          name: 'Tech Solutions Ltd',
          email: 'info@techsolutions.com',
          phone: '+1-555-0103',
          address: '789 Tech Blvd, San Francisco, CA 94105',
          company: 'Tech Solutions Ltd',
          contact_person: 'Mike Johnson',
          status: 'active',
          notes: 'Technology company'
        },
        {
          name: 'Global Trading Co',
          email: 'sales@globaltrading.com',
          phone: '+1-555-0104',
          address: '321 Trade Center, Chicago, IL 60601',
          company: 'Global Trading Co',
          contact_person: 'Sarah Wilson',
          status: 'active',
          notes: 'International trading company'
        },
        {
          name: 'Local Restaurant',
          email: 'manager@localrestaurant.com',
          phone: '+1-555-0105',
          address: '654 Main St, Boston, MA 02101',
          company: 'Local Restaurant',
          contact_person: 'Chef Martinez',
          status: 'active',
          notes: 'Local restaurant chain'
        },
        {
          name: 'Inactive Client',
          email: 'old@inactive.com',
          phone: '+1-555-0106',
          address: '999 Old St, Miami, FL 33101',
          company: 'Inactive Corp',
          contact_person: 'Old Manager',
          status: 'inactive',
          notes: 'No recent activity'
        }
      ];

      for (const client of sampleClients) {
        await connection.execute(
          `INSERT INTO clients (
            name, email, phone, address, company, contact_person, status, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            client.name, client.email, client.phone, client.address,
            client.company, client.contact_person, client.status, client.notes
          ]
        );
      }
      
      console.log(`✅ Inserted ${sampleClients.length} sample clients`);
    }

    // Display clients
    console.log('\n👥 Current clients:');
    const [clients] = await connection.execute(`
      SELECT id, name, email, phone, company, status 
      FROM clients 
      ORDER BY name
    `);
    
    clients.forEach(client => {
      console.log(`  - ${client.name} (${client.company}) - ${client.status}`);
    });

    console.log('\n✅ Clients table setup completed successfully!');
    console.log('🚀 The clients table is ready for the Master Sales page.');

  } catch (error) {
    console.error('❌ Error setting up clients table:', error.message);
    console.error('💡 Please check:');
    console.error('  1. MySQL server is running');
    console.error('  2. Database credentials are correct');
    console.error('  3. Database exists');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the setup
setupClientsTable().catch(console.error);
