const express = require('express');
const router = express.Router();
const { pool } = require('../../config/database');

// GET /api/admin/customers
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, phone, created_at FROM customers ORDER BY created_at DESC');
    res.json({ customers: rows });
  } catch (err) {
    console.error('GET /admin/customers error:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

module.exports = router;
