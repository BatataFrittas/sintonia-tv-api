# 📺 Sintonia TV Pro

**App de Streaming completo para Celular e TV Box (Android TV)**

Sistema completo com:
- ✅ App mobile/TV Box (React Native + Expo)
- ✅ API REST (Node.js + Express + PostgreSQL)
- ✅ Painel Administrativo web (React)
- ✅ Autenticação JWT
- ✅ Controle de planos (Free, Basic, Premium)
- ✅ Suporte a TV Box (navegação por controle remoto D-pad)

---

## 📁 Estrutura do Projeto

```
sintonia-tv-pro/
├── backend/          # API Node.js
├── mobile/           # App React Native (Celular + TV Box)
└── admin-panel/      # Painel administrativo web
```

---

## 🚀 Como Executar

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edite .env com suas configurações do PostgreSQL

npm install
npm run db:init   # Cria tabelas e usuário admin
npm run dev       # Inicia em http://localhost:3000
```

**Admin padrão:**
- Email: `admin@sintonia.tv`
- Senha: `Admin@1234`

### 2. App Mobile / TV Box

```bash
cd mobile
npm install

# Para testar no celular:
npx expo start
# Leia o QR Code com Expo Go

# Para TV Box (landscape):
npx expo start --android
```

**IMPORTANTE:** Altere a URL da API em `src/services/api.js`

### 3. Painel Administrativo

```bash
cd admin-panel
npm install
npm run dev
# Acesse http://localhost:5173
# Login com as credenciais do admin
```

---

## 📱 Funcionalidades do App

| Recurso | Descrição |
|---------|-----------|
| 🔐 Login/Cadastro | JWT com planos Free/Basic/Premium |
| 📺 Player HLS | Suporte a streams M3U8 com Expo AV |
| 🎮 TV Box | Navegação por controle remoto (D-pad) |
| 🔍 Busca | Buscar canais por nome |
| 📂 Categorias | Filtrar canais por categoria |
| ❤️ Favoritos | Marcar canais favoritos |
| 👤 Perfil | Ver dados e plano atual |

---

## 🖥️ Funcionalidades do Painel Admin

| Recurso | Descrição |
|---------|-----------|
| 📊 Dashboard | Estatísticas de usuários, canais, visualizações |
| 📺 Gerenciar Canais | CRUD completo (nome, URL, logo, categoria, plano) |
| 📂 Gerenciar Categorias | Criar/editar categorias com cores e ícones |
| 👥 Gerenciar Usuários | Ativar/bloquear, mudar plano, definir admin |
| ⚙️ Configurações | Nome do app, cores, logo, modo manutenção |

---

## 🏗️ Hospedagem Gratuita

### Backend (Railway / Render)
1. Crie conta em [railway.app](https://railway.app) ou [render.com](https://render.com)
2. Conecte seu repositório GitHub
3. Adicione um banco PostgreSQL
4. Configure as variáveis de ambiente
5. Deploy automático a cada push

### Painel Admin (Vercel)
1. Crie conta em [vercel.com](https://vercel.com)
2. Importe a pasta `admin-panel`
3. Configure a variável `VITE_API_URL`
4. Deploy!

### App (EAS Build)
```bash
npm install -g eas-cli
eas login
cd mobile
eas build:configure
eas build -p android --profile production
```

---

## 📄 Licença

MIT - Use como quiser, mas respeite os direitos autorais do conteúdo que distribuir.

---

**Desenvolvido por:** Junior Cabecão
# sintonia-tv-api
