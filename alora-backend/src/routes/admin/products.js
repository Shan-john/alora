const express = require('express');
const router = express.Router();
const { pool } = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

// GET /api/admin/products
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT p.*, (SELECT json_agg(image_url ORDER BY display_order) FROM product_images WHERE product_id = p.id) as images FROM products p ORDER BY created_at DESC');
    res.json({ products: rows });
  } catch (err) {
    console.error('GET /admin/products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/admin/products
router.post('/', async (req, res) => {
  try {
    const { slug, name, description, price, salePrice, category, stock, isBestSeller, isTrendingIG, status, images } = req.body;
    const id = uuidv4();
    
    await pool.query(
      'INSERT INTO products (id, slug, name, description, price, sale_price, category_slug, stock, is_best_seller, is_trending_ig, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [id, slug, name, description, price, salePrice || null, category, stock || 0, isBestSeller || false, isTrendingIG || false, status || 'active']
    );

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await pool.query('INSERT INTO product_images (product_id, image_url, display_order) VALUES ($1, $2, $3)', [id, images[i], i]);
      }
    }

    res.status(201).json({ id, message: 'Product created successfully' });
  } catch (err) {
    console.error('POST /admin/products error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/admin/products/:id
router.put('/:id', async (req, res) => {
  try {
    const { slug, name, description, price, salePrice, category, stock, isBestSeller, isTrendingIG, status, images } = req.body;
    
    await pool.query(
      'UPDATE products SET slug = $1, name = $2, description = $3, price = $4, sale_price = $5, category_slug = $6, stock = $7, is_best_seller = $8, is_trending_ig = $9, status = $10, updated_at = CURRENT_TIMESTAMP WHERE id = $11',
      [slug, name, description, price, salePrice || null, category, stock || 0, isBestSeller || false, isTrendingIG || false, status || 'active', req.params.id]
    );

    // Replace images completely
    if (images) {
      await pool.query('DELETE FROM product_images WHERE product_id = $1', [req.params.id]);
      for (let i = 0; i < images.length; i++) {
        await pool.query('INSERT INTO product_images (product_id, image_url, display_order) VALUES ($1, $2, $3)', [req.params.id, images[i], i]);
      }
    }

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error('PUT /admin/products error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/admin/products/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('DELETE /admin/products error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
