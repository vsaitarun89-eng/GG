/*
SQL Initialization Script for Grain Grid Users Database
You can run this script directly on your MySQL database (e.g., via phpMyAdmin on StackCP) to initialize the tables if they aren't created automatically.
*/

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
  onboarding_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* 
Note: The admin user will be seeded automatically by the running server
If you wish to manually insert it here, you can uncomment the following lines (replace password_hash with the actual bcrypt hash of 'S@i85t@run'):

INSERT INTO users (full_name, email, password_hash, role, username, fitness_level, goal, onboarding_completed)
VALUES ('Tarun V.', 'tarun@gmail.com', '$2a$10$w...YOUR_HASH_HERE...', 'admin', 'tarunadmin', 'Advanced', 'Bulk Up', 1);
*/

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
