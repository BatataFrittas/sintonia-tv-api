# 🌐 Guia de Hospedagem - Sintonia TV

## Opção 1: Railway (Recomendado - Gratuito)

### Backend + Banco de Dados

1. Acesse https://railway.app e faça login com GitHub
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Selecione seu repositório do Sintonia TV
4. Clique em "Add a Service" → "Database" → "Add PostgreSQL"
5. O Railway cria automaticamente a variável `DATABASE_URL`
6. Vá em "Variables" do seu serviço e adicione:
   ```
   JWT_SECRET=sua_chave_secreta_aqui_minimo_32_chars
   ADMIN_EMAIL=seu_email@dominio.com
   ADMIN_PASSWORD=SuaSenhaForte123
   NODE_ENV=production
   ```
7. O Railway detecta o `package.json` e faz deploy automaticamente
8. A URL do backend será algo como: `https://sintonia-tv-pro.up.railway.app`

### Painel Admin (Vercel)

1. Acesse https://vercel.com e faça login com GitHub
2. "Add New Project" → Importe a pasta `admin-panel`
3. Em "Environment Variables" adicione:
   ```
   VITE_API_URL=https://sintonia-tv-pro.up.railway.app/api
   ```
4. Deploy! A URL será algo como: `https://sintonia-admin.vercel.app`

---

## Opção 2: Render (Gratuito)

### Backend

1. Acesse https://render.com
2. "New Web Service" → Conecte seu GitHub
3. Configure:
   - **Name:** sintonia-tv-api
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
4. Adicione PostgreSQL em "New PostgreSQL"
5. Configure variáveis de ambiente
6. Deploy

---

## Opção 3: VPS Próprio (DigitalOcean, AWS, etc.)

```bash
# No servidor Ubuntu
sudo apt update && sudo apt install -y nodejs npm postgresql nginx

# Configurar PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE sintonia_tv;"
sudo -u postgres psql -c "CREATE USER sintonia WITH PASSWORD 'senha_segura';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE sintonia_tv TO sintonia;"

# Clonar projeto
git clone https://github.com/seu-user/sintonia-tv-pro.git
cd sintonia-tv-pro/backend
npm install
npm run db:init
npm start

# Configurar Nginx como proxy reverso
# E PM2 para manter o processo rodando
```

---

## 📱 Gerar APK Final

### Via EAS Build (Mais fácil)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login na conta Expo
eas login

# Configurar projeto
cd mobile
eas build:configure

# Gerar APK de preview (gratuito, demora ~15min)
eas build -p android --profile preview

# Ou AAB para Google Play (requer conta de desenvolvedor)
eas build -p android --profile production
```

O EAS envia o link do APK por email quando termina.

### Via Android Studio (Build Local)

```bash
cd mobile
npx expo prebuild --platform android

# Abra a pasta "android" no Android Studio
# Vá em Build → Generate Signed Bundle/APK
# Selecione APK → Crie ou use uma keystore
# Build!
```

---

## 🔗 URLs Importantes

| Serviço | URL Local | URL Produção |
|---------|-----------|--------------|
| Backend API | http://localhost:3000/api | https://sua-api.com/api |
| Painel Admin | http://localhost:5173 | https://seu-admin.vercel.app |
| App Mobile | Expo Go (dev) | APK instalado |

---

## ⚠️ Importante

- **Nunca commite o arquivo `.env`** com senhas reais
- Use **HTTPS** em produção (Railway e Vercel já fazem isso)
- Configure o **CORS** no backend para aceitar apenas seus domínios
- Faça backup do banco de dados PostgreSQL regularmente
