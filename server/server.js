import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool, { initDB } from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-gaingrid-key-replace-me-in-prod';

// Initialize DB on startup
initDB();

// --- AUTHENTICATION ROUTES ---

app.post('/api/auth/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const [inserted] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [fullName, email, hash]
    );
    
    const newUserId = inserted.insertId;

    // Generate token
    const token = jwt.sign({ id: newUserId, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { 
        id: newUserId, 
        fullName, 
        email, 
        role: 'user',
        onboarding_completed: 0 
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];
    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        fullName: user.full_name, 
        email: user.email, 
        role: user.role,
        onboarding_completed: user.onboarding_completed
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// --- ADMIN ROUTES ---

// Middleware to protect standard routes
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.put('/api/auth/onboarding', requireAuth, async (req, res) => {
  const { username, fitnessLevel, goal, gymLocation, profilePhoto } = req.body;
  const userId = req.user.id;

  try {
    // Check if username is taken by another user
    if (username) {
      const [existingName] = await pool.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, userId]);
      if (existingName.length > 0) {
        return res.status(400).json({ error: 'Username is already taken.' });
      }
    }

    await pool.query(`
      UPDATE users 
      SET username = ?, fitness_level = ?, goal = ?, gym_location = ?, profile_photo = ?, onboarding_completed = 1
      WHERE id = ?
    `, [username, fitnessLevel, goal, gymLocation, profilePhoto, userId]);
    
    // Fetch updated user to return
    const [updatedUsers] = await pool.query(
      'SELECT id, full_name, email, role, onboarding_completed, username, profile_photo FROM users WHERE id = ?',
      [userId]
    );
    const updatedUser = updatedUsers[0];
    
    res.json({ 
      message: 'Onboarding complete', 
      user: {
        id: updatedUser.id,
        fullName: updatedUser.full_name,
        email: updatedUser.email,
        role: updatedUser.role,
        onboardingCompleted: updatedUser.onboarding_completed,
        username: updatedUser.username,
        profilePhoto: updatedUser.profile_photo
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during onboarding.' });
  }
});

// Middleware to protect admin routes
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Requires admin privileges' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching users.' });
  }
});

// --- RENDER DEPLOYMENT & STATIC ROUTES ---

// Serve the compiled frontend client from the `dist` directory
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all to allow React router to handle all unresolved paths
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
