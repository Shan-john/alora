const express = require('express');
const router = express.Router();
const { db } = require('../../config/firebase');

// GET /api/admin/dashboard — dashboard analytics
router.get('/', async (req, res) => {
  try {
    // Get all orders
    const ordersSnapshot = await db.collection('orders').get();
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Calculate KPIs
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ordersToday = orders.filter(o => {
      const created = o.createdAt?.toDate?.() || new Date(o.createdAt);
      return created >= today;
    }).length;

    const confirmedStatuses = ['confirmed', 'processing', 'packed', 'shipped', 'delivered'];
    const revenue = orders
      .filter(o => confirmedStatuses.includes(o.status))
      .reduce((sum, o) => sum + (o.total || 0), 0);

    // Low stock products
    const settingsDoc = await db.collection('settings').doc('store').get();
    const threshold = settingsDoc.exists ? (settingsDoc.data().lowStockThreshold || 5) : 5;
    const productsSnapshot = await db.collection('products')
      .where('status', '==', 'active')
      .get();
    const lowStockProducts = productsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(p => p.stock <= threshold);

    // Pending reviews count
    const pendingReviewsSnapshot = await db.collection('reviews')
      .where('isApproved', '==', false)
      .get();

    // Recent orders
    const recentOrders = orders
      .sort((a, b) => {
        const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
        const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
        return bTime - aTime;
      })
      .slice(0, 10);

    res.json({
      kpis: {
        totalOrders,
        pendingOrders,
        ordersToday,
        revenue: Math.round(revenue * 100) / 100,
      },
      lowStockProducts,
      pendingReviewsCount: pendingReviewsSnapshot.size,
      recentOrders,
    });
  } catch (err) {
    console.error('Admin GET /dashboard error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
