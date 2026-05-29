const mysql = require('mysql2/promise');
require('dotenv').config();

async function populateExistingCountries() {
  let connection;
  
  try {
    console.log('🌍 Populating existing Country table...');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    console.log('✅ Connected to database');

    // Check if Country table exists and get current data
    const [tables] = await connection.execute('SHOW TABLES LIKE "Country"');
    if (tables.length === 0) {
      console.log('❌ Country table does not exist.');
      return;
    }

    console.log('✅ Country table exists');

    // Get current countries
    const [existingCountries] = await connection.execute('SELECT id, name, status FROM Country ORDER BY name');
    console.log(`📋 Current countries (${existingCountries.length}):`);
    existingCountries.forEach(country => {
      console.log(`  ${country.id}. ${country.name} (status: ${country.status})`);
    });

    // Sample countries to add if they don't exist
    const sampleCountries = [
      'United States',
      'Canada', 
      'United Kingdom',
      'Germany',
      'France',
      'Japan',
      'Australia',
      'Brazil',
      'India',
      'China'
    ];

    console.log('\n📝 Adding sample countries...');
    for (const countryName of sampleCountries) {
      try {
        // Check if country already exists
        const [existing] = await connection.execute(
          'SELECT id FROM Country WHERE name = ?',
          [countryName]
        );

        if (existing.length === 0) {
          await connection.execute(
            'INSERT INTO Country (name, status) VALUES (?, ?)',
            [countryName, 1]
          );
          console.log(`✅ Added: ${countryName}`);
        } else {
          console.log(`⚠️  Already exists: ${countryName}`);
        }
      } catch (error) {
        console.error(`❌ Error adding ${countryName}:`, error.message);
      }
    }

    // Update existing notices to use country ID 1 if they don't have a valid country
    try {
      const [result] = await connection.execute(`
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

    // Show final countries
    const [finalCountries] = await connection.execute('SELECT id, name, status FROM Country ORDER BY name');
    console.log(`\n🎉 Final countries (${finalCountries.length}):`);
    finalCountries.forEach(country => {
      console.log(`  ${country.id}. ${country.name} (status: ${country.status})`);
    });

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
populateExistingCountries().catch(console.error);
