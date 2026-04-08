const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');
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

    await db.collection('enquiries').add({
      name,
      email,
      subject,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Enquiry submitted successfully' });
  } catch (err) {
    console.error('POST /enquiries error:', err);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

module.exports = router;
