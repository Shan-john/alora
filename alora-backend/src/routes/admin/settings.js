const express = require('express');
const router = express.Router();
const { pool } = require('../../config/database');

const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

const mergeDeep = (target = {}, source = {}) => {
  const output = { ...target };

  Object.keys(source || {}).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = output[key];

    if (isObject(sourceValue) && isObject(targetValue)) {
      output[key] = mergeDeep(targetValue, sourceValue);
    } else {
      output[key] = sourceValue;
    }
  });

  return output;
};

const upsertSettings = async (settings) => {
  await pool.query(
    'INSERT INTO settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = CURRENT_TIMESTAMP',
    ['store', JSON.stringify(settings)]
  );
};

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

// PUT /api/admin/settings (replace all)
router.put('/', async (req, res) => {
  try {
    const settings = req.body || {};
    await upsertSettings(settings);
    res.json({ message: 'Settings updated successfully', settings });
  } catch (err) {
    console.error('PUT /admin/settings error:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// PATCH /api/admin/settings (merge partial)
router.patch('/', async (req, res) => {
  try {
    const updates = req.body || {};
    const { rows } = await pool.query('SELECT setting_value FROM settings WHERE setting_key = $1', ['store']);
    const currentSettings = rows.length ? rows[0].setting_value : {};
    const mergedSettings = mergeDeep(currentSettings, updates);
    await upsertSettings(mergedSettings);
    res.json({ message: 'Settings updated successfully', settings: mergedSettings });
  } catch (err) {
    console.error('PATCH /admin/settings error:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// POST /api/admin/settings/reset (optional helper for UI)
router.post('/reset', async (req, res) => {
  try {
    await upsertSettings({});
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    console.error('POST /admin/settings/reset error:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
