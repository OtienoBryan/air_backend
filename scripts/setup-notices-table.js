const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupNoticesTable() {
  let connection;
  
  try {
    console.log('🚀 Setting up notices table...');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    console.log('✅ Connected to database');

    // Create notices table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS notices (
        id int(11) NOT NULL AUTO_INCREMENT,
        title varchar(255) NOT NULL,
        content text NOT NULL,
        country_id int(11) NOT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        status tinyint(3) NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        KEY idx_notices_country_id (country_id),
        KEY idx_notices_status (status),
        KEY idx_notices_created_at (created_at),
        KEY idx_notices_country_status (country_id, status),
        FULLTEXT KEY idx_notices_search (title, content)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createTableSQL);
    console.log('✅ Notices table created successfully');

    // Insert sample notices
    const sampleNotices = [
      {
        title: 'Welcome to MoonSun Admin',
        content: 'Welcome to the MoonSun administration panel. This is your central hub for managing all aspects of your organization.',
        country_id: 1,
        status: 1
      },
      {
        title: 'System Maintenance Notice',
        content: 'Scheduled maintenance will be performed on Sunday, 2:00 AM - 4:00 AM. The system may be temporarily unavailable during this time.',
        country_id: 1,
        status: 1
      },
      {
        title: 'New Feature Release',
        content: 'We are excited to announce the release of our new notice management system. You can now create, edit, and manage notices directly from the admin panel.',
        country_id: 1,
        status: 1
      }
    ];

    for (const notice of sampleNotices) {
      try {
        await connection.execute(
          'INSERT INTO notices (title, content, country_id, status) VALUES (?, ?, ?, ?)',
          [notice.title, notice.content, notice.country_id, notice.status]
        );
        console.log(`✅ Sample notice created: ${notice.title}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Sample notice already exists: ${notice.title}`);
        } else {
          console.error(`❌ Error creating sample notice: ${error.message}`);
        }
      }
    }

    console.log('🎉 Notices table setup completed successfully!');
    console.log('\n📊 Table structure:');
    console.log('  • id (int, auto_increment, primary key)');
    console.log('  • title (varchar(255), not null)');
    console.log('  • content (text, not null)');
    console.log('  • country_id (int(11), not null)');
    console.log('  • created_at (timestamp, default current_timestamp)');
    console.log('  • status (tinyint(3), default 0)');
    console.log('\n🔍 Indexes created:');
    console.log('  • Primary key on id');
    console.log('  • Index on country_id');
    console.log('  • Index on status');
    console.log('  • Index on created_at');
    console.log('  • Composite index on country_id, status');
    console.log('  • Full-text search on title, content');

  } catch (error) {
    console.error('❌ Error setting up notices table:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the setup script
setupNoticesTable().catch(console.error);
