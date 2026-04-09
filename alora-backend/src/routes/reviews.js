const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/reviews/:productId — get approved reviews for a product
// Use "homepage" as productId to get homepage testimonials (productId is null)
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    let query, params;

    if (productId === 'homepage') {
      query = 'SELECT * FROM reviews WHERE is_approved = true AND product_id IS NULL ORDER BY created_at DESC';
      params = [];
    } else {
      query = 'SELECT * FROM reviews WHERE is_approved = true AND product_id = $1 ORDER BY created_at DESC';
      params = [productId];
    }

    const { rows: reviews } = await pool.query(query, params);
    
    res.json({ reviews });
  } catch (err) {
    console.error('GET /reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
