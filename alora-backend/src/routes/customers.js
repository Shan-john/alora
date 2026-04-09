const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

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
