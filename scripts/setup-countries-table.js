const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupCountriesTable() {
  let connection;
  
  try {
    console.log('🌍 Setting up Country table...');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    console.log('✅ Connected to database');

    // Create Country table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS Country (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        code varchar(3) DEFAULT NULL,
        iso_code varchar(2) DEFAULT NULL,
        flag varchar(255) DEFAULT NULL,
        currency varchar(255) DEFAULT NULL,
        timezone varchar(255) DEFAULT NULL,
        isActive boolean DEFAULT true,
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (id),
        UNIQUE KEY unique_name (name),
        KEY idx_countries_code (code),
        KEY idx_countries_iso_code (iso_code),
        KEY idx_countries_active (isActive)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createTableSQL);
    console.log('✅ Country table created successfully');

    // Insert sample countries
    const sampleCountries = [
      {
        name: 'United States',
        code: 'USA',
        iso_code: 'US',
        flag: '🇺🇸',
        currency: 'USD',
        timezone: 'America/New_York',
        isActive: true
      },
      {
        name: 'Canada',
        code: 'CAN',
        iso_code: 'CA',
        flag: '🇨🇦',
        currency: 'CAD',
        timezone: 'America/Toronto',
        isActive: true
      },
      {
        name: 'United Kingdom',
        code: 'GBR',
        iso_code: 'GB',
        flag: '🇬🇧',
        currency: 'GBP',
        timezone: 'Europe/London',
        isActive: true
      },
      {
        name: 'Germany',
        code: 'DEU',
        iso_code: 'DE',
        flag: '🇩🇪',
        currency: 'EUR',
        timezone: 'Europe/Berlin',
        isActive: true
      },
      {
        name: 'France',
        code: 'FRA',
        iso_code: 'FR',
        flag: '🇫🇷',
        currency: 'EUR',
        timezone: 'Europe/Paris',
        isActive: true
      },
      {
        name: 'Japan',
        code: 'JPN',
        iso_code: 'JP',
        flag: '🇯🇵',
        currency: 'JPY',
        timezone: 'Asia/Tokyo',
        isActive: true
      },
      {
        name: 'Australia',
        code: 'AUS',
        iso_code: 'AU',
        flag: '🇦🇺',
        currency: 'AUD',
        timezone: 'Australia/Sydney',
        isActive: true
      },
      {
        name: 'Brazil',
        code: 'BRA',
        iso_code: 'BR',
        flag: '🇧🇷',
        currency: 'BRL',
        timezone: 'America/Sao_Paulo',
        isActive: true
      },
      {
        name: 'India',
        code: 'IND',
        iso_code: 'IN',
        flag: '🇮🇳',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        isActive: true
      },
      {
        name: 'China',
        code: 'CHN',
        iso_code: 'CN',
        flag: '🇨🇳',
        currency: 'CNY',
        timezone: 'Asia/Shanghai',
        isActive: true
      }
    ];

    for (const country of sampleCountries) {
      try {
        await connection.execute(
          'INSERT INTO Country (name, code, iso_code, flag, currency, timezone, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [country.name, country.code, country.iso_code, country.flag, country.currency, country.timezone, country.isActive]
        );
        console.log(`✅ Sample country created: ${country.name} ${country.flag}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Sample country already exists: ${country.name}`);
        } else {
          console.error(`❌ Error creating sample country: ${error.message}`);
        }
      }
    }

    // Update existing notices to use country ID 1 (United States) if they don't have a valid country
    try {
      await connection.execute(`
        UPDATE notices 
        SET country_id = 1 
        WHERE country_id NOT IN (SELECT id FROM Country)
      `);
      console.log('✅ Updated notices with invalid country IDs');
    } catch (error) {
      console.log('⚠️  No notices to update or error updating notices:', error.message);
    }

    console.log('🎉 Country table setup completed successfully!');
    console.log('\n📊 Table structure:');
    console.log('  • id (int, auto_increment, primary key)');
    console.log('  • name (varchar(255), not null, unique)');
    console.log('  • code (varchar(3), nullable)');
    console.log('  • iso_code (varchar(2), nullable)');
    console.log('  • flag (varchar(255), nullable)');
    console.log('  • currency (varchar(255), nullable)');
    console.log('  • timezone (varchar(255), nullable)');
    console.log('  • isActive (boolean, default true)');
    console.log('  • created_at (timestamp, default current_timestamp)');
    console.log('  • updated_at (timestamp, default current_timestamp)');
    console.log('\n🔍 Indexes created:');
    console.log('  • Primary key on id');
    console.log('  • Unique index on name');
    console.log('  • Index on code');
    console.log('  • Index on iso_code');
    console.log('  • Index on isActive');

  } catch (error) {
    console.error('❌ Error setting up Country table:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the setup script
setupCountriesTable().catch(console.error);
use 