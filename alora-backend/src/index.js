require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & parsing
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Auth middleware
const { verifyAuth, verifyAdmin } = require('./middleware/auth');

// Public routes
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/enquiries', require('./routes/enquiries'));

// Admin routes (protected)
app.use('/api/admin/dashboard', verifyAuth, verifyAdmin, require('./routes/admin/analytics'));
app.use('/api/admin/products', verifyAuth, verifyAdmin, require('./routes/admin/products'));
app.use('/api/admin/orders', verifyAuth, verifyAdmin, require('./routes/admin/orders'));
app.use('/api/admin/customers', verifyAuth, verifyAdmin, require('./routes/admin/customers'));
app.use('/api/admin/reviews', verifyAuth, verifyAdmin, require('./routes/admin/reviews'));
app.use('/api/admin/settings', verifyAuth, verifyAdmin, require('./routes/admin/settings'));
app.use('/api/admin/categories', verifyAuth, verifyAdmin, require('./routes/admin/categories'));
app.use('/api/admin/upload', verifyAuth, verifyAdmin, require('./routes/admin/upload'));

// Admin users management
const { db, admin: firebaseAdmin } = require('./config/firebase');

app.get('/api/admin/admins', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('admins').get();
    const admins = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    res.json({ admins });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

app.post('/api/admin/admins', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    if (req.adminRole !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmins can add admins' });
    }
    const { uid, email, role } = req.body;
    await db.collection('admins').doc(uid).set({ email, role });
    res.status(201).json({ message: 'Admin added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add admin' });
  }
});

app.delete('/api/admin/admins/:uid', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    if (req.adminRole !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmins can remove admins' });
    }
    await db.collection('admins').doc(req.params.uid).delete();
    res.json({ message: 'Admin removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove admin' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Alora by Trio API' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║     🏆 Alora by Trio — Backend API      ║
  ║     Running on port ${PORT}                ║
  ╚══════════════════════════════════════════╝
  `);
});

module.exports = app;
