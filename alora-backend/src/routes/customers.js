const express = require('express');
const router = express.Router();
const { db, auth: firebaseAuth, admin } = require('../config/firebase');
const { body, validationResult } = require('express-validator');

// POST /api/customers/register — create user + Firestore doc
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

    // Create Firebase Auth user
    const userRecord = await firebaseAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // Create Firestore customer doc
    await db.collection('customers').doc(userRecord.uid).set({
      name,
      email,
      phone: phone || '',
      orderIds: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ uid: userRecord.uid, message: 'Account created successfully' });
  } catch (err) {
    console.error('POST /customers/register error:', err);
    if (err.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: 'Failed to create account' });
  }
});

module.exports = router;
