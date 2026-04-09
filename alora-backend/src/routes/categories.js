const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/categories — list visible categories
router.get('/', async (req, res) => {
  try {
    const { rows: categories } = await pool.query(
      'SELECT slug, name, image_url as image, display_order FROM categories WHERE is_visible = true ORDER BY display_order ASC'
    );
    res.json({ categories });
  } catch (err) {
    console.error('GET /categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
