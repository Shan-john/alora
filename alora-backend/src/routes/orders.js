const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { body, validationResult } = require('express-validator');
const { sendOrderConfirmationEmail } = require('../services/email');
const { v4: uuidv4 } = require('uuid');

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

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    
    const { items, customer, total, orderMethod, igMessageText } = req.body;
    const orderId = uuidv4();

    // 1. Find or create customer
    let customerId;
    const { rows: existingCustomers } = await client.query('SELECT id FROM customers WHERE email = $1', [customer.email]);
    
    if (existingCustomers.length > 0) {
      customerId = existingCustomers[0].id;
    } else {
      const { rows: newCustomer } = await client.query(
        'INSERT INTO customers (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id',
        [customer.name, customer.email, customer.phone || '', ''] // Empty password hash for guest
      );
      customerId = newCustomer[0].id;
    }

    // 2. Create Order
    await client.query(
      'INSERT INTO orders (id, customer_id, customer_name, customer_email, customer_phone, total, status, order_method, ig_message_text, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [orderId, customerId, customer.name, customer.email, customer.phone || '', total, 'pending', orderMethod, igMessageText || '', '']
    );

    // 3. Create Order Items
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, product_name, variant_details, price, quantity) VALUES ($1, $2, $3, $4, $5, $6)',
        [orderId, item.id, item.name, item.variant || null, item.price, item.quantity]
      );
    }

    await client.query('COMMIT');

    // Send confirmation email (non-blocking)
    const orderData = { items, customer: { name: customer.name, email: customer.email }, total, orderId };
    sendOrderConfirmationEmail(orderData).catch(() => {});

    res.status(201).json({ orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /orders/preview error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

// GET /api/orders/track/:orderId — public order tracking
router.get('/track/:orderId', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT status, tracking_number as tracking, order_method, created_at, updated_at FROM orders WHERE id = $1', [req.params.orderId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const data = rows[0];
    res.json({
      orderId: req.params.orderId,
      status: data.status,
      tracking: data.tracking,
      orderMethod: data.order_method,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (err) {
    console.error('GET /orders/track error:', err);
    res.status(500).json({ error: 'Failed to track order' });
  }
});

module.exports = router;
