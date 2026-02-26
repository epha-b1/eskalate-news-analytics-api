# 🗞️ Eskalate News Analytics API

This repository contains a high-performance, production-ready backend for the Eskalate News Analytics assessment. Built with **Node.js 22**, **TypeScript**, and a **Modular Clean Architecture**, it provides a robust foundation for article management, engagement tracking, and daily analytics processing.

---

## 🏛️ Project Architecture (Modular Clean)

The system is organized into a modular structure that prioritizes encapsulation and separation of concerns. This allows features to be developed and scaled independently.

- **`src/core/`**: The backbone of the application.
  - `db/`: Clients for Prisma (Postgres) and Redis with connection lifecycle logging.
  - `middleware/`: Centralized error handling, JWT authentication (RBAC), and Zod schema validation.
  - `utils/`: Structured logging (Pino), generic response helpers, and pagination utils.
- **`src/modules/`**: Domain-specific logic. Each module is self-contained with its own routes, services, and validators.
  - **`auth/`**: Secure signup and login with hashed passwords and JWT.
  - **`articles/`**: Article lifecycle (CRUD), public feed with advanced filtering, and a soft-delete mechanism.
  - **`analytics/`**: Background jobs for daily data aggregation.

---

## 🚀 Tech Stack

- **Runtime**: Node.js 22 + TypeScript (Strict Mode)
- **Framework**: Express 5 (Next-gen Express)
- **Database**: Prisma 6 + PostgreSQL (UUID-based relations)
- **Cache & Queue**: BullMQ + Redis (Engagement window & Job processing)
- **Validation**: Zod (Schema-driven validation)
- **Logging**: Pino + Pino-pretty (Production-grade instrumentation)
- **Testing**: Vitest (Modern Unit/Integration tests)

---

## 🛠️ Environment Setup

### Prerequisites
- **Node.js** 18+ (v22 recommended)
- **PostgreSQL** instance
- **Redis** server

### Installation
1.  **Clone & Install**:
    ```bash
    cd backend
    npm install
    ```
2.  **Configuration**:
    Create a `.env` file in the `backend` directory (refer to `.env.example`):
    ```env
    PORT=3000
    DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
    REDIS_URL="redis://localhost:6379"
    JWT_SECRET="your-super-secret-key"
    ```
3.  **Database Ready**:
    ```bash
    npm run prisma:generate
    npm run prisma:migrate
    ```

---

## 🌱 Database Seeding

To verify the system with realistic data, run the built-in seeding script. It populates the database with:
- **Authors** (e.g., Jane, John)
- **Readers** (e.g., Alice, Bob)
- **Articles**: A mix of Published, Draft, and Deleted states across multiple categories (Tech, Sports, Health, Politics).
- **ReadLogs**: Pre-populated interaction data for testing analytics.

**Command**:
```bash
npm run seed
```

---

## 📈 The Analytics Engine

The API tracks article engagement with precision and performance.

### 🛡️ Smart View Tracking
- Located in `articles/readlog.service.ts`.
- Uses a **10-second sliding window** via Redis TTL to prevent rapid page refreshes from inflating view counts per IP/Reader.

### 📅 Daily Aggregation
Daily summaries are calculated for the GMT date cycle and stored in a specialized `DailyAnalytics` table:
1.  **Enqueue**: `npm run enqueue:analytics` (Can take an optional date argument like `2026-02-26`).
2.  **Process**: `npm run worker:analytics` (Starts the BullMQ worker to aggregate data).

---

## 🚦 Execution Commands

- **Development**: `npm run dev` (Hot-reloading with Nodemon/TSX)
- **Production Ready**: `npm run build && npm start`
- **Testing**: `npm test` (Fast, isolated unit tests)

---

## 🔒 Security & RBAC

The system implements Role-Based Access Control:
- **`author`**: Can manage their own articles (CRUD + Soft Delete) and view their personal performance dashboard.
- **`reader`**: Can view the public article feed and specific articles.

### Authorization Header
All protected routes require:
`Authorization: Bearer <JWT_TOKEN>`

---

## 📝 API Response Standard

All responses follow a consistent, JSend-inspired structure:

### Success Example
```json
{
  "Success": true,
  "Message": "Article fetched",
  "Object": { "id": "uuid", "title": "Example", ... },
  "Errors": null
}
```

### Paginated Example
```json
{
  "Success": true,
  "Message": "Articles found",
  "Object": [...],
  "PageNumber": 1,
  "PageSize": 10,
  "TotalSize": 50,
  "Errors": null
}
```

---

## 🧪 Manual Testing (CURL)

Below are example `curl` commands to test the core functionality. Ensure the server is running (`npm run dev`) and substitute the `<TOKEN>` where necessary.

### 1. Authentication
**Signup (Author):**
```bash
curl -X POST http://localhost:3000/auth/signup \
-H "Content-Type: application/json" \
-d '{"name":"Jane Doe","email":"jane@example.com","password":"StrongPass1!","role":"author"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"jane@example.com","password":"StrongPass1!"}'
```

### 2. Articles (Author Only)
**Create Article:**
```bash
curl -X POST http://localhost:3000/articles \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{"title":"The AI Revolution","content":"Detailed content about AI...","category":"Tech","status":"published"}'
```

**View Own Articles (Including Deleted):**
```bash
curl -G "http://localhost:3000/articles/me" \
-H "Authorization: Bearer <TOKEN>" \
-d "includeDeleted=true"
```

### 3. Public Articles (Reader/Public)
**List Feed (with Filters):**
```bash
curl -G "http://localhost:3000/articles" \
-d "category=Tech" \
-d "q=AI"
```

**Read Single Article (Increments View via ReadLog):**
```bash
curl http://localhost:3000/articles/<ARTICLE_ID>
```

### 4. Author Performance
**Dashboard:**
```bash
curl -H "Authorization: Bearer <TOKEN>" \
http://localhost:3000/author/dashboard
```

