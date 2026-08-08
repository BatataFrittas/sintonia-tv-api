const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sintonia_tv',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const initDatabase = async () => {
  try {
    // Testar conexão
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado ao PostgreSQL');

    // Criar tabelas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'premium')),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50) DEFAULT 'tv',
        color VARCHAR(20) DEFAULT '#6366f1',
        sort_order INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS channels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        description TEXT,
        stream_url TEXT NOT NULL,
        logo_url TEXT,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        plan_required VARCHAR(20) DEFAULT 'free' CHECK (plan_required IN ('free', 'basic', 'premium')),
        active BOOLEAN DEFAULT true,
        epg_id VARCHAR(50),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS watch_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
        watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        duration INTEGER DEFAULT 0
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        app_name VARCHAR(100) DEFAULT 'Sintonia TV',
        app_logo TEXT,
        primary_color VARCHAR(20) DEFAULT '#6366f1',
        accent_color VARCHAR(20) DEFAULT '#8b5cf6',
        allow_registration BOOLEAN DEFAULT true,
        maintenance_mode BOOLEAN DEFAULT false,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inserir configurações padrão
    await pool.query(`
      INSERT INTO app_settings (id) VALUES (1)
      ON CONFLICT (id) DO NOTHING
    `);

    console.log('✅ Tabelas criadas/verificadas');
  } catch (err) {
    console.error('❌ Erro no banco de dados:', err.message);
    throw err;
  }
};

module.exports = { pool, initDatabase };
