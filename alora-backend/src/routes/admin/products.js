const express = require('express');
const router = express.Router();
const { db, admin } = require('../../config/firebase');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { uploadToStorage } = require('../../services/storage');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/admin/products — all products (any status)
router.get('/', async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = db.collection('products');

    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    if (category) {
      query = query.where('category', '==', category);
    }

    query = query.orderBy('createdAt', 'desc');
    const snapshot = await query.get();
    let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (search) {
      const s = search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(s));
    }

    res.json({ products });
  } catch (err) {
    console.error('Admin GET /products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/admin/products — create product
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const { name, slug, description, price, salePrice, category, tags, stock, variants, status, isBestSeller, isTrendingIG } = data;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    // Upload images
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToStorage(file.buffer, file.originalname, 'products');
        imageUrls.push(url);
      }
    }

    const productData = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: description || '',
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      images: imageUrls.length > 0 ? imageUrls : (data.images || []),
      category: category || '',
      tags: tags || [],
      stock: parseInt(stock) || 0,
      variants: variants || { sizes: [], colors: [] },
      isBestSeller: isBestSeller || false,
      isTrendingIG: isTrendingIG || false,
      status: status || 'draft',
      rating: 0,
      reviewCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('products').add(productData);
    res.status(201).json({ id: docRef.id, ...productData });
  } catch (err) {
    console.error('Admin POST /products error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PATCH /api/admin/products/:id — update product
router.patch('/:id', upload.array('images', 10), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || req.body || '{}');
    const docRef = db.collection('products').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      const newUrls = [];
      for (const file of req.files) {
        const url = await uploadToStorage(file.buffer, file.originalname, 'products');
        newUrls.push(url);
      }
      data.images = [...(data.images || []), ...newUrls];
    }

    data.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    // Convert numeric strings
    if (data.price) data.price = parseFloat(data.price);
    if (data.salePrice) data.salePrice = parseFloat(data.salePrice);
    if (data.stock) data.stock = parseInt(data.stock);

    await docRef.update(data);
    res.json({ id: req.params.id, ...data });
  } catch (err) {
    console.error('Admin PATCH /products error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/admin/products/:id — soft delete (archive)
router.delete('/:id', async (req, res) => {
  try {
    const docRef = db.collection('products').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await docRef.update({
      status: 'archived',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ message: 'Product archived' });
  } catch (err) {
    console.error('Admin DELETE /products error:', err);
    res.status(500).json({ error: 'Failed to archive product' });
  }
});

module.exports = router;
