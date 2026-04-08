const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// GET /api/settings — public store settings
router.get('/', async (req, res) => {
  try {
    const doc = await db.collection('settings').doc('store').get();
    if (!doc.exists) {
      return res.json({ settings: {} });
    }
    res.json({ settings: doc.data() });
  } catch (err) {
    console.error('GET /settings error:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

module.exports = router;
