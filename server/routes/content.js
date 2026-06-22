const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/content — public, returns all content as { key: value }
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT content_key, content_value FROM content');
    const result = {};
    rows.forEach(r => { result[r.content_key] = r.content_value; });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/content — protected, saves all content
router.put('/', auth, async (req, res) => {
  const entries = req.body; // { key: value, ... }
  if (!entries || typeof entries !== 'object')
    return res.status(400).json({ error: 'Invalid data' });

  try {
    const pairs = Object.entries(entries);
    for (const [key, value] of pairs) {
      await db.query(
        'INSERT INTO content (content_key, content_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE content_value = ?',
        [key, value, value]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
