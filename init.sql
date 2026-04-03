-- SQL Initialization Script for Grain Grid Users Database
-- You can run this script directly on your MySQL database (e.g., via phpMyAdmin on StackCP) to initialize the tables if they aren't created automatically.

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

-- Note: The admin user will be seeded automatically by the running server
-- If you wish to manually insert it here, you can uncomment the following lines (replace password_hash with the actual bcrypt hash of 'S@i85t@run'):

-- INSERT INTO users (full_name, email, password_hash, role, username, fitness_level, goal, onboarding_completed)
-- VALUES ('Tarun V.', 'tarun@gmail.com', '$2a$10$w...YOUR_HASH_HERE...', 'admin', 'tarunadmin', 'Advanced', 'Bulk Up', 1);
