# 🏢 Coowork — Sistema de Gestão e Reserva de Coworking

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2F7-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-5-black)](https://expressjs.com/)

Sistema completo para gestão de um espaço de coworking: cadastro de usuários, administração de salas e reserva de turnos, com fluxo de pagamento e expiração automática de reservas não confirmadas.

---

## 📋 Visão Geral

O **Coowork** é uma aplicação full-stack que permite:

- ✅ Cadastro e autenticação de usuários (JWT)
- ✅ Administração de salas (criação, edição, exclusão)
- ✅ Consulta de disponibilidade de salas por dia e turno (manhã, tarde, noite)
- ✅ Reserva de salas com expiração automática em 5 minutos caso o pagamento não seja confirmado
- ✅ Cancelamento de reservas (soft delete)
- ✅ Painel administrativo para usuários e salas
- ✅ API REST documentada com Swagger

---

## 🏗️ Arquitetura

### Estrutura do Projeto

```
.
├── backend/                 # API (Node.js + TypeScript + Express)
│   ├── src/
│   │   ├── controllers/     # Camada de controle das requisições
│   │   ├── services/        # Lógica de negócio
│   │   ├── routes/          # Definição de rotas (+ anotações Swagger)
│   │   ├── middlewares/     # Autenticação (JWT) e verificação de admin
│   │   ├── config/          # Configuração do Swagger
│   │   ├── lib/             # Cliente Prisma
│   │   ├── utils/           # AppError (erros padronizados)
│   │   └── server.ts        # Ponto de entrada
│   ├── prisma/
│   │   ├── schema.prisma    # Modelo de dados
│   │   ├── migrations/      # Histórico de migrações
│   │   ├── seed.ts          # Cria/atualiza o usuário admin
│   │   └── seedDev.ts       # Dados de desenvolvimento
│   └── package.json
│
├── front/                   # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── api/             # Chamadas à API (axios)
│   │   ├── components/      # Componentes reutilizáveis (Header, RotaProtegida)
│   │   ├── context/         # AuthContext (sessão/autenticação)
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── App.tsx          # Rotas da aplicação
│   │   └── main.tsx         # Ponto de entrada
│   └── package.json
│
└── README.md
```

---

## 🛠️ Stack Tecnológico

### Backend (`backend/`)

| Tecnologia         | Propósito                              |
| ------------------ | --------------------------------------- |
| **Node.js**        | Runtime JavaScript                      |
| **Express 5**      | Framework web                           |
| **TypeScript**     | Tipagem estática                        |
| **Prisma 7**       | ORM (com adapter `@prisma/adapter-pg`)  |
| **PostgreSQL**     | Banco de dados relacional (Supabase)    |
| **jsonwebtoken**   | Autenticação via JWT                    |
| **bcrypt**         | Hash seguro de senhas                   |
| **swagger-jsdoc / swagger-ui-express** | Documentação da API     |
| **cors**           | Controle de origens permitidas          |

### Frontend (`front/`)

| Tecnologia          | Propósito           |
| -------------------- | -------------------- |
| **React 19**          | Biblioteca UI         |
| **TypeScript**        | Tipagem estática      |
| **Vite**              | Build tool            |
| **React Router 7**    | Roteamento            |
| **React Hook Form**   | Formulários           |
| **Axios**             | Cliente HTTP          |

---

## 🚀 Guia de Instalação e Setup

### 📋 Pré-requisitos

- **Node.js** 18 ou superior
- **npm**
- Um banco **PostgreSQL** (local ou um projeto no [Supabase](https://supabase.com))
- **Git**

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/JoaoVictorMachadoSantos01/coowork.git
cd coowork
```

### 2️⃣ Configure o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/`:

```env
DATABASE_URL="postgresql://usuario:senha@host:porta/banco"
JWT_SECRET="troque-por-um-segredo-forte-e-aleatorio"
PORT=3000

# URL(s) do front em produção, separadas por vírgula se houver mais de uma
FRONTEND_URL="https://seu-front.vercel.app"

# Credenciais do admin criado pelo `npm run seed`
ADMIN_NOME="Admin"
ADMIN_EMAIL="admin@coowork.com"
ADMIN_CPF="00000000000"
ADMIN_SENHA="troque-essa-senha"
```

Gere o client, rode as migrações e crie o admin:

```bash
npx prisma generate
npx prisma migrate dev
npm run seed          # cria/atualiza o usuário admin a partir do .env
```

Inicie o servidor:

```bash
npm run dev
```

Servidor rodando em: **http://localhost:3000**
Swagger disponível em: **http://localhost:3000/api-docs**

### 3️⃣ Configure o Frontend

```bash
cd ../front
npm install
```

Crie um arquivo `.env` na pasta `front/` (veja `.env.example`):

```env
# Sem barra no final. Se omitida, o axios usa http://localhost:3000/api como fallback
VITE_API_URL=http://localhost:3000/api
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Aplicação disponível em: **http://localhost:5173**

---

## 📚 Documentação da API

Todas as rotas abaixo são servidas sob o prefixo **`/api`** (ex: `http://localhost:3000/api/salas`).

### 🔑 Autenticação

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@coowork.com",
  "senha": "senha123"
}
```

Retorna um token JWT que deve ser enviado no header `Authorization: Bearer <token>` nas rotas protegidas.

#### 👤 Usuários

| Método   | Endpoint         | Descrição                                   | Acesso                    |
| -------- | ---------------- | -------------------------------------------- | ------------------------- |
| `POST`   | `/usuarios`      | Cadastra um novo usuário                     | Público                   |
| `GET`    | `/usuarios`      | Lista todos os usuários                      | Admin                     |
| `GET`    | `/usuarios/me`   | Retorna os dados do usuário autenticado      | Autenticado                |
| `GET`    | `/usuarios/:id`  | Busca um usuário pelo ID                     | Admin                     |
| `PUT`    | `/usuarios/:id`  | Atualiza um usuário                          | Dono da conta ou admin    |
| `DELETE` | `/usuarios/:id`  | Exclui um usuário                            | Dono da conta ou admin    |

#### 🏠 Salas

| Método   | Endpoint                | Descrição                                                  | Acesso   |
| -------- | ------------------------ | ----------------------------------------------------------- | -------- |
| `GET`    | `/salas`                 | Lista todas as salas (filtra por `dia`/`turno` livres)       | Público  |
| `GET`    | `/salas/disponibilidade` | Lista salas com disponibilidade dos 3 turnos num `dia`       | Público  |
| `GET`    | `/salas/:id`             | Busca uma sala pelo ID                                       | Público  |
| `POST`   | `/salas`                 | Cria uma nova sala                                           | Admin    |
| `PUT`    | `/salas/:id`             | Atualiza uma sala                                            | Admin    |
| `DELETE` | `/salas/:id`             | Exclui uma sala                                              | Admin    |

**Exemplo:**

```bash
curl "http://localhost:3000/api/salas/disponibilidade?dia=2026-08-10"
```

#### 📅 Reservas

| Método   | Endpoint                  | Descrição                                              | Acesso                  |
| -------- | -------------------------- | ---------------------------------------------------------- | ------------------------ |
| `POST`   | `/reservas`                 | Cria uma reserva com status `pendente`                     | Autenticado               |
| `GET`    | `/reservas`                  | Lista as reservas do usuário logado (ou todas, se admin)   | Autenticado               |
| `GET`    | `/reservas/:id`              | Busca uma reserva pelo ID                                   | Dono da reserva ou admin |
| `POST`   | `/reservas/:id/confirmar`    | Confirma o pagamento de uma reserva pendente                | Autenticado               |
| `DELETE` | `/reservas/:id`              | Cancela uma reserva (soft delete)                           | Autenticado               |

**Exemplo:**

```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "salaId": 1,
    "diaDaReserva": "2026-08-10",
    "turno": "tarde"
  }'
```

> ⚠️ Uma reserva criada com status `pendente` expira automaticamente em **5 minutos** se não for confirmada em `/reservas/:id/confirmar`.

### 📖 Swagger UI

Documentação interativa completa da API:

```
http://localhost:3000/api-docs
```

---

## 🎨 Funcionalidades do Frontend

| Página                   | Rota                     | Descrição                                                 | Acesso     |
| ------------------------- | ------------------------- | ------------------------------------------------------------ | ---------- |
| **Cadastro**               | `/`                        | Criação de conta                                              | Público    |
| **Login**                  | `/login`                   | Autenticação                                                  | Público    |
| **Salas**                  | `/salas`                   | Consulta de salas e disponibilidade                           | Público    |
| **Minhas Reservas**        | `/minhas-reservas`         | Lista e gerencia as reservas do usuário                       | Autenticado |
| **Pagamento de Reserva**   | `/pagamento/:id`           | Confirmação de pagamento de uma reserva pendente               | Autenticado |
| **Perfil**                 | `/perfil`                  | Dados da conta do usuário                                      | Autenticado |
| **Admin · Salas**          | `/admin/salas`             | CRUD de salas                                                  | Admin      |
| **Admin · Usuários**       | `/admin/usuarios`          | Gestão de usuários                                             | Admin      |

O acesso às rotas protegidas é controlado pelo componente `RotaProtegida`, e a sessão é mantida via `AuthContext` + token JWT salvo no `localStorage`.

---

## 🗄️ Modelo de Dados

### Diagrama ER

```
┌───────────────────┐          ┌───────────────────┐
│      Usuario        │          │        Sala          │
├───────────────────┤          ├───────────────────┤
│ id (PK)              │          │ id (PK)               │
│ nome                 │          │ nome (UNIQUE)         │
│ email (UNIQUE)       │          │ preco                 │
│ cpf (UNIQUE)         │          │ capacidade            │
│ senha (hash)         │          │ descricao             │
│ isAdmin              │          │ dataDeCriacao         │
│ dataDeCriacao        │          └─────────┬─────────┘
└─────────┬─────────┘                    │
          │                                │
          │            ┌───────────────────┐
          └───────────►│      Reserva         │◄──────────┘
                       ├───────────────────┤
                       │ id (PK)               │
                       │ idDoUser (FK)         │
                       │ idDaSala (FK)         │
                       │ diaDaReserva          │
                       │ turno                 │
                       │ status                │
                       │ expireAt              │
                       │ dataDeCriacao         │
                       └───────────────────┘
```

### Regras de Negócio

| Regra                    | Detalhe                                                                  |
| -------------------------- | --------------------------------------------------------------------------- |
| **Status de reserva**       | `pendente` → `confirmada` ou `cancelada`                                    |
| **Expiração**               | Reserva `pendente` expira em 5 minutos se não confirmada                    |
| **Conflito de turno**       | Não é permitido reservar a mesma sala no mesmo dia/turno mais de uma vez     |
| **Exclusão de sala**        | Restrita (`onDelete: Restrict`) enquanto houver reservas vinculadas          |
| **Cancelamento**            | Soft delete — a reserva muda de status, a linha não é apagada               |
| **Índices**                 | `[idDaSala, diaDaReserva, turno]`, `[status, expireAt]`, `[idDoUser]`        |

---

## 📦 Scripts Disponíveis

### Backend (`backend/`)

```bash
npm run dev              # Desenvolvimento com hot reload (tsx watch)
npm run build            # prisma generate + tsc + prisma migrate deploy
npm start                # Inicia servidor em produção (dist/server.js)
npm run seed              # Cria/atualiza o usuário admin a partir do .env
npm run db:seed-dev       # Popula o banco com dados de desenvolvimento
npx prisma studio        # Abre o Prisma Studio (GUI do banco)
```

### Frontend (`front/`)

```bash
npm run dev               # Desenvolvimento com hot reload
npm run build              # tsc -b + vite build
npm run preview            # Visualiza o build de produção
npm run lint                # Executa o linter
```

---

## 🔒 Segurança

### ✅ Medidas Implementadas

- ✅ **Senhas com hash** — bcrypt
- ✅ **Autenticação via JWT** — middleware `autenticar`
- ✅ **Controle de acesso por papel** — middleware `isAdmin`
- ✅ **Erros padronizados** — classe `AppError` (status + código)
- ✅ **CORS restrito** — origens definidas via `FRONTEND_URL`
- ✅ **Validação de entrada** nos controllers (nome, e-mail, senha, CPF)

### 🎯 Recomendações Futuras

- [ ] Adicionar testes automatizados
- [ ] Rate limiting nas rotas de autenticação
- [ ] Refresh token / expiração e renovação de sessão
- [ ] Job/cron para limpeza de reservas expiradas
- [ ] CI/CD pipeline

---

## 🐛 Solução de Problemas

### ❌ "Cannot find module '../generated/prisma'"

```bash
cd backend
npx prisma generate
```

### ❌ "Token invalido" / "Token nao fornecido"

Confirme que o header `Authorization: Bearer <token>` está sendo enviado e que `JWT_SECRET` é o mesmo usado para assinar o token.

### ❌ Frontend não conecta na API

1. Confirme que o backend está rodando na porta configurada (padrão `3000`)
2. Verifique `VITE_API_URL` no `.env` do `front/`
3. Confirme que a origem do frontend está listada em `FRONTEND_URL` no `.env` do backend (CORS)

### ❌ Migrações do Prisma falham

```bash
cd backend
npx prisma migrate reset   # ⚠️ apaga os dados do banco
```

---

## ☁️ Deploy

- **Backend**: pensado para hospedagem em serviços como o [Render](https://render.com) (`npm run build` roda as migrações automaticamente antes do `npm start`)
- **Frontend**: pensado para hospedagem em serviços como o [Vercel](https://vercel.com)
- **Banco de dados**: compatível com [Supabase](https://supabase.com) (pooler `pgbouncer`) ou qualquer PostgreSQL

---

## 👨‍💻 Autor

**João Victor Machado Santos**

- GitHub: [@JoaoVictorMachadoSantos01](https://github.com/JoaoVictorMachadoSantos01)
- Repositório: [github.com/JoaoVictorMachadoSantos01/coowork](https://github.com/JoaoVictorMachadoSantos01/coowork)

---

**Status:** 🚧 Em desenvolvimento
