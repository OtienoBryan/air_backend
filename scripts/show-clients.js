const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'impulsep_moonsun1',
  port: process.env.DB_PORT || 3306
};

async function showClients() {
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
      console.log('💡 Please run: node scripts/setup-clients-table.js');
      return;
    }

    // Get all clients
    console.log('\n👥 Fetching all clients...');
    const [clients] = await connection.execute(`
      SELECT 
        id,
        name,
        email,
        phone,
        company,
        contact_person,
        status,
        created_at,
        updated_at
      FROM clients 
      ORDER BY name
    `);

    if (clients.length === 0) {
      console.log('📭 No clients found in the database');
      console.log('💡 Please run: node scripts/setup-clients-table.js to add sample data');
      return;
    }

    console.log(`\n📊 Found ${clients.length} clients:\n`);
    console.log('┌─────┬─────────────────────────┬─────────────────────────┬─────────────────┬─────────────────┬──────────┬─────────────────────┐');
    console.log('│ ID  │ Name                    │ Email                   │ Phone            │ Company          │ Status   │ Created             │');
    console.log('├─────┼─────────────────────────┼─────────────────────────┼─────────────────┼─────────────────┼──────────┼─────────────────────┤');

    clients.forEach(client => {
      const id = String(client.id).padEnd(3);
      const name = (client.name || '').substring(0, 23).padEnd(23);
      const email = (client.email || '').substring(0, 23).padEnd(23);
      const phone = (client.phone || '').substring(0, 15).padEnd(15);
      const company = (client.company || '').substring(0, 15).padEnd(15);
      const status = (client.status || '').padEnd(8);
      const created = client.created_at ? new Date(client.created_at).toLocaleDateString() : '';
      
      console.log(`│ ${id} │ ${name} │ ${email} │ ${phone} │ ${company} │ ${status} │ ${created.padEnd(19)} │`);
    });

    console.log('└─────┴─────────────────────────┴─────────────────────────┴─────────────────┴─────────────────┴──────────┴─────────────────────┘');

    // Show status summary
    console.log('\n📈 Status Summary:');
    const statusCounts = clients.reduce((acc, client) => {
      acc[client.status] = (acc[client.status] || 0) + 1;
      return acc;
    }, {});

    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} clients`);
    });

    console.log('\n✅ Client list displayed successfully!');

  } catch (error) {
    console.error('❌ Error fetching clients:', error.message);
    console.error('💡 Please check:');
    console.error('  1. MySQL server is running');
    console.error('  2. Database credentials are correct');
    console.error('  3. Database exists');
    console.error('  4. Clients table exists');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the script
showClients().catch(console.error);
