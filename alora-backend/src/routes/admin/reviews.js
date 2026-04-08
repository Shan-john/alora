const express = require('express');
const router = express.Router();
const { db, admin } = require('../../config/firebase');

// GET /api/admin/reviews/pending — pending reviews
router.get('/pending', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews')
      .where('isApproved', '==', false)
      .orderBy('createdAt', 'desc')
      .get();
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ reviews });
  } catch (err) {
    console.error('Admin GET /reviews/pending error:', err);
    res.status(500).json({ error: 'Failed to fetch pending reviews' });
  }
});

// GET /api/admin/reviews — all reviews
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews').orderBy('createdAt', 'desc').get();
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ reviews });
  } catch (err) {
    console.error('Admin GET /reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// PATCH /api/admin/reviews/:id — approve or reject
router.patch('/:id', async (req, res) => {
  try {
    const { isApproved } = req.body;
    const docRef = db.collection('reviews').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (isApproved === false) {
      // Reject: delete the review
      await docRef.delete();
      return res.json({ message: 'Review rejected and deleted' });
    }

    await docRef.update({ isApproved: true });

    // Update product rating
    const reviewData = doc.data();
    if (reviewData.productId) {
      const productRef = db.collection('products').doc(reviewData.productId);
      const productDoc = await productRef.get();
      if (productDoc.exists) {
        const p = productDoc.data();
        const newCount = (p.reviewCount || 0) + 1;
        const newRating = ((p.rating || 0) * (p.reviewCount || 0) + reviewData.rating) / newCount;
        await productRef.update({ rating: Math.round(newRating * 10) / 10, reviewCount: newCount });
      }
    }

    res.json({ message: 'Review approved' });
  } catch (err) {
    console.error('Admin PATCH /reviews error:', err);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// POST /api/admin/reviews — create manual review
router.post('/', async (req, res) => {
  try {
    const { customerName, igHandle, rating, text, productId } = req.body;

    const reviewData = {
      productId: productId || null,
      customerName: customerName || '',
      igHandle: igHandle || '',
      rating: parseInt(rating) || 5,
      text: text || '',
      isApproved: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('reviews').add(reviewData);
    res.status(201).json({ id: docRef.id, ...reviewData });
  } catch (err) {
    console.error('Admin POST /reviews error:', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

module.exports = router;
