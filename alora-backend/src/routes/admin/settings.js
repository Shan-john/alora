const express = require('express');
const router = express.Router();
const { pool } = require('../../config/database');

// GET /api/admin/settings
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT setting_value FROM settings WHERE setting_key = $1', ['store']);
    if (rows.length === 0) return res.json({ settings: {} });
    res.json({ settings: rows[0].setting_value });
  } catch (err) {
    console.error('GET /admin/settings error:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/admin/settings
router.put('/', async (req, res) => {
  try {
    const settings = req.body;
    await pool.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = CURRENT_TIMESTAMP',
      ['store', JSON.stringify(settings)]
    );
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    console.error('PUT /admin/settings error:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
