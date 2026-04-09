const express = require('express');
const router = express.Router();
const { pool } = require('../../config/database');

const ensureProductClickTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_clicks (
      id SERIAL PRIMARY KEY,
      product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
      source VARCHAR(50) DEFAULT 'unknown',
      clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

// GET /api/admin/dashboard — Product Click Analytics
router.get('/', async (req, res) => {
  try {
    await ensureProductClickTable();

    const days = Math.max(1, Math.min(365, toInt(req.query.days, 30)));
    const limit = Math.max(5, Math.min(50, toInt(req.query.limit, 10)));

    const { rows: summaryRows } = await pool.query(
      `
      SELECT
        COUNT(*)::int AS "totalClicks",
        COUNT(DISTINCT product_id)::int AS "uniqueProductsClicked"
      FROM product_clicks
      WHERE clicked_at >= NOW() - ($1::text || ' days')::interval
      `,
      [days]
    );

    const { rows: topClickedRows } = await pool.query(
      `
      SELECT
        p.id,
        p.slug,
        p.name,
        p.category_slug AS category,
        p.status,
        COUNT(pc.id)::int AS clicks,
        MAX(pc.clicked_at) AS "lastClickedAt",
        (
          SELECT image_url
          FROM product_images
          WHERE product_id = p.id
          ORDER BY display_order
          LIMIT 1
        ) AS image
      FROM products p
      JOIN product_clicks pc ON pc.product_id = p.id
      WHERE pc.clicked_at >= NOW() - ($1::text || ' days')::interval
      GROUP BY p.id, p.slug, p.name, p.category_slug, p.status
      ORDER BY clicks DESC, "lastClickedAt" DESC
      LIMIT $2
      `,
      [days, limit]
    );

    const { rows: lowClickedRows } = await pool.query(
      `
      SELECT
        p.id,
        p.slug,
        p.name,
        p.category_slug AS category,
        p.status,
        COALESCE(COUNT(pc.id), 0)::int AS clicks,
        MAX(pc.clicked_at) AS "lastClickedAt",
        (
          SELECT image_url
          FROM product_images
          WHERE product_id = p.id
          ORDER BY display_order
          LIMIT 1
        ) AS image
      FROM products p
      LEFT JOIN product_clicks pc
        ON pc.product_id = p.id
        AND pc.clicked_at >= NOW() - ($1::text || ' days')::interval
      WHERE p.status = 'active'
      GROUP BY p.id, p.slug, p.name, p.category_slug, p.status
      ORDER BY clicks ASC, p.created_at DESC
      LIMIT $2
      `,
      [days, limit]
    );

    const summary = summaryRows[0] || { totalClicks: 0, uniqueProductsClicked: 0 };
    const topProduct = topClickedRows[0] || null;
    const lowProduct = lowClickedRows[0] || null;

    res.json({
      periodDays: days,
      kpis: {
        totalClicks: Number(summary.totalClicks || 0),
        uniqueProductsClicked: Number(summary.uniqueProductsClicked || 0),
        topProductName: topProduct?.name || null,
        topProductClicks: topProduct?.clicks || 0,
        lowProductName: lowProduct?.name || null,
        lowProductClicks: lowProduct?.clicks ?? 0,
      },
      topClickedProducts: topClickedRows,
      lowClickedProducts: lowClickedRows,
    });
  } catch (err) {
    console.error('GET /admin/dashboard error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
