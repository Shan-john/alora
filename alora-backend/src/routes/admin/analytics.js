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

const pct = (part, total) => (total > 0 ? Math.round((part / total) * 1000) / 10 : 0);

// GET /api/admin/dashboard — Comprehensive Analytics
router.get('/', async (req, res) => {
  try {
    await ensureProductClickTable();

    const days = Math.max(1, Math.min(365, toInt(req.query.days, 30)));
    const limit = Math.max(5, Math.min(50, toInt(req.query.limit, 10)));
    const interval = `${days} days`;

    // ─── 1. Click Summary ───────────────────────────────────────
    const { rows: [clickSummary] } = await pool.query(
      `SELECT
         COUNT(*)::int AS "totalClicks",
         COUNT(DISTINCT product_id)::int AS "uniqueProductsClicked"
       FROM product_clicks
       WHERE clicked_at >= NOW() - $1::interval`,
      [interval]
    );

    // ─── 2. Click Source Breakdown ──────────────────────────────
    const { rows: sourceRows } = await pool.query(
      `SELECT
         source,
         COUNT(*)::int AS count
       FROM product_clicks
       WHERE clicked_at >= NOW() - $1::interval
       GROUP BY source
       ORDER BY count DESC`,
      [interval]
    );

    const totalClicks = Number(clickSummary?.totalClicks || 0);
    const clickSources = sourceRows.map(r => ({
      source: r.source || 'unknown',
      count: r.count,
      percentage: pct(r.count, totalClicks),
    }));

    // ─── 3. Category Click Distribution ─────────────────────────
    const { rows: categoryRows } = await pool.query(
      `SELECT
         COALESCE(p.category_slug, 'uncategorized') AS category,
         COUNT(pc.id)::int AS clicks
       FROM product_clicks pc
       JOIN products p ON p.id = pc.product_id
       WHERE pc.clicked_at >= NOW() - $1::interval
       GROUP BY p.category_slug
       ORDER BY clicks DESC`,
      [interval]
    );

    const categoryDistribution = categoryRows.map(r => ({
      category: r.category,
      clicks: r.clicks,
      percentage: pct(r.clicks, totalClicks),
    }));

    // ─── 4. Product Engagement Rate ─────────────────────────────
    const { rows: [productCounts] } = await pool.query(
      `SELECT
         COUNT(*)::int AS "totalProducts",
         COUNT(*) FILTER (WHERE id IN (
           SELECT DISTINCT product_id FROM product_clicks
           WHERE clicked_at >= NOW() - $1::interval
         ))::int AS "clickedProducts"
       FROM products
       WHERE status = 'active'`,
      [interval]
    );

    const totalProducts = Number(productCounts?.totalProducts || 0);
    const clickedProducts = Number(productCounts?.clickedProducts || 0);
    const deadProducts = totalProducts - clickedProducts;

    const engagement = {
      totalProducts,
      clickedProducts,
      deadProducts,
      engagementRate: pct(clickedProducts, totalProducts),
      deadStockRate: pct(deadProducts, totalProducts),
      avgClicksPerProduct: totalProducts > 0
        ? Math.round((totalClicks / totalProducts) * 10) / 10
        : 0,
    };

    // ─── 5. Customer & Subscriber Growth ────────────────────────
    const { rows: [customerStats] } = await pool.query(
      `SELECT
         (SELECT COUNT(*)::int FROM customers) AS "totalCustomers",
         (SELECT COUNT(*)::int FROM customers WHERE created_at >= NOW() - $1::interval) AS "newCustomers",
         (SELECT COUNT(*)::int FROM subscribers) AS "totalSubscribers",
         (SELECT COUNT(*)::int FROM subscribers WHERE created_at >= NOW() - $1::interval) AS "newSubscribers",
         (SELECT COUNT(*)::int FROM enquiries WHERE created_at >= NOW() - $1::interval) AS "enquiriesInPeriod"`,
      [interval]
    );

    const growth = {
      totalCustomers: Number(customerStats?.totalCustomers || 0),
      newCustomers: Number(customerStats?.newCustomers || 0),
      totalSubscribers: Number(customerStats?.totalSubscribers || 0),
      newSubscribers: Number(customerStats?.newSubscribers || 0),
      enquiriesInPeriod: Number(customerStats?.enquiriesInPeriod || 0),
    };

    // ─── 6. Review Analytics ────────────────────────────────────
    const { rows: [reviewStats] } = await pool.query(
      `SELECT
         COUNT(*)::int AS "totalReviews",
         COUNT(*) FILTER (WHERE is_approved = true)::int AS "approvedReviews",
         COUNT(*) FILTER (WHERE is_approved = false)::int AS "pendingReviews",
         COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS "avgRating"
       FROM reviews`
    );

    const totalReviews = Number(reviewStats?.totalReviews || 0);
    const reviewAnalytics = {
      totalReviews,
      approvedReviews: Number(reviewStats?.approvedReviews || 0),
      pendingReviews: Number(reviewStats?.pendingReviews || 0),
      approvedRate: pct(Number(reviewStats?.approvedReviews || 0), totalReviews),
      pendingRate: pct(Number(reviewStats?.pendingReviews || 0), totalReviews),
      avgRating: Number(reviewStats?.avgRating || 0),
    };

    // ─── 7. Top Clicked Products (with source split) ────────────
    const { rows: topClickedRows } = await pool.query(
      `SELECT
         p.id,
         p.slug,
         p.name,
         p.category_slug AS category,
         p.status,
         COUNT(pc.id)::int AS clicks,
         COUNT(pc.id) FILTER (WHERE pc.source = 'card-click')::int AS "cardClicks",
         COUNT(pc.id) FILTER (WHERE pc.source = 'detail-view')::int AS "detailClicks",
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
       WHERE pc.clicked_at >= NOW() - $1::interval
       GROUP BY p.id, p.slug, p.name, p.category_slug, p.status
       ORDER BY clicks DESC, "lastClickedAt" DESC
       LIMIT $2`,
      [interval, limit]
    );

    const topClickedProducts = topClickedRows.map(r => ({
      ...r,
      clicks: r.clicks,
      percentage: pct(r.clicks, totalClicks),
      cardClickPct: pct(r.cardClicks, r.clicks),
      detailClickPct: pct(r.detailClicks, r.clicks),
    }));

    // ─── 8. Low Clicked Products (active with fewest clicks) ────
    const { rows: lowClickedRows } = await pool.query(
      `SELECT
         p.id,
         p.slug,
         p.name,
         p.category_slug AS category,
         p.status,
         COALESCE(COUNT(pc.id), 0)::int AS clicks,
         COUNT(pc.id) FILTER (WHERE pc.source = 'card-click')::int AS "cardClicks",
         COUNT(pc.id) FILTER (WHERE pc.source = 'detail-view')::int AS "detailClicks",
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
         AND pc.clicked_at >= NOW() - $1::interval
       WHERE p.status = 'active'
       GROUP BY p.id, p.slug, p.name, p.category_slug, p.status
       ORDER BY clicks ASC, p.created_at DESC
       LIMIT $2`,
      [interval, limit]
    );

    const lowClickedProducts = lowClickedRows.map(r => ({
      ...r,
      clicks: r.clicks,
      percentage: pct(r.clicks, totalClicks),
      cardClickPct: pct(r.cardClicks, r.clicks),
      detailClickPct: pct(r.detailClicks, r.clicks),
    }));

    // ─── 9. Card-to-Detail Conversion ───────────────────────────
    const cardTotal = clickSources.find(s => s.source === 'card-click')?.count || 0;
    const detailTotal = clickSources.find(s => s.source === 'detail-view')?.count || 0;
    const cardToDetailRate = pct(detailTotal, cardTotal);

    // ─── Build Response ─────────────────────────────────────────
    const topProduct = topClickedRows[0] || null;
    const lowProduct = lowClickedRows[0] || null;

    res.json({
      periodDays: days,
      kpis: {
        totalClicks,
        uniqueProductsClicked: Number(clickSummary?.uniqueProductsClicked || 0),
        engagementRate: engagement.engagementRate,
        avgClicksPerProduct: engagement.avgClicksPerProduct,
        cardToDetailRate,
        topProductName: topProduct?.name || null,
        topProductClicks: topProduct?.clicks || 0,
        lowProductName: lowProduct?.name || null,
        lowProductClicks: lowProduct?.clicks ?? 0,
      },
      clickSources,
      categoryDistribution,
      engagement,
      growth,
      reviewAnalytics,
      topClickedProducts,
      lowClickedProducts,
    });
  } catch (err) {
    console.error('GET /admin/dashboard error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
