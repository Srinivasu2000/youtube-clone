const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/db');
const { sendVerificationEmail } = require('../config/mailer');
require('dotenv').config();

// POST /auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const token = uuidv4();
    await pool.query(
      'INSERT INTO users (name, email, password, verification_token) VALUES (?, ?, ?, ?)',
      [name, email, hashed, token]
    );
    await sendVerificationEmail(email, token);
    res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// GET /auth/verify-email
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Missing token' });
  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE verification_token = ?', [token]);
    if (rows.length === 0) return res.status(400).json({ error: 'Invalid or expired token' });
    await pool.query('UPDATE users SET verified = 1, verification_token = NULL WHERE id = ?', [rows[0].id]);
    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during verification' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    if (!user.verified) return res.status(403).json({ error: 'Please verify your email before logging in' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const jwtToken = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
