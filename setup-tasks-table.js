const mysql = require('mysql2/promise');

const setupTasksTable = async () => {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'moonsun_db'
    });

    console.log('🔗 Connected to MySQL database');

    // Create tasks table
    const createTasksTableSQL = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INT(11) NOT NULL AUTO_INCREMENT,
        title VARCHAR(191) NOT NULL,
        description TEXT NOT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        completedAt DATETIME(3) NULL,
        isCompleted TINYINT(1) NOT NULL DEFAULT 0,
        priority VARCHAR(191) NOT NULL DEFAULT 'medium',
        status VARCHAR(191) NOT NULL DEFAULT 'pending',
        salesRepId INT(11) NULL,
        assignedById INT(11) NULL,
        date VARCHAR(20) NOT NULL,
        PRIMARY KEY (id),
        KEY FK_tasks_salesRep (salesRepId),
        KEY FK_tasks_assignedBy (assignedById)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createTasksTableSQL);
    console.log('✅ Tasks table created successfully');

    // Check if table has any data
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM tasks');
    console.log(`📊 Tasks table has ${rows[0].count} records`);

    // If no data, insert some sample tasks
    if (rows[0].count === 0) {
      console.log('📝 Inserting sample tasks...');
      
      const sampleTasks = [
        {
          title: 'Follow up with client ABC',
          description: 'Contact client ABC regarding their recent order and discuss potential upsell opportunities.',
          priority: 'high',
          status: 'pending',
          date: '2024-01-20'
        },
        {
          title: 'Prepare monthly sales report',
          description: 'Compile and analyze sales data for the current month and prepare comprehensive report.',
          priority: 'medium',
          status: 'completed',
          isCompleted: 1,
          completedAt: new Date(),
          date: '2024-01-16'
        },
        {
          title: 'Update product catalog',
          description: 'Review and update product information in the catalog system.',
          priority: 'low',
          status: 'in-progress',
          date: '2024-01-18'
        }
      ];

      for (const task of sampleTasks) {
        await connection.execute(
          'INSERT INTO tasks (title, description, priority, status, isCompleted, completedAt, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [task.title, task.description, task.priority, task.status, task.isCompleted || 0, task.completedAt || null, task.date]
        );
      }

      console.log('✅ Sample tasks inserted successfully');
    }

  } catch (error) {
    console.error('❌ Error setting up tasks table:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
};

// Run the setup if this script is executed directly
if (require.main === module) {
  setupTasksTable()
    .then(() => {
      console.log('🎉 Tasks table setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Tasks table setup failed:', error);
      process.exit(1);
    });
}

module.exports = setupTasksTable;
