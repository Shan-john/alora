const { auth, db } = require('../config/firebase');

/**
 * Middleware to verify Firebase ID token from Authorization header.
 * Optionally checks if the user is an admin.
 */
const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await auth.verifyIdToken(idToken);
    req.user = decoded;
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
  try {
    const adminDoc = await db.collection('admins').doc(req.user.uid).get();
    if (!adminDoc.exists) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    req.adminRole = adminDoc.data().role;
    next();
  } catch (err) {
    console.error('Admin check error:', err.message);
    return res.status(500).json({ error: 'Failed to verify admin status' });
  }
};

module.exports = { verifyAuth, verifyAdmin };
