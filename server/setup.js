// Run once to create database, tables, and default admin account
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setup() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  console.log('Connected to MySQL...');

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  await conn.query(`USE \`${process.env.DB_NAME}\``);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      content_key VARCHAR(150) UNIQUE NOT NULL,
      content_value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      image_key VARCHAR(150) UNIQUE NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Create default admin if not exists
  const [rows] = await conn.query('SELECT id FROM admin_users LIMIT 1');
  if (!rows.length) {
    const hashed = await bcrypt.hash('dlovan2025', 10);
    await conn.query('INSERT INTO admin_users (password) VALUES (?)', [hashed]);
    console.log('✓ Admin account created (password: dlovan2025)');
  } else {
    console.log('✓ Admin account already exists');
  }

  console.log('✓ Database and tables ready');
  await conn.end();
}

setup().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
