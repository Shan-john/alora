const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { body, validationResult } = require('express-validator');

// POST /api/enquiries — contact form
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, subject, message } = req.body;

    await pool.query(
      'INSERT INTO enquiries (name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [name, email, subject, message]
    );

    res.status(201).json({ message: 'Enquiry submitted successfully' });
  } catch (err) {
    console.error('POST /enquiries error:', err);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

module.exports = router;
