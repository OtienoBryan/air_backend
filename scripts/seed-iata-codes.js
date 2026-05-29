require('dotenv').config();
const mysql = require('mysql2/promise');
const https = require('https');

const CSV_URL = 'https://raw.githubusercontent.com/ip2location/ip2location-iata-icao/master/iata-icao.csv';

async function downloadCSV() {
    return new Promise((resolve, reject) => {
        https.get(CSV_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

function parseCSV(csvData) {
    const lines = csvData.split('\r\n');
    const iataCodes = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Parse CSV line (handling quoted fields)
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!matches || matches.length < 7) continue;

        const cleanValue = (val) => val ? val.replace(/^"|"$/g, '').trim() : null;

        const countryCode = cleanValue(matches[0]);
        const regionName = cleanValue(matches[1]);
        const iata = cleanValue(matches[2]);
        const icao = cleanValue(matches[3]);
        const airport = cleanValue(matches[4]);
        const latitude = matches[5] ? parseFloat(cleanValue(matches[5])) : null;
        const longitude = matches[6] ? parseFloat(cleanValue(matches[6])) : null;

        // Only include entries with valid IATA codes
        if (iata && iata.length === 3 && airport) {
            iataCodes.push({
                code: iata,
                icao: icao || null,
                airport: airport,
                city: null, // Will be extracted from airport name if needed
                country_code: countryCode,
                region_name: regionName,
                latitude: latitude,
                longitude: longitude,
                status: 'active'
            });
        }
    }

    return iataCodes;
}

async function seedIataCodes() {
    let connection;

    try {
        console.log('🌍 Starting IATA codes seeding process...');

        // Download CSV data
        console.log('📥 Downloading IATA codes data from GitHub...');
        const csvData = await downloadCSV();
        console.log('✅ CSV data downloaded successfully');

        // Parse CSV data
        console.log('📊 Parsing CSV data...');
        const iataCodes = parseCSV(csvData);
        console.log(`✅ Parsed ${iataCodes.length} IATA codes`);

        // Connect to database
        console.log('🔌 Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_DATABASE || 'royal_air'
        });
        console.log('✅ Connected to database');

        // Create table if not exists
        console.log('📋 Creating iata_codes table if not exists...');
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS iata_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(3) NOT NULL UNIQUE,
        icao VARCHAR(4) NULL,
        airport VARCHAR(255) NOT NULL,
        city VARCHAR(100) NULL,
        country_code VARCHAR(2) NOT NULL,
        region_name VARCHAR(100) NULL,
        latitude DECIMAL(10, 7) NULL,
        longitude DECIMAL(10, 7) NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_code (code),
        INDEX idx_country (country_code),
        INDEX idx_airport (airport)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
        console.log('✅ Table created/verified');

        // Insert IATA codes
        console.log('💾 Inserting IATA codes...');
        let inserted = 0;
        let skipped = 0;

        for (const iataCode of iataCodes) {
            try {
                await connection.execute(
                    `INSERT INTO iata_codes (code, icao, airport, city, country_code, region_name, latitude, longitude, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
           icao = VALUES(icao),
           airport = VALUES(airport),
           region_name = VALUES(region_name),
           latitude = VALUES(latitude),
           longitude = VALUES(longitude)`,
                    [
                        iataCode.code,
                        iataCode.icao,
                        iataCode.airport,
                        iataCode.city,
                        iataCode.country_code,
                        iataCode.region_name,
                        iataCode.latitude,
                        iataCode.longitude,
                        iataCode.status
                    ]
                );
                inserted++;

                if (inserted % 100 === 0) {
                    console.log(`   Inserted ${inserted} codes...`);
                }
            } catch (error) {
                if (error.code !== 'ER_DUP_ENTRY') {
                    console.error(`   Error inserting ${iataCode.code}:`, error.message);
                }
                skipped++;
            }
        }

        console.log('✅ IATA codes seeding completed!');
        console.log(`   📊 Total processed: ${iataCodes.length}`);
        console.log(`   ✅ Inserted/Updated: ${inserted}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);

    } catch (error) {
        console.error('❌ Error seeding IATA codes:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

// Run the seeding
seedIataCodes()
    .then(() => {
        console.log('🎉 Seeding process completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Seeding process failed:', error);
        process.exit(1);
    });
