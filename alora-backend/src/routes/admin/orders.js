const express = require('express');
const router = express.Router();
const { db, admin } = require('../../config/firebase');
const { sendOrderStatusEmail } = require('../../services/email');

// GET /api/admin/orders — list orders with filters
router.get('/', async (req, res) => {
  try {
    const { status, search, startDate, endDate } = req.query;
    let query = db.collection('orders').orderBy('createdAt', 'desc');

    if (status && status !== 'all') {
      query = db.collection('orders').where('status', '==', status).orderBy('createdAt', 'desc');
    }

    const snapshot = await query.get();
    let orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (search) {
      const s = search.toLowerCase();
      orders = orders.filter(o =>
        o.id.toLowerCase().includes(s) ||
        o.customer?.name?.toLowerCase().includes(s) ||
        o.customer?.email?.toLowerCase().includes(s)
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      orders = orders.filter(o => o.createdAt?.toDate?.() >= start || new Date(o.createdAt) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      orders = orders.filter(o => o.createdAt?.toDate?.() <= end || new Date(o.createdAt) <= end);
    }

    res.json({ orders });
  } catch (err) {
    console.error('Admin GET /orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/admin/orders/:id — single order detail
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('orders').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('Admin GET /orders/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PATCH /api/admin/orders/:id/status — update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, tracking, notes } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const docRef = db.collection('orders').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updateData = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (tracking !== undefined) updateData.tracking = tracking;
    if (notes !== undefined) updateData.notes = notes;

    await docRef.update(updateData);

    // Send status email
    const orderData = doc.data();
    sendOrderStatusEmail({ ...orderData, orderId: req.params.id }, status).catch(() => {});

    res.json({ message: 'Order status updated', status });
  } catch (err) {
    console.error('Admin PATCH /orders/:id/status error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// POST /api/admin/orders/manual — create manual order
router.post('/manual', async (req, res) => {
  try {
    const { items, customer, total, orderMethod, notes } = req.body;

    const orderData = {
      items: items || [],
      customer: customer || { name: '', email: '', phone: '' },
      total: parseFloat(total) || 0,
      status: 'confirmed',
      orderMethod: orderMethod || 'instagram',
      igMessageText: '',
      tracking: null,
      notes: notes || 'Manually created by admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('orders').add(orderData);
    res.status(201).json({ id: docRef.id, ...orderData });
  } catch (err) {
    console.error('Admin POST /orders/manual error:', err);
    res.status(500).json({ error: 'Failed to create manual order' });
  }
});

// GET /api/admin/orders/export — export orders as CSV
router.get('/export', async (req, res) => {
  try {
    const { status } = req.query;
    let query = db.collection('orders').orderBy('createdAt', 'desc');
    if (status && status !== 'all') {
      query = db.collection('orders').where('status', '==', status).orderBy('createdAt', 'desc');
    }

    const snapshot = await query.get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const csvHeader = 'Order ID,Customer Name,Email,Phone,Items,Total,Status,Channel,Date\n';
    const csvRows = orders.map(o => {
      const items = (o.items || []).map(i => `${i.name}×${i.quantity}`).join('; ');
      const date = o.createdAt?.toDate?.()?.toISOString() || '';
      return `"${o.id}","${o.customer?.name}","${o.customer?.email}","${o.customer?.phone}","${items}",${o.total},"${o.status}","${o.orderMethod}","${date}"`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=alora-orders.csv');
    res.send(csvHeader + csvRows);
  } catch (err) {
    console.error('Admin GET /orders/export error:', err);
    res.status(500).json({ error: 'Failed to export orders' });
  }
});

module.exports = router;
