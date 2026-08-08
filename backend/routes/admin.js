const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Todas as rotas abaixo exigem autenticação + role admin
router.use(authenticate, requireAdmin);

// ============ DASHBOARD ============
router.get('/dashboard', async (req, res) => {
  try {
    const [usersCount, channelsCount, categoriesCount, watchCount] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM channels WHERE active = true'),
      pool.query('SELECT COUNT(*) FROM categories WHERE active = true'),
      pool.query('SELECT COUNT(*) FROM watch_history WHERE watched_at > NOW() - INTERVAL "24 hours"')
    ]);

    const recentUsers = await pool.query(
      'SELECT id, name, email, role, plan, active, created_at FROM users ORDER BY created_at DESC LIMIT 10'
    );

    res.json({
      stats: {
        totalUsers: parseInt(usersCount.rows[0].count),
        totalChannels: parseInt(channelsCount.rows[0].count),
        totalCategories: parseInt(categoriesCount.rows[0].count),
        watches24h: parseInt(watchCount.rows[0].count)
      },
      recentUsers: recentUsers.rows
    });
  } catch (err) {
    console.error('Erro no dashboard:', err);
    res.status(500).json({ error: 'Erro ao carregar dashboard' });
  }
});

// ============ CANAIS (CRUD) ============
router.get('/channels', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, cat.name as category_name
       FROM channels c
       LEFT JOIN categories cat ON c.category_id = cat.id
       ORDER BY c.created_at DESC`
    );
    res.json({ channels: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar canais' });
  }
});

router.post('/channels', async (req, res) => {
  try {
    const { name, description, stream_url, logo_url, category_id, plan_required, epg_id, sort_order } = req.body;

    const result = await pool.query(
      `INSERT INTO channels (name, description, stream_url, logo_url, category_id, plan_required, epg_id, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, description, stream_url, logo_url, category_id, plan_required || 'free', epg_id, sort_order || 0]
    );

    res.status(201).json({ channel: result.rows[0], message: 'Canal criado com sucesso' });
  } catch (err) {
    console.error('Erro ao criar canal:', err);
    res.status(500).json({ error: 'Erro ao criar canal' });
  }
});

router.put('/channels/:id', async (req, res) => {
  try {
    const { name, description, stream_url, logo_url, category_id, plan_required, epg_id, sort_order, active } = req.body;

    const result = await pool.query(
      `UPDATE channels 
       SET name = $1, description = $2, stream_url = $3, logo_url = $4, 
           category_id = $5, plan_required = $6, epg_id = $7, sort_order = $8, active = $9, updated_at = NOW()
       WHERE id = $10 RETURNING *`,
      [name, description, stream_url, logo_url, category_id, plan_required, epg_id, sort_order, active, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Canal não encontrado' });
    }

    res.json({ channel: result.rows[0], message: 'Canal atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar canal' });
  }
});

router.delete('/channels/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM channels WHERE id = $1', [req.params.id]);
    res.json({ message: 'Canal removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover canal' });
  }
});

// ============ CATEGORIAS (CRUD) ============
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY sort_order, name');
    res.json({ categories: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar categorias' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, icon, color, sort_order } = req.body;
    const result = await pool.query(
      'INSERT INTO categories (name, icon, color, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, icon || 'tv', color || '#6366f1', sort_order || 0]
    );
    res.status(201).json({ category: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const { name, icon, color, sort_order, active } = req.body;
    const result = await pool.query(
      'UPDATE categories SET name = $1, icon = $2, color = $3, sort_order = $4, active = $5 WHERE id = $6 RETURNING *',
      [name, icon, color, sort_order, active, req.params.id]
    );
    res.json({ category: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.json({ message: 'Categoria removida' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover categoria' });
  }
});

// ============ USUÁRIOS (CRUD) ============
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, plan, active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role, plan } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, plan) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, plan, active, created_at',
      [name, email, passwordHash, role || 'user', plan || 'free']
    );

    res.status(201).json({ user: result.rows[0], message: 'Usuário criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role, plan, active } = req.body;
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, role = $3, plan = $4, active = $5, updated_at = NOW() WHERE id = $6 RETURNING id, name, email, role, plan, active',
      [name, email, role, plan, active, req.params.id]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'Usuário removido' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover usuário' });
  }
});

// ============ CONFIGURAÇÕES DO APP ============
router.get('/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM app_settings WHERE id = 1');
    res.json({ settings: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar configurações' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const { app_name, app_logo, primary_color, accent_color, allow_registration, maintenance_mode } = req.body;
    const result = await pool.query(
      `UPDATE app_settings 
       SET app_name = $1, app_logo = $2, primary_color = $3, accent_color = $4, 
           allow_registration = $5, maintenance_mode = $6, updated_at = NOW()
       WHERE id = 1 RETURNING *`,
      [app_name, app_logo, primary_color, accent_color, allow_registration, maintenance_mode]
    );
    res.json({ settings: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar configurações' });
  }
});

module.exports = router;
