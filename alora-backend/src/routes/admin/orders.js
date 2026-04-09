const express = require('express');
const router = express.Router();
const { pool } = require('../../config/database');

// GET /api/admin/orders
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT o.*, 
             COALESCE((SELECT json_agg(i.*) FROM order_items i WHERE i.order_id = o.id), '[]'::json) as items 
      FROM orders o 
      ORDER BY o.created_at DESC
    `);
    
    // Map snake_case to JS camelCase
    const orders = rows.map(r => ({
      ...r,
      customer: { name: r.customer_name, email: r.customer_email, phone: r.customer_phone }
    }));
    
    res.json({ orders });
  } catch (err) {
    console.error('GET /admin/orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PUT /api/admin/orders/:id/status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error('PUT /admin/orders status error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
