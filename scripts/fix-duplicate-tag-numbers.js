const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDuplicateTagNumbers() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'impulsep_royal',
    });

    console.log('🔗 Connected to MySQL database');

    // Find duplicate tag numbers
    console.log('🔍 Finding duplicate tag numbers...');
    const [duplicates] = await connection.execute(`
      SELECT tag_number, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id) as ids
      FROM luggage 
      WHERE tag_number IS NOT NULL AND tag_number != ''
      GROUP BY tag_number 
      HAVING count > 1
    `);

    if (duplicates.length === 0) {
      console.log('✅ No duplicate tag numbers found');
    } else {
      console.log(`⚠️  Found ${duplicates.length} duplicate tag numbers:`);
      
      for (const dup of duplicates) {
        console.log(`\n   Tag Number: "${dup.tag_number}" (${dup.count} occurrences)`);
        const ids = dup.ids.split(',').map(id => parseInt(id, 10));
        console.log(`   IDs: ${ids.join(', ')}`);
        
        // Keep the first one (lowest ID), clear tag_number for others
        const keepId = ids[0];
        const clearIds = ids.slice(1);
        
        console.log(`   Keeping ID ${keepId}, clearing tag_number for IDs: ${clearIds.join(', ')}`);
        
        for (const id of clearIds) {
          await connection.execute(
            'UPDATE luggage SET tag_number = NULL WHERE id = ?',
            [id]
          );
          console.log(`   ✅ Cleared tag_number for luggage ID ${id}`);
        }
      }
      
      console.log('\n✅ All duplicate tag numbers have been resolved');
    }

    // Now add the unique constraint
    console.log('\n🔒 Adding unique constraint to tag_number...');
    try {
      await connection.execute(`
        ALTER TABLE luggage 
        ADD UNIQUE INDEX idx_unique_tag_number (tag_number)
      `);
      console.log('✅ Unique constraint added successfully');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Unique constraint already exists');
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('❌ Error fixing duplicate tag numbers:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

fixDuplicateTagNumbers().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

