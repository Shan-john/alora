const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { body, validationResult } = require('express-validator');

// POST /api/newsletter/subscribe
router.post('/subscribe', [
  body('email').isEmail().withMessage('Valid email is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;

    // Insert ignoring conflicts
    await pool.query(
      'INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
      [email]
    );

    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (err) {
    console.error('POST /newsletter/subscribe error:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// POST /api/newsletter/unsubscribe
router.post('/unsubscribe', [
  body('email').isEmail().withMessage('Valid email is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const { rowCount } = await pool.query(
      'DELETE FROM subscribers WHERE email = $1',
      [email]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Email not found in subscriber list' });
    }

    res.json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    console.error('POST /newsletter/unsubscribe error:', err);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

module.exports = router;
