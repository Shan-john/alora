const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadToStorage } = require('../../services/storage');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// POST /api/admin/upload — upload an image to local public directory
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const { folder } = req.body; // e.g. "products", "categories", "home"
    const publicUrl = await uploadToStorage(req.file.buffer, req.file.originalname, folder || 'misc');

    // Make local URL absolute relative to the request to avoid frontend bugs when missing process.env
    // Or just return the local relative path since the frontend knows its backend URL
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const finalUrl = `${backendUrl}${publicUrl}`; // e.g. http://localhost:5000/uploads/products/123.jpg

    res.status(201).json({ url: finalUrl, message: 'Image uploaded successfully' });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
