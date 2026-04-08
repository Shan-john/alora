const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// GET /api/products — list active products with filters
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, limit = 20, startAfter, search, isBestSeller, isTrendingIG } = req.query;

    let query = db.collection('products').where('status', '==', 'active');

    if (category) {
      query = query.where('category', '==', category);
    }

    if (isBestSeller === 'true') {
      query = query.where('isBestSeller', '==', true);
    }

    if (isTrendingIG === 'true') {
      query = query.where('isTrendingIG', '==', true);
    }

    // Default sort
    let sortField = 'createdAt';
    let sortDir = 'desc';
    if (sort === 'price_asc') { sortField = 'price'; sortDir = 'asc'; }
    else if (sort === 'price_desc') { sortField = 'price'; sortDir = 'desc'; }
    else if (sort === 'name_asc') { sortField = 'name'; sortDir = 'asc'; }
    else if (sort === 'newest') { sortField = 'createdAt'; sortDir = 'desc'; }

    query = query.orderBy(sortField, sortDir);

    if (startAfter) {
      const lastDoc = await db.collection('products').doc(startAfter).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    query = query.limit(parseInt(limit));

    const snapshot = await query.get();
    let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Client-side price filter (Firestore doesn't support range on different field + inequality)
    if (minPrice) {
      products = products.filter(p => (p.salePrice || p.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => (p.salePrice || p.price) <= parseFloat(maxPrice));
    }

    // Client-side search
    if (search) {
      const s = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(s) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(s)))
      );
    }

    res.json({ products, count: products.length });
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id — single product
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();
    if (!doc.exists || doc.data().status !== 'active') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('GET /products/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
