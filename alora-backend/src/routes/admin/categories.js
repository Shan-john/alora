const express = require('express');
const router = express.Router();
const { db, admin } = require('../../config/firebase');

// GET /api/admin/categories
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('categories').orderBy('order', 'asc').get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ categories });
  } catch (err) {
    console.error('Admin GET /categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/admin/categories
router.post('/', async (req, res) => {
  try {
    const { name, slug, image, order, isVisible } = req.body;
    const catData = {
      name: name || '',
      slug: slug || name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
      image: image || '',
      order: parseInt(order) || 0,
      isVisible: isVisible !== false,
    };
    const docRef = await db.collection('categories').add(catData);
    res.status(201).json({ id: docRef.id, ...catData });
  } catch (err) {
    console.error('Admin POST /categories error:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PATCH /api/admin/categories/:id
router.patch('/:id', async (req, res) => {
  try {
    const docRef = db.collection('categories').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Category not found' });
    await docRef.update(req.body);
    res.json({ message: 'Category updated' });
  } catch (err) {
    console.error('Admin PATCH /categories error:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/admin/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('categories').doc(req.params.id).delete();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error('Admin DELETE /categories error:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
