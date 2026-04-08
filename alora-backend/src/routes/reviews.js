const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// GET /api/reviews/:productId — get approved reviews for a product
// Use "homepage" as productId to get homepage testimonials (productId=null)
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    let query = db.collection('reviews').where('isApproved', '==', true);

    if (productId === 'homepage') {
      query = query.where('productId', '==', null);
    } else {
      query = query.where('productId', '==', productId);
    }

    query = query.orderBy('createdAt', 'desc');
    const snapshot = await query.get();
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ reviews });
  } catch (err) {
    console.error('GET /reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
