const express = require('express');
const router = express.Router();
const { pool } = require('../../config/database');

// GET /api/admin/dashboard — Overview metrics
router.get('/', async (req, res) => {
  try {
    const metrics = {
      totalRevenue: 0,
      totalOrders: 0,
      productsCount: 0,
      recentOrders: []
    };

    // Revenue & Total Orders
    const { rows: orderStats } = await pool.query('SELECT SUM(total) as revenue, COUNT(id) as count FROM orders');
    if (orderStats.length > 0) {
      metrics.totalRevenue = Number(orderStats[0].revenue) || 0;
      metrics.totalOrders = Number(orderStats[0].count) || 0;
    }

    // Products Count
    const { rows: prodStats } = await pool.query('SELECT COUNT(id) as count FROM products');
    if (prodStats.length > 0) {
      metrics.productsCount = Number(prodStats[0].count) || 0;
    }

    // Recent 5 Orders
    const { rows: recentOrders } = await pool.query(`
      SELECT 
        id as "orderId", 
        customer_name as "customerName", 
        total, 
        status, 
        created_at as "createdAt" 
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    metrics.recentOrders = recentOrders;

    res.json(metrics);
  } catch (err) {
    console.error('GET /admin/dashboard error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
