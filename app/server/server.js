import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

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

const sanitizeText = (value, maxLength) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

const mapUserProfile = (user) => ({
  id: user.id,
  fullName: user.full_name,
  username: user.username,
  profilePhoto: user.profile_photo,
  fitnessLevel: user.fitness_level,
  goal: user.goal,
  role: user.role
});

const loadConversationForUser = async (userId, conversationId) => {
  const [rows] = await pool.query(
    `
      SELECT
        c.id,
        c.kind,
        c.title,
        c.secret_hint,
        c.kdf_salt,
        c.created_by,
        c.created_at,
        c.updated_at
      FROM message_conversations c
      JOIN message_conversation_participants cp
        ON cp.conversation_id = c.id
      WHERE c.id = ? AND cp.user_id = ?
      LIMIT 1
    `,
    [conversationId, userId]
  );

  return rows[0] || null;
};

const loadConversationParticipants = async (conversationIds) => {
  if (!conversationIds.length) {
    return new Map();
  }

  const [rows] = await pool.query(
    `
      SELECT
        cp.conversation_id,
        u.id,
        u.full_name,
        u.username,
        u.profile_photo,
        u.fitness_level,
        u.goal,
        u.role
      FROM message_conversation_participants cp
      JOIN users u
        ON u.id = cp.user_id
      WHERE cp.conversation_id IN (?)
      ORDER BY u.full_name ASC
    `,
    [conversationIds]
  );

  const participantsByConversation = new Map();

  rows.forEach((row) => {
    const existing = participantsByConversation.get(row.conversation_id) || [];
    existing.push(mapUserProfile(row));
    participantsByConversation.set(row.conversation_id, existing);
  });

  return participantsByConversation;
};

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

// --- USER ROUTES ---

app.get('/api/users/search', requireAuth, async (req, res) => {
  const query = req.query.q || '';
  if (!query.trim()) {
    return res.json({ users: [] });
  }
  
  try {
    const searchTerm = `%${query.trim()}%`;
    const [users] = await pool.query(
      `
      SELECT id, full_name, username, profile_photo, fitness_level, goal, role 
      FROM users 
      WHERE username LIKE ? OR full_name LIKE ?
      ORDER BY full_name ASC
      LIMIT 20
      `,
      [searchTerm, searchTerm]
    );
    res.json({ users: users.map(mapUserProfile) });
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during user search.' });
  }
});

app.get('/api/users/:username', requireAuth, async (req, res) => {
  const username = req.params.username;
  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  try {
    const [users] = await pool.query(
      `
      SELECT id, full_name, username, profile_photo, fitness_level, goal, role, gym_location
      FROM users 
      WHERE username = ?
      LIMIT 1
      `,
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: mapUserProfile(users[0]) });
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching user profile.' });
  }
});

// --- MESSAGING ROUTES ---

app.get('/api/messages/users', requireAuth, async (req, res) => {
  try {
    const [users] = await pool.query(
      `
        SELECT
          id,
          full_name,
          username,
          profile_photo,
          fitness_level,
          goal,
          role
        FROM users
        WHERE id != ?
        ORDER BY onboarding_completed DESC, full_name ASC
      `,
      [req.user.id]
    );

    res.json({ users: users.map(mapUserProfile) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error loading message contacts.' });
  }
});

app.get('/api/messages/conversations', requireAuth, async (req, res) => {
  try {
    const [conversations] = await pool.query(
      `
        SELECT
          c.id,
          c.kind,
          c.title,
          c.secret_hint,
          c.kdf_salt,
          c.created_by,
          c.created_at,
          c.updated_at,
          MAX(m.created_at) AS last_message_at,
          COUNT(m.id) AS message_count
        FROM message_conversations c
        JOIN message_conversation_participants mine
          ON mine.conversation_id = c.id
         AND mine.user_id = ?
        LEFT JOIN messages m
          ON m.conversation_id = c.id
        GROUP BY c.id
        ORDER BY COALESCE(MAX(m.created_at), c.updated_at, c.created_at) DESC
      `,
      [req.user.id]
    );

    const conversationIds = conversations.map((conversation) => conversation.id);
    const participantsByConversation = await loadConversationParticipants(conversationIds);

    res.json({
      conversations: conversations.map((conversation) => {
        const participants = participantsByConversation.get(conversation.id) || [];
        const otherParticipants = participants.filter((participant) => participant.id !== req.user.id);

        return {
          id: conversation.id,
          kind: conversation.kind,
          title: conversation.title,
          secretHint: conversation.secret_hint,
          kdfSalt: conversation.kdf_salt,
          createdBy: conversation.created_by,
          createdAt: conversation.created_at,
          updatedAt: conversation.updated_at,
          lastMessageAt: conversation.last_message_at,
          messageCount: conversation.message_count,
          previewText: conversation.message_count > 0 ? 'Encrypted message' : 'Shared secret required',
          participants,
          otherParticipants
        };
      })
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error loading conversations.' });
  }
});

app.post('/api/messages/conversations', requireAuth, async (req, res) => {
  const participantId = Number(req.body.participantId);
  const secretHint = sanitizeText(req.body.secretHint, 120) || null;
  const kdfSalt = sanitizeText(req.body.kdfSalt, 255);

  if (!Number.isInteger(participantId) || participantId <= 0 || participantId === req.user.id) {
    return res.status(400).json({ error: 'A valid recipient is required.' });
  }

  if (!kdfSalt) {
    return res.status(400).json({ error: 'A conversation salt is required.' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [recipientRows] = await connection.query(
      `
        SELECT
          id,
          full_name,
          username,
          profile_photo,
          fitness_level,
          goal,
          role
        FROM users
        WHERE id = ?
        LIMIT 1
      `,
      [participantId]
    );

    if (!recipientRows.length) {
      await connection.rollback();
      return res.status(404).json({ error: 'Recipient not found.' });
    }

    const [existingConversationRows] = await connection.query(
      `
        SELECT
          c.id
        FROM message_conversations c
        JOIN message_conversation_participants cp
          ON cp.conversation_id = c.id
        WHERE c.kind = 'direct'
          AND cp.user_id IN (?, ?)
        GROUP BY c.id
        HAVING COUNT(DISTINCT cp.user_id) = 2
           AND (
             SELECT COUNT(*)
             FROM message_conversation_participants all_cp
             WHERE all_cp.conversation_id = c.id
           ) = 2
        LIMIT 1
      `,
      [req.user.id, participantId]
    );

    let conversationId = existingConversationRows[0]?.id;

    if (!conversationId) {
      const [insertConversation] = await connection.query(
        `
          INSERT INTO message_conversations (
            kind,
            title,
            secret_hint,
            kdf_salt,
            created_by
          ) VALUES ('direct', NULL, ?, ?, ?)
        `,
        [secretHint, kdfSalt, req.user.id]
      );

      conversationId = insertConversation.insertId;

      await connection.query(
        `
          INSERT INTO message_conversation_participants (conversation_id, user_id)
          VALUES (?, ?), (?, ?)
        `,
        [conversationId, req.user.id, conversationId, participantId]
      );
    }

    await connection.commit();

    const conversation = await loadConversationForUser(req.user.id, conversationId);
    const participantsByConversation = await loadConversationParticipants([conversationId]);

    res.status(existingConversationRows.length ? 200 : 201).json({
      conversation: {
        id: conversation.id,
        kind: conversation.kind,
        title: conversation.title,
        secretHint: conversation.secret_hint,
        kdfSalt: conversation.kdf_salt,
        createdBy: conversation.created_by,
        createdAt: conversation.created_at,
        updatedAt: conversation.updated_at,
        participants: participantsByConversation.get(conversationId) || []
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: 'Server error creating conversation.' });
  } finally {
    connection.release();
  }
});

app.get('/api/messages/conversations/:conversationId', requireAuth, async (req, res) => {
  const conversationId = Number(req.params.conversationId);

  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    return res.status(400).json({ error: 'Invalid conversation id.' });
  }

  try {
    const conversation = await loadConversationForUser(req.user.id, conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    const participantsByConversation = await loadConversationParticipants([conversationId]);
    const [messages] = await pool.query(
      `
        SELECT
          id,
          sender_id,
          sealed_body,
          algorithm,
          body_encoding,
          content_type,
          created_at
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC, id ASC
      `,
      [conversationId]
    );

    res.json({
      conversation: {
        id: conversation.id,
        kind: conversation.kind,
        title: conversation.title,
        secretHint: conversation.secret_hint,
        kdfSalt: conversation.kdf_salt,
        createdBy: conversation.created_by,
        createdAt: conversation.created_at,
        updatedAt: conversation.updated_at,
        participants: participantsByConversation.get(conversationId) || []
      },
      messages: messages.map((message) => ({
        id: String(message.id),
        senderId: message.sender_id,
        sealedBody: message.sealed_body,
        algorithm: message.algorithm,
        bodyEncoding: message.body_encoding,
        contentType: message.content_type,
        createdAt: message.created_at
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error loading messages.' });
  }
});

app.post('/api/messages/conversations/:conversationId/messages', requireAuth, async (req, res) => {
  const conversationId = Number(req.params.conversationId);
  const sealedBody = sanitizeText(req.body.sealedBody, 50000);
  const algorithm = sanitizeText(req.body.algorithm, 64) || 'aes-256-gcm';
  const bodyEncoding = sanitizeText(req.body.bodyEncoding, 32) || 'base64';
  const contentType = sanitizeText(req.body.contentType, 32) || 'text';

  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    return res.status(400).json({ error: 'Invalid conversation id.' });
  }

  if (!sealedBody) {
    return res.status(400).json({ error: 'Encrypted message payload is required.' });
  }

  try {
    const conversation = await loadConversationForUser(req.user.id, conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    const [insertMessage] = await pool.query(
      `
        INSERT INTO messages (
          conversation_id,
          sender_id,
          sealed_body,
          algorithm,
          body_encoding,
          content_type
        ) VALUES (?, ?, ?, ?, ?, ?)
      `,
      [conversationId, req.user.id, sealedBody, algorithm, bodyEncoding, contentType]
    );

    await pool.query(
      `
        UPDATE message_conversations
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [conversationId]
    );

    const [rows] = await pool.query(
      `
        SELECT
          id,
          sender_id,
          sealed_body,
          algorithm,
          body_encoding,
          content_type,
          created_at
        FROM messages
        WHERE id = ?
        LIMIT 1
      `,
      [insertMessage.insertId]
    );

    const message = rows[0];

    res.status(201).json({
      message: {
        id: String(message.id),
        senderId: message.sender_id,
        sealedBody: message.sealed_body,
        algorithm: message.algorithm,
        bodyEncoding: message.body_encoding,
        contentType: message.content_type,
        createdAt: message.created_at
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error sending encrypted message.' });
  }
});

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
