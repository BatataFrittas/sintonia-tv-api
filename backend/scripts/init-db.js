const bcrypt = require('bcryptjs');
const { pool, initDatabase } = require('../config/database');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    await initDatabase();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sintonia.tv';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';

    // Verificar se admin já existe
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);

    if (existing.rows.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);

      await pool.query(
        `INSERT INTO users (name, email, password_hash, role, plan, active) 
         VALUES ($1, $2, $3, 'admin', 'premium', true)`,
        ['Administrador', adminEmail, passwordHash]
      );

      console.log('✅ Usuário administrador criado:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Senha: ${adminPassword}`);
      console.log('   Role: admin');
    } else {
      console.log('ℹ️ Usuário administrador já existe');
    }

    // Inserir categorias de exemplo
    const categories = [
      { name: 'Abertos', icon: 'tv', color: '#22c55e', sort: 1 },
      { name: 'Esportes', icon: 'trophy', color: '#f97316', sort: 2 },
      { name: 'Filmes', icon: 'film', color: '#8b5cf6', sort: 3 },
      { name: 'Notícias', icon: 'newspaper', color: '#3b82f6', sort: 4 },
      { name: 'Infantil', icon: 'baby', color: '#ec4899', sort: 5 },
      { name: 'Música', icon: 'music', color: '#06b6d4', sort: 6 }
    ];

    for (const cat of categories) {
      await pool.query(
        `INSERT INTO categories (name, icon, color, sort_order) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [cat.name, cat.icon, cat.color, cat.sort]
      );
    }
    console.log('✅ Categorias de exemplo criadas');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err);
    process.exit(1);
  }
};

createAdminUser();
