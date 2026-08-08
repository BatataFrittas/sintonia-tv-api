const express = require('express');
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Listar categorias ativas
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, COUNT(ch.id) as channel_count
       FROM categories c
       LEFT JOIN channels ch ON ch.category_id = c.id AND ch.active = true
       WHERE c.active = true
       GROUP BY c.id
       ORDER BY c.sort_order, c.name`
    );
    res.json({ categories: result.rows });
  } catch (err) {
    console.error('Erro ao listar categorias:', err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

module.exports = router;
