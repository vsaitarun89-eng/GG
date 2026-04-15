import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Connection details configured for StackCP MySQL database
// The previous "host" was actually the Database Name, and "sdb-90.hosting.stackcp.net" is the host!
const pool = mysql.createPool({
  host: process.env.DB_HOST || "mysql.gb.stackcp.com",
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

      await connection.query(`
        CREATE TABLE IF NOT EXISTS message_conversations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          kind VARCHAR(20) NOT NULL DEFAULT 'direct',
          title VARCHAR(255),
          secret_hint VARCHAR(255),
          kdf_salt VARCHAR(255) NOT NULL,
          created_by INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          KEY idx_message_conversations_updated_at (updated_at),
          CONSTRAINT fk_message_conversations_creator
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS message_conversation_participants (
          conversation_id INT NOT NULL,
          user_id INT NOT NULL,
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (conversation_id, user_id),
          KEY idx_message_participants_user (user_id),
          CONSTRAINT fk_message_participants_conversation
            FOREIGN KEY (conversation_id) REFERENCES message_conversations(id) ON DELETE CASCADE,
          CONSTRAINT fk_message_participants_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          conversation_id INT NOT NULL,
          sender_id INT NOT NULL,
          sealed_body LONGTEXT NOT NULL,
          algorithm VARCHAR(64) NOT NULL DEFAULT 'aes-256-gcm',
          body_encoding VARCHAR(32) NOT NULL DEFAULT 'base64',
          content_type VARCHAR(32) NOT NULL DEFAULT 'text',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          KEY idx_messages_conversation_created_at (conversation_id, created_at),
          KEY idx_messages_sender_created_at (sender_id, created_at),
          CONSTRAINT fk_messages_conversation
            FOREIGN KEY (conversation_id) REFERENCES message_conversations(id) ON DELETE CASCADE,
          CONSTRAINT fk_messages_sender
            FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
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
