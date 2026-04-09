const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/customers/register
router.post('/register', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, name, phone } = req.body;

    const { rows: existing } = await pool.query('SELECT id FROM customers WHERE email = $1', [email]);
    if (existing.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const { rows: newCustomer } = await pool.query(
      'INSERT INTO customers (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, phone || '', hash]
    );

    res.status(201).json({ uid: newCustomer[0].id, message: 'Account created successfully' });
  } catch (err) {
    console.error('POST /customers/register error:', err);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

module.exports = router;

// POST /api/customers/login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find the user by email
    const { rows } = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    // Check if the password hash exists and matches
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Invalid authentication method or user' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Sign the JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    console.error('POST /customers/login error:', err);
    res.status(500).json({ error: 'Failed to process login' });
  }
});

