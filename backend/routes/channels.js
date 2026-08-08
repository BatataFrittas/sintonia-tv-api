const express = require('express');
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Listar canais (usuário logado vê apenas canais do seu plano)
router.get('/', authenticate, async (req, res) => {
  try {
    const { category_id, search } = req.query;
    const userPlan = req.user.plan;

    let query = `
      SELECT c.*, cat.name as category_name, cat.icon as category_icon
      FROM channels c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.active = true
    `;
    const params = [];
    let paramIndex = 1;

    // Filtrar por plano do usuário
    const planHierarchy = { free: 1, basic: 2, premium: 3 };
    const userPlanLevel = planHierarchy[userPlan] || 1;

    query += ` AND (
      (c.plan_required = 'free') OR
      (c.plan_required = 'basic' AND $${paramIndex} >= 2) OR
      (c.plan_required = 'premium' AND $${paramIndex} >= 3)
    )`;
    params.push(userPlanLevel);
    paramIndex++;

    if (category_id) {
      query += ` AND c.category_id = $${paramIndex}`;
      params.push(category_id);
      paramIndex++;
    }

    if (search) {
      query += ` AND (c.name ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY cat.sort_order, c.sort_order, c.name`;

    const result = await pool.query(query, params);
    res.json({ channels: result.rows });
  } catch (err) {
    console.error('Erro ao listar canais:', err);
    res.status(500).json({ error: 'Erro ao buscar canais' });
  }
});

// Detalhes de um canal
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, cat.name as category_name 
       FROM channels c 
       LEFT JOIN categories cat ON c.category_id = cat.id 
       WHERE c.id = $1 AND c.active = true`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Canal não encontrado' });
    }

    res.json({ channel: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar canal' });
  }
});

// Registrar visualização
router.post('/:id/watch', authenticate, async (req, res) => {
  try {
    await pool.query(
      'INSERT INTO watch_history (user_id, channel_id) VALUES ($1, $2)',
      [req.user.id, req.params.id]
    );
    res.json({ message: 'Visualização registrada' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar visualização' });
  }
});

module.exports = router;
