const mysql = require('mysql2/promise');
require('dotenv').config();

async function testCountriesEndpoint() {
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

    // Check if Country table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'Country'"
    );
    
    if (tables.length === 0) {
      console.log('❌ Country table does not exist!');
      
      // Try to find similar tables
      const [allTables] = await connection.execute("SHOW TABLES");
      console.log('📋 Available tables:', allTables.map(t => Object.values(t)[0]));
      
      return;
    }

    console.log('✅ Country table exists');

    // Check table structure
    const [columns] = await connection.execute("DESCRIBE Country");
    console.log('📋 Country table structure:', columns);

    // Check if there are any countries
    const [countries] = await connection.execute("SELECT * FROM Country");
    console.log('🌍 Countries in database:', countries);

    // Check countries with status = 1
    const [activeCountries] = await connection.execute("SELECT * FROM Country WHERE status = 1");
    console.log('✅ Active countries:', activeCountries);

  } catch (error) {
    console.error('❌ Error testing countries:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the test
testCountriesEndpoint();
