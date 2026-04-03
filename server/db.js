import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Connection details configured for StackCP MySQL database
// The previous "host" was actually the Database Name, and "sdb-90.hosting.stackcp.net" is the host!
const pool = mysql.createPool({
  host: process.env.DB_HOST || "sdb-90.hosting.stackcp.net",
  user: process.env.DB_USER || "GG-5a30",
  password: process.env.DB_PASSWORD || "S@i85t@run",
  database: process.env.DB_NAME || "GGgymcomunity-35313139ad39",
  port: process.env.DB_PORT || 42253,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 5000 // 5 seconds instead of 30 seconds to fail fast
});

// Initialize database schema
export async function initDB() {
  try {
    const connection = await pool.getConnection();
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          username VARCHAR(255) UNIQUE,
          fitness_level VARCHAR(100),
          goal VARCHAR(255),
          gym_location VARCHAR(255),
          profile_photo TEXT,
          onboarding_completed INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed admin user if it doesn't exist
      const adminEmail = 'tarun@gmail.com';
      const [rows] = await connection.query('SELECT id FROM users WHERE email = ?', [adminEmail]);

      if (rows.length === 0) {
        const defaultPassword = 'S@i85t@run';
        const hash = bcrypt.hashSync(defaultPassword, 10);
        
        await connection.query(`
          INSERT INTO users (
            full_name, email, password_hash, role, 
            username, fitness_level, goal, onboarding_completed
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, ['Tarun V.', adminEmail, hash, 'admin', 'tarunadmin', 'Advanced', 'Bulk Up', 1]);
        console.log('✅ Admin user seeded successfully.');
      } else {
        console.log('✅ Database initialization verified.');
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('\n=======================================');
    console.error('⚠️ DB Initialization skipped: MySQL Connection Failed!');
    console.error('StackCP Error:', error.message);
    console.error('IMPORTANT: StackCP blocks external connections by default. You MUST go to your StackCP dashboard -> "Remote MySQL" and "Add Access Host" for your current internet IP Address to connect locally. You must also do this for Render\'s IPs when deploying.');
    console.error('=======================================\n');
  }
}

export default pool;
