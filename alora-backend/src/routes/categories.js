const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// GET /api/categories — list visible categories
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('categories')
      .where('isVisible', '==', true)
      .orderBy('order', 'asc')
      .get();

    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ categories });
  } catch (err) {
    console.error('GET /categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
