const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadToStorage } = require('../../services/storage');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// POST /api/admin/upload — upload single image to Firebase Storage
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const folder = req.body.folder || 'uploads';
    const url = await uploadToStorage(req.file.buffer, req.file.originalname, folder);

    res.json({ url });
  } catch (err) {
    console.error('Admin POST /upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
