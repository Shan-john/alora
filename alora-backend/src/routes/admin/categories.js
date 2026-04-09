const express = require('express');
const router = express.Router();
const { pool } = require('../../config/database');

// GET /api/admin/categories
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT slug, name, image_url as image, display_order as order, is_visible FROM categories ORDER BY display_order ASC');
    res.json({ categories: rows.map(r => ({ ...r, isVisible: r.is_visible })) });
  } catch (err) {
    console.error('GET /admin/categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/admin/categories
router.post('/', async (req, res) => {
  try {
    const { slug, name, image, order, isVisible } = req.body;
    await pool.query(
      'INSERT INTO categories (slug, name, image_url, display_order, is_visible) VALUES ($1, $2, $3, $4, $5)',
      [slug, name, image || '', order || 0, isVisible ?? true]
    );
    res.status(201).json({ message: 'Category added' });
  } catch (err) {
    console.error('POST /admin/categories error:', err);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// PUT /api/admin/categories/:slug
router.put('/:slug', async (req, res) => {
  try {
    const { name, image, order, isVisible } = req.body;
    await pool.query(
      'UPDATE categories SET name = $1, image_url = $2, display_order = $3, is_visible = $4 WHERE slug = $5',
      [name, image || '', order || 0, isVisible ?? true, req.params.slug]
    );
    res.json({ message: 'Category updated' });
  } catch (err) {
    console.error('PUT /admin/categories error:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/admin/categories/:slug
router.delete('/:slug', async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE slug = $1', [req.params.slug]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error('DELETE /admin/categories error:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
