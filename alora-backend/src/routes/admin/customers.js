const express = require('express');
const router = express.Router();
const { db } = require('../../config/firebase');

// GET /api/admin/customers — list all customers
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('customers').orderBy('createdAt', 'desc').get();
    const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ customers });
  } catch (err) {
    console.error('Admin GET /customers error:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/admin/customers/:id — single customer
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('customers').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('Admin GET /customers/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

module.exports = router;
