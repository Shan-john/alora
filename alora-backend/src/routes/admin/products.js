const express = require('express');
const router = express.Router();
const { pool } = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'y';
  }
  return false;
};

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const toIntOrDefault = (value, defaultValue = 0) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeImages = (images) => {
  if (Array.isArray(images)) {
    return images.map((img) => String(img || '').trim()).filter(Boolean);
  }

  if (typeof images === 'string') {
    return images
      .split(/[|,]/)
      .map((img) => img.trim())
      .filter(Boolean);
  }

  return [];
};

const mapProduct = (row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description || '',
  price: Number(row.price),
  salePrice: row.sale_price !== null ? Number(row.sale_price) : null,
  category: row.category_slug,
  stock: row.stock,
  isBestSeller: row.is_best_seller,
  isTrendingIG: row.is_trending_ig,
  status: row.status,
  rating: Number(row.calculated_rating || 0),
  reviewCount: Number(row.calculated_review_count || 0),
  images: row.images || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const normalizePayload = (payload = {}) => {
  const name = String(payload.name || '').trim();
  const fallbackSlug = slugify(name) || uuidv4();

  return {
    slug: slugify(payload.slug || fallbackSlug),
    name,
    description: payload.description || '',
    price: Number(payload.price || 0),
    salePrice: toNumberOrNull(payload.salePrice),
    category: String(payload.category || '').trim(),
    stock: toIntOrDefault(payload.stock, 0),
    isBestSeller: toBoolean(payload.isBestSeller),
    isTrendingIG: toBoolean(payload.isTrendingIG),
    status: payload.status || 'active',
    images: normalizeImages(payload.images),
  };
};

const upsertImages = async (client, productId, images) => {
  await client.query('DELETE FROM product_images WHERE product_id = $1', [productId]);

  for (let i = 0; i < images.length; i++) {
    await client.query(
      'INSERT INTO product_images (product_id, image_url, display_order) VALUES ($1, $2, $3)',
      [productId, images[i], i]
    );
  }
};

const getProductsQuery = `
  SELECT
    p.*,
    COALESCE(rs.avg_rating, 0) AS calculated_rating,
    COALESCE(rs.review_count, 0) AS calculated_review_count,
    (SELECT json_agg(image_url ORDER BY display_order) FROM product_images WHERE product_id = p.id) as images
  FROM products p
  LEFT JOIN (
    SELECT
      product_id,
      ROUND(AVG(rating)::numeric, 2) AS avg_rating,
      COUNT(*)::int AS review_count
    FROM reviews
    WHERE is_approved = true
    GROUP BY product_id
  ) rs ON rs.product_id = p.id
  ORDER BY p.created_at DESC
`;

// GET /api/admin/products
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(getProductsQuery);
    res.json({ products: rows.map(mapProduct) });
  } catch (err) {
    console.error('GET /admin/products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/admin/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        p.*,
        COALESCE(rs.avg_rating, 0) AS calculated_rating,
        COALESCE(rs.review_count, 0) AS calculated_review_count,
        (SELECT json_agg(image_url ORDER BY display_order) FROM product_images WHERE product_id = p.id) as images
      FROM products p
      LEFT JOIN (
        SELECT
          product_id,
          ROUND(AVG(rating)::numeric, 2) AS avg_rating,
          COUNT(*)::int AS review_count
        FROM reviews
        WHERE is_approved = true
        GROUP BY product_id
      ) rs ON rs.product_id = p.id
      WHERE p.id = $1 OR p.slug = $1
      LIMIT 1
      `,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: mapProduct(rows[0]) });
  } catch (err) {
    console.error('GET /admin/products/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/admin/products
router.post('/', async (req, res) => {
  const payload = normalizePayload(req.body);

  if (!payload.name || !payload.slug || !payload.category || payload.price <= 0) {
    return res.status(400).json({ error: 'Missing required fields: name, slug, category, price' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const id = uuidv4();
    await client.query(
      'INSERT INTO products (id, slug, name, description, price, sale_price, category_slug, stock, is_best_seller, is_trending_ig, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [
        id,
        payload.slug,
        payload.name,
        payload.description,
        payload.price,
        payload.salePrice,
        payload.category,
        payload.stock,
        payload.isBestSeller,
        payload.isTrendingIG,
        payload.status,
      ]
    );

    await upsertImages(client, id, payload.images);
    await client.query('COMMIT');

    res.status(201).json({ id, message: 'Product created successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /admin/products error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  } finally {
    client.release();
  }
});

const updateProduct = async (req, res) => {
  const payload = normalizePayload(req.body);

  if (!payload.name || !payload.slug || !payload.category || payload.price <= 0) {
    return res.status(400).json({ error: 'Missing required fields: name, slug, category, price' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rowCount } = await client.query(
      'UPDATE products SET slug = $1, name = $2, description = $3, price = $4, sale_price = $5, category_slug = $6, stock = $7, is_best_seller = $8, is_trending_ig = $9, status = $10, updated_at = CURRENT_TIMESTAMP WHERE id = $11',
      [
        payload.slug,
        payload.name,
        payload.description,
        payload.price,
        payload.salePrice,
        payload.category,
        payload.stock,
        payload.isBestSeller,
        payload.isTrendingIG,
        payload.status,
        req.params.id,
      ]
    );

    if (!rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Product not found' });
    }

    await upsertImages(client, req.params.id, payload.images);
    await client.query('COMMIT');

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('UPDATE /admin/products error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  } finally {
    client.release();
  }
};

// PUT /api/admin/products/:id
router.put('/:id', updateProduct);

// PATCH /api/admin/products/:id
router.patch('/:id', updateProduct);

// POST /api/admin/products/import
router.post('/import', async (req, res) => {
  const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];

  if (!rows.length) {
    return res.status(400).json({ error: 'No rows provided for import' });
  }

  const client = await pool.connect();
  const summary = {
    total: rows.length,
    created: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  try {
    await client.query('BEGIN');

    for (let index = 0; index < rows.length; index++) {
      try {
        const payload = normalizePayload(rows[index]);
        if (!payload.name || !payload.slug || !payload.category || payload.price <= 0) {
          throw new Error('Required fields missing (name, slug, category, price)');
        }

        const existing = await client.query('SELECT id FROM products WHERE slug = $1 LIMIT 1', [payload.slug]);

        if (existing.rowCount > 0) {
          const existingId = existing.rows[0].id;
          await client.query(
            'UPDATE products SET name = $1, description = $2, price = $3, sale_price = $4, category_slug = $5, stock = $6, is_best_seller = $7, is_trending_ig = $8, status = $9, updated_at = CURRENT_TIMESTAMP WHERE id = $10',
            [
              payload.name,
              payload.description,
              payload.price,
              payload.salePrice,
              payload.category,
              payload.stock,
              payload.isBestSeller,
              payload.isTrendingIG,
              payload.status,
              existingId,
            ]
          );
          await upsertImages(client, existingId, payload.images);
          summary.updated += 1;
        } else {
          const id = uuidv4();
          await client.query(
            'INSERT INTO products (id, slug, name, description, price, sale_price, category_slug, stock, is_best_seller, is_trending_ig, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
            [
              id,
              payload.slug,
              payload.name,
              payload.description,
              payload.price,
              payload.salePrice,
              payload.category,
              payload.stock,
              payload.isBestSeller,
              payload.isTrendingIG,
              payload.status,
            ]
          );
          await upsertImages(client, id, payload.images);
          summary.created += 1;
        }
      } catch (rowError) {
        summary.failed += 1;
        summary.errors.push({
          row: index + 1,
          slug: rows[index]?.slug || '',
          name: rows[index]?.name || '',
          message: rowError.message,
        });
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Import completed', summary });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /admin/products/import error:', err);
    res.status(500).json({ error: 'Failed to import products' });
  } finally {
    client.release();
  }
});

// DELETE /api/admin/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    if (!rowCount) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('DELETE /admin/products error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
