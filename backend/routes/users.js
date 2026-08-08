const express = require('express');
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Histórico do usuário
router.get('/history', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT wh.*, c.name as channel_name, c.logo_url
       FROM watch_history wh
       JOIN channels c ON wh.channel_id = c.id
       WHERE wh.user_id = $1
       ORDER BY wh.watched_at DESC
       LIMIT 50`,
      [req.user.id]
    );
    res.json({ history: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

module.exports = router;
