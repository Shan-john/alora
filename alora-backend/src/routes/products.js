const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET /api/products — list active products with filters
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, limit = 20, search, isBestSeller, isTrendingIG, offset = 0 } = req.query;

    let query = 'SELECT p.*, (SELECT json_agg(image_url ORDER BY display_order) FROM product_images WHERE product_id = p.id) as images FROM products p WHERE p.status = $1';
    const params = ['active'];
    let paramIndex = 2;

    if (category) {
      query += ` AND p.category_slug = $${paramIndex++}`;
      params.push(category);
    }
    if (isBestSeller === 'true') {
      query += ` AND p.is_best_seller = true`;
    }
    if (isTrendingIG === 'true') {
      query += ` AND p.is_trending_ig = true`;
    }
    if (minPrice) {
      query += ` AND COALESCE(p.sale_price, p.price) >= $${paramIndex++}`;
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ` AND COALESCE(p.sale_price, p.price) <= $${paramIndex++}`;
      params.push(maxPrice);
    }
    if (search) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex++})`;
      params.push(`%${search}%`);
    }

    // Default sort
    let sortClause = 'ORDER BY p.created_at DESC';
    if (sort === 'price_asc') sortClause = 'ORDER BY COALESCE(p.sale_price, p.price) ASC';
    else if (sort === 'price_desc') sortClause = 'ORDER BY COALESCE(p.sale_price, p.price) DESC';
    else if (sort === 'name_asc') sortClause = 'ORDER BY p.name ASC';
    
    query += ` ${sortClause}`;

    // Pagination
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit);
    params.push(offset);

    const { rows: products } = await pool.query(query, params);

    res.json({ products: products.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        salePrice: p.sale_price ? Number(p.sale_price) : null,
        category: p.category_slug,
        stock: p.stock,
        isBestSeller: p.is_best_seller,
        isTrendingIG: p.is_trending_ig,
        status: p.status,
        rating: Number(p.rating),
        reviewCount: p.review_count,
        images: p.images || []
    })), count: products.length });
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id — single product
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT p.*, (SELECT json_agg(image_url ORDER BY display_order) FROM product_images WHERE product_id = p.id) as images FROM products p WHERE p.id = $1 OR p.slug = $1 AND p.status = $2',
      [req.params.id, 'active']
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const p = rows[0];
    res.json({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        salePrice: p.sale_price ? Number(p.sale_price) : null,
        category: p.category_slug,
        stock: p.stock,
        isBestSeller: p.is_best_seller,
        isTrendingIG: p.is_trending_ig,
        status: p.status,
        rating: Number(p.rating),
        reviewCount: p.review_count,
        images: p.images || []
    });
  } catch (err) {
    console.error('GET /products/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
