const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');
const { body, validationResult } = require('express-validator');
const { sendOrderConfirmationEmail } = require('../services/email');

// POST /api/orders/preview — create pending order
router.post('/preview', [
  body('items').isArray({ min: 1 }).withMessage('At least one item required'),
  body('customer.name').trim().notEmpty().withMessage('Name is required'),
  body('customer.email').isEmail().withMessage('Valid email is required'),
  body('total').isNumeric().withMessage('Total must be a number'),
  body('orderMethod').isIn(['instagram', 'whatsapp']).withMessage('Invalid order method'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { items, customer, total, orderMethod, igMessageText } = req.body;

    const orderData = {
      items,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
      },
      total: parseFloat(total),
      status: 'pending',
      orderMethod,
      igMessageText: igMessageText || '',
      tracking: null,
      notes: '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('orders').add(orderData);

    // Try to send confirmation email (non-blocking)
    sendOrderConfirmationEmail({ ...orderData, orderId: docRef.id }).catch(() => {});

    // Update/create customer record
    try {
      const customerQuery = await db.collection('customers')
        .where('email', '==', customer.email).limit(1).get();

      if (customerQuery.empty) {
        await db.collection('customers').add({
          name: customer.name,
          email: customer.email,
          phone: customer.phone || '',
          orderIds: [docRef.id],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        const customerDoc = customerQuery.docs[0];
        await customerDoc.ref.update({
          orderIds: admin.firestore.FieldValue.arrayUnion(docRef.id),
        });
      }
    } catch (custErr) {
      console.error('Customer update error:', custErr.message);
    }

    res.status(201).json({ orderId: docRef.id });
  } catch (err) {
    console.error('POST /orders/preview error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders/track/:orderId — public order tracking
router.get('/track/:orderId', async (req, res) => {
  try {
    const doc = await db.collection('orders').doc(req.params.orderId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const data = doc.data();
    res.json({
      orderId: doc.id,
      status: data.status,
      tracking: data.tracking,
      orderMethod: data.orderMethod,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  } catch (err) {
    console.error('GET /orders/track error:', err);
    res.status(500).json({ error: 'Failed to track order' });
  }
});

module.exports = router;
