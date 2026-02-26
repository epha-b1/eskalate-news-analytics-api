# Eskalate News Analytics API

This repository contains the backend for the Eskalate News Analytics assessment.

## Repository structure
All source code and logic live under the `backend` directory.

### Project Layout (Modular Clean Architecture)
- `src/core/`: Shared infrastructure (database clients, centralized error handling, cross-cutting middlewares).
- `src/modules/`: Feature-based domain logic (auth, articles, analytics). Each module is self-contained with its own routes, services, and validators.

## Tech stack
- Node.js + TypeScript
- Express
- Prisma + PostgreSQL
- BullMQ + Redis
- Zod for validation

## Requirements
- Node.js 18+
- PostgreSQL
- Redis

## Setup
1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies:
	- `cd backend && npm install`
3. Generate Prisma client:
	- `npm run prisma:generate`
4. Run migrations:
	- `npm run prisma:migrate`

## Run
- Development: `npm run dev`
- Production build: `npm run build`
- Start compiled server: `npm run start`
- Start analytics worker: `npm run worker:analytics`
- Enqueue daily analytics job: `npm run enqueue:analytics -- 2026-02-26`

## Tests
- Run tests: `npm run test`

## Authentication
- JWT access token with 24h expiration.
- Send `Authorization: Bearer <token>` for protected endpoints.
- Roles: `author`, `reader`.

## Response shape
Base response:
```json
{
  "Success": true,
  "Message": "",
  "Object": {},
  "Errors": null
}
```

Paginated response:
```json
{
  "Success": true,
  "Message": "",
  "Object": [],
  "PageNumber": 1,
  "PageSize": 10,
  "TotalSize": 0,
  "Errors": null
}
```

## Endpoints
Auth:
- `POST /auth/signup` (public)
- `POST /auth/login` (public)

Articles:
- `POST /articles` (author)
- `GET /articles/me` (author, supports `includeDeleted=true`)
- `PUT /articles/:id` (author)
- `DELETE /articles/:id` (author, soft delete)
- `GET /articles` (public; query: `category`, `author`, `q`, `page`, `size`)
- `GET /articles/:id` (public; logs read)

Author dashboard:
- `GET /author/dashboard` (author)

## Notes
- Read tracking uses a short Redis TTL to prevent rapid refreshes from creating excessive `ReadLog` entries.
- Analytics aggregation runs in UTC and upserts into `DailyAnalytics`.
