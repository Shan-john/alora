const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

const refreshProductRating = async (productId) => {
  await pool.query(
    `
    UPDATE products p
    SET
      rating = COALESCE(stats.avg_rating, 0),
      review_count = COALESCE(stats.review_count, 0),
      updated_at = CURRENT_TIMESTAMP
    FROM (
      SELECT
        product_id,
        ROUND(AVG(rating)::numeric, 2) AS avg_rating,
        COUNT(*)::int AS review_count
      FROM reviews
      WHERE product_id = $1 AND is_approved = true
      GROUP BY product_id
    ) stats
    WHERE p.id = $1
    `,
    [productId]
  );

  await pool.query(
    `
    UPDATE products
    SET
      rating = 0,
      review_count = 0,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND NOT EXISTS (
        SELECT 1
        FROM reviews
        WHERE product_id = $1 AND is_approved = true
      )
    `,
    [productId]
  );
};

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
      query = `
        SELECT r.*
        FROM reviews r
        LEFT JOIN products p ON p.id = r.product_id
        WHERE r.is_approved = true
          AND (r.product_id = $1 OR p.slug = $1)
        ORDER BY r.created_at DESC
      `;
      params = [productId];
    }

    const { rows: reviews } = await pool.query(query, params);
    
    res.json({ reviews });
  } catch (err) {
    console.error('GET /reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews — submit a new review (pending approval)
router.post('/', async (req, res) => {
  try {
    const {
      productId,
      customerName,
      igHandle = '',
      rating,
      reviewText,
    } = req.body || {};

    if (!productId || !customerName || !reviewText || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const numericRating = Number.parseInt(rating, 10);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const { rows: productRows } = await pool.query(
      'SELECT id FROM products WHERE id = $1 OR slug = $1 LIMIT 1',
      [productId]
    );
    if (!productRows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await pool.query(
      `INSERT INTO reviews (product_id, customer_name, ig_handle, rating, review_text, is_approved)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [
        productRows[0].id,
        String(customerName).trim(),
        String(igHandle).trim().replace(/^@/, ''),
        numericRating,
        String(reviewText).trim(),
      ]
    );

    await refreshProductRating(productRows[0].id);

    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (err) {
    console.error('POST /reviews error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;
