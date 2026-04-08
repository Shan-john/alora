const express = require('express');
const router = express.Router();
const { db, admin } = require('../../config/firebase');
const { sendTestEmail } = require('../../services/email');

// GET /api/admin/settings
router.get('/', async (req, res) => {
  try {
    const doc = await db.collection('settings').doc('store').get();
    res.json({ settings: doc.exists ? doc.data() : {} });
  } catch (err) {
    console.error('Admin GET /settings error:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PATCH /api/admin/settings — update store settings
router.patch('/', async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await db.collection('settings').doc('store').set(updates, { merge: true });
    res.json({ message: 'Settings updated' });
  } catch (err) {
    console.error('Admin PATCH /settings error:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// POST /api/admin/settings/test-email
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    await sendTestEmail(email || req.user.email);
    res.json({ message: 'Test email sent successfully' });
  } catch (err) {
    console.error('Admin POST /settings/test-email error:', err);
    res.status(500).json({ error: 'Failed to send test email: ' + err.message });
  }
});

module.exports = router;
