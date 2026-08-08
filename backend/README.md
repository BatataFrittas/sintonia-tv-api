# 🚀 Sintonia TV - Backend API

API REST completa para o app de streaming Sintonia TV.

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+

## 🛠️ Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações do PostgreSQL

# 3. Inicializar banco de dados e criar admin
npm run db:init

# 4. Iniciar servidor
npm run dev
```

## 🔐 Acesso Administrativo

Após rodar `npm run db:init`, o usuário admin será criado:

- **Email:** `admin@sintonia.tv` (ou o definido em ADMIN_EMAIL)
- **Senha:** `Admin@1234` (ou o definido em ADMIN_PASSWORD)

## 📡 Endpoints da API

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Perfil do usuário logado |

### Canais (usuário)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/channels` | Listar canais (filtrado por plano) |
| GET | `/api/channels/:id` | Detalhes do canal |
| POST | `/api/channels/:id/watch` | Registrar visualização |

### Categorias
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/categories` | Listar categorias |

### Admin (requer role: admin)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/admin/dashboard` | Estatísticas do dashboard |
| GET/POST | `/api/admin/channels` | CRUD de canais |
| GET/POST | `/api/admin/categories` | CRUD de categorias |
| GET/POST | `/api/admin/users` | CRUD de usuários |
| GET/PUT | `/api/admin/settings` | Configurações do app |

## 🔒 Segurança

- Todas as rotas (exceto login/register) exigem JWT no header:
  ```
  Authorization: Bearer <token>
  ```
- Rotas de admin exigem `role: admin`
- Rate limiting ativo (100 req/15min por IP)
- Helmet para headers de segurança
