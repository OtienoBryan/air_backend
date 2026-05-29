require('dotenv').config();
const mysql = require('mysql2/promise');

async function testEndpoint() {
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

        // Test the exact query that TypeORM would run
        const page = 1;
        const limit = 50;
        const skip = (page - 1) * limit;

        console.log('\n📊 Testing query with pagination:', { page, limit, skip });

        // Count query
        const [countResult] = await connection.execute(
            'SELECT COUNT(*) as count FROM iata_codes'
        );
        console.log('Total records:', countResult[0].count);

        // Data query
        const [records] = await connection.execute(
            'SELECT * FROM iata_codes ORDER BY code ASC LIMIT ? OFFSET ?',
            [limit, skip]
        );
        console.log('Records returned:', records.length);

        if (records.length > 0) {
            console.log('\n📝 First record:');
            console.log(JSON.stringify(records[0], null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error);
        console.error('❌ Error stack:', error.stack);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

testEndpoint();
