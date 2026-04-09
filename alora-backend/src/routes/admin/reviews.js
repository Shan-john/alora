const express = require('express');
const router = express.Router();
const { pool } = require('../../config/database');

const refreshProductRating = async (productId) => {
  if (!productId) return;

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

// GET /api/admin/reviews
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.*, p.name as product_name, p.category_slug as product_category
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      ORDER BY r.created_at DESC
    `);
    
    const reviews = rows.map(r => ({
      ...r,
      productName: r.product_name,
      productCategory: r.product_category,
      isApproved: r.is_approved
    }));
    
    res.json({ reviews });
  } catch (err) {
    console.error('GET /admin/reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// PUT /api/admin/reviews/:id/approve
router.put('/:id/approve', async (req, res) => {
  try {
    const { isApproved } = req.body;
    const { rows } = await pool.query(
      'UPDATE reviews SET is_approved = $1 WHERE id = $2 RETURNING product_id',
      [isApproved, req.params.id]
    );
    if (rows.length > 0) {
      await refreshProductRating(rows[0].product_id);
    }
    res.json({ message: 'Review status updated' });
  } catch (err) {
    console.error('PUT /admin/reviews approve error:', err);
    res.status(500).json({ error: 'Failed to update review status' });
  }
});

// DELETE /api/admin/reviews/:id
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING product_id', [req.params.id]);
    if (rows.length > 0) {
      await refreshProductRating(rows[0].product_id);
    }
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('DELETE /admin/reviews error:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
