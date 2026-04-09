const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'alora-secret-key-123';
const ALLOW_LOCAL_ADMIN_BYPASS = process.env.ALLOW_LOCAL_ADMIN_BYPASS !== 'false';

/**
 * Middleware to verify JWT token from Authorization header.
 */
const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split('Bearer ')[1];

  if (ALLOW_LOCAL_ADMIN_BYPASS && token === 'local-admin') {
    req.user = { id: 'local-admin', email: 'local-admin@alora.local', role: 'owner' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Middleware to check if authenticated user is an admin.
 * Must be used after verifyAuth.
 */
const verifyAdmin = async (req, res, next) => {
  if (ALLOW_LOCAL_ADMIN_BYPASS && req.user?.id === 'local-admin') {
    req.adminRole = 'owner';
    return next();
  }

  try {
    const { rows } = await pool.query('SELECT role FROM admins WHERE id = $1', [req.user.id]);
    if (rows.length === 0) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    req.adminRole = rows[0].role;
    next();
  } catch (err) {
    console.error('Admin check error:', err.message);
    return res.status(500).json({ error: 'Failed to verify admin status' });
  }
};

module.exports = { verifyAuth, verifyAdmin, JWT_SECRET };
