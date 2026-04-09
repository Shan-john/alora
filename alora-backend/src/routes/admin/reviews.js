const express = require('express');
const router = express.Router();
const { pool } = require('../../config/database');

// GET /api/admin/reviews
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.*, p.name as product_name
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      ORDER BY r.created_at DESC
    `);
    
    const reviews = rows.map(r => ({
      ...r,
      productName: r.product_name,
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
    await pool.query('UPDATE reviews SET is_approved = $1 WHERE id = $2', [isApproved, req.params.id]);
    res.json({ message: 'Review status updated' });
  } catch (err) {
    console.error('PUT /admin/reviews approve error:', err);
    res.status(500).json({ error: 'Failed to update review status' });
  }
});

// DELETE /api/admin/reviews/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('DELETE /admin/reviews error:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
