const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/settings — public store settings
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT setting_value FROM settings WHERE setting_key = 'store'");
    if (rows.length === 0) {
      return res.json({ settings: {} });
    }
    res.json({ settings: rows[0].setting_value });
  } catch (err) {
    console.error('GET /settings error:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

module.exports = router;
