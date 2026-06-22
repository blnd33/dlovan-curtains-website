const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  try {
    const [rows] = await db.query('SELECT * FROM admin_users LIMIT 1');
    if (!rows.length) return res.status(500).json({ error: 'No admin account found' });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(401).json({ error: 'Wrong password' });

    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/change-password
router.post('/change-password', require('../middleware/auth'), async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE admin_users SET password = ? WHERE id = 1', [hashed]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
