const app = require('./app');
const { initDatabase } = require('./config/database');

const PORT = process.env.PORT || 3000;

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Sintonia TV API rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao inicializar banco de dados:', err);
    process.exit(1);
  });
