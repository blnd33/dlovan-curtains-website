const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${req.body.imageKey || 'img'}-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// POST /api/upload — protected, upload one image
router.post('/', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const imageKey = req.body.imageKey;
  const filePath = `/uploads/${req.file.filename}`;

  try {
    await db.query(
      'INSERT INTO images (image_key, file_path) VALUES (?, ?) ON DUPLICATE KEY UPDATE file_path = ?',
      [imageKey, filePath, filePath]
    );
    res.json({ success: true, url: filePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/upload — public, returns all image URLs as { key: url }
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT image_key, file_path FROM images');
    const result = {};
    rows.forEach(r => { result[r.image_key] = r.file_path; });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
