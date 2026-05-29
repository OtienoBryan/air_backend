const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupSalesRepTable() {
  let connection;
  
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_moonsun1',
    });

    console.log('🔗 Connected to MySQL database');

    // Create SalesRep table
    const createSalesRepTableSQL = `
      CREATE TABLE IF NOT EXISTS SalesRep (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        email VARCHAR(191) NOT NULL,
        phoneNumber VARCHAR(191) NOT NULL,
        password VARCHAR(191) NOT NULL,
        countryId INT NOT NULL,
        country VARCHAR(191) NOT NULL,
        region_id INT NOT NULL,
        region VARCHAR(191) NOT NULL,
        route_id INT NOT NULL,
        route VARCHAR(100) NOT NULL,
        route_id_update INT NOT NULL,
        route_name_update VARCHAR(100) NOT NULL,
        visits_targets INT(3) NOT NULL,
        new_clients INT(3) NOT NULL,
        vapes_targets INT(11) NOT NULL,
        pouches_targets INT(11) NOT NULL,
        role VARCHAR(191) DEFAULT 'USER',
        manager_type INT(11) NOT NULL,
        status INT(11) DEFAULT 0,
        createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createSalesRepTableSQL);
    console.log('✅ SalesRep table created successfully');

    // Check if countries exist, create them if not
    const [existingCountries] = await connection.execute(
      'SELECT COUNT(*) as count FROM Country'
    );

    if (existingCountries[0].count === 0) {
      console.log('📝 Inserting sample countries...');
      
      const countriesSQL = `
        INSERT INTO Country (name, status) VALUES 
        ('United States', 1),
        ('Canada', 1),
        ('United Kingdom', 1),
        ('Germany', 1),
        ('France', 1),
        ('Japan', 1),
        ('Australia', 1),
        ('Brazil', 1),
        ('India', 1),
        ('China', 1);
      `;

      await connection.execute(countriesSQL);
      console.log('✅ Sample countries inserted successfully');
    } else {
      console.log('ℹ️  Countries already exist, skipping country insertion');
    }

    // Check if sample data already exists
    const [existingData] = await connection.execute(
      'SELECT COUNT(*) as count FROM SalesRep'
    );

    if (existingData[0].count === 0) {
      console.log('📝 Inserting sample sales rep data...');
      
      const sampleDataSQL = `
        INSERT INTO SalesRep (
          name, email, phoneNumber, password, countryId, country, region_id, region,
          route_id, route, route_id_update, route_name_update, visits_targets, new_clients,
          vapes_targets, pouches_targets, role, manager_type, status
        ) VALUES 
        ('John Smith', 'john.smith@moonsun.com', '+1-555-0101', '$2b$10$example.hash', 1, 'United States', 1, 'North Region', 1, 'Route A', 1, 'Route A Updated', 50, 10, 200, 150, 'SALES_REP', 1, 1),
        ('Sarah Johnson', 'sarah.johnson@moonsun.com', '+1-555-0102', '$2b$10$example.hash', 1, 'United States', 2, 'West Region', 2, 'Route B', 2, 'Route B Updated', 45, 8, 180, 120, 'SENIOR_SALES_REP', 2, 1),
        ('Mike Wilson', 'mike.wilson@moonsun.com', '+1-555-0103', '$2b$10$example.hash', 2, 'Canada', 3, 'Central Region', 3, 'Route C', 3, 'Route C Updated', 40, 12, 160, 140, 'SALES_REP', 1, 0),
        ('Emily Davis', 'emily.davis@moonsun.com', '+1-555-0104', '$2b$10$example.hash', 1, 'United States', 4, 'East Region', 4, 'Route D', 4, 'Route D Updated', 55, 15, 220, 180, 'SALES_MANAGER', 3, 1),
        ('David Brown', 'david.brown@moonsun.com', '+1-555-0105', '$2b$10$example.hash', 3, 'United Kingdom', 5, 'South Region', 5, 'Route E', 5, 'Route E Updated', 35, 6, 140, 100, 'SALES_REP', 1, 1);
      `;

      await connection.execute(sampleDataSQL);
      console.log('✅ Sample sales rep data inserted successfully');
    } else {
      console.log('ℹ️  SalesRep table already contains data, skipping sample data insertion');
    }

    // Create indexes for better performance
    const createIndexesSQL = [
      'CREATE INDEX IF NOT EXISTS idx_salesrep_country ON SalesRep(countryId)',
      'CREATE INDEX IF NOT EXISTS idx_salesrep_region ON SalesRep(region_id)',
      'CREATE INDEX IF NOT EXISTS idx_salesrep_route ON SalesRep(route_id)',
      'CREATE INDEX IF NOT EXISTS idx_salesrep_status ON SalesRep(status)',
      'CREATE INDEX IF NOT EXISTS idx_salesrep_email ON SalesRep(email)'
    ];

    for (const indexSQL of createIndexesSQL) {
      try {
        await connection.execute(indexSQL);
      } catch (error) {
        // Index might already exist, continue
        console.log(`ℹ️  Index creation skipped: ${error.message}`);
      }
    }

    console.log('✅ Indexes created successfully');
    console.log('🎉 SalesRep table setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up SalesRep table:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupSalesRepTable()
    .then(() => {
      console.log('✅ Setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupSalesRepTable };
