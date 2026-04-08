const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');
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

    // Check if already subscribed
    const existing = await db.collection('subscribers')
      .where('email', '==', email).limit(1).get();

    if (!existing.empty) {
      return res.json({ message: 'Already subscribed!' });
    }

    await db.collection('subscribers').add({
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (err) {
    console.error('POST /newsletter/subscribe error:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

module.exports = router;
