const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const channelRoutes = require('./routes/channels');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Segurança
app.use(helmet());
app.use(cors({
  origin: '*', // Em produção, restrinja para seus domínios
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Muitas requisições, tente novamente mais tarde.' }
});
app.use(limiter);

app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Inicializar banco e iniciar servidor
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Sintonia TV API rodando na porta ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  });
}).catch(err => {
  console.error('Erro ao inicializar banco de dados:', err);
  process.exit(1);
});
