require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkDatabase() {
    let connection;

    try {
        console.log('🔌 Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_DATABASE || 'royal_air'
        });
        console.log('✅ Connected to database');

        // Check if table exists
        const [tables] = await connection.execute(
            "SHOW TABLES LIKE 'iata_codes'"
        );
        console.log('📋 Table exists:', tables.length > 0);

        if (tables.length > 0) {
            // Count total records
            const [countResult] = await connection.execute(
                'SELECT COUNT(*) as count FROM iata_codes'
            );
            console.log('📊 Total records:', countResult[0].count);

            // Get first 5 records
            const [records] = await connection.execute(
                'SELECT * FROM iata_codes LIMIT 5'
            );
            console.log('📝 First 5 records:');
            records.forEach(record => {
                console.log(`  - ${record.code} (${record.icao}): ${record.airport}, ${record.country_code}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

checkDatabase();
