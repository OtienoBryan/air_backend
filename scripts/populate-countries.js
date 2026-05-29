const mysql = require('mysql2/promise');
require('dotenv').config();

async function populateCountries() {
  let connection;
  
  try {
    console.log('🌍 Checking Country table and populating data...');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    console.log('✅ Connected to database');

    // Check if Country table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "Country"');
    if (tables.length === 0) {
      console.log('❌ Country table does not exist. Please run the setup script first.');
      return;
    }

    console.log('✅ Country table exists');

    // Check if countries already have data
    const [existingCountries] = await connection.execute('SELECT COUNT(*) as count FROM Country');
    const count = existingCountries[0].count;
    
    if (count > 0) {
      console.log(`✅ Country table already has ${count} countries`);
      
      // Show existing countries
      const [countries] = await connection.execute('SELECT id, name, flag FROM Country ORDER BY name LIMIT 10');
      console.log('\n📋 Existing countries:');
      countries.forEach(country => {
        console.log(`  ${country.id}. ${country.flag} ${country.name}`);
      });
      
      if (count > 10) {
        console.log(`  ... and ${count - 10} more countries`);
      }
      
      return;
    }

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

    console.log('📝 Inserting sample countries...');
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
      const [result] =       await connection.execute(`
        UPDATE notices 
        SET country_id = 1 
        WHERE country_id NOT IN (SELECT id FROM Country)
      `);
      if (result.affectedRows > 0) {
        console.log(`✅ Updated ${result.affectedRows} notices with invalid country IDs`);
      } else {
        console.log('✅ No notices needed updating');
      }
    } catch (error) {
      console.log('⚠️  No notices to update or error updating notices:', error.message);
    }

    console.log('🎉 Countries population completed successfully!');

  } catch (error) {
    console.error('❌ Error populating countries:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the population script
populateCountries().catch(console.error);
