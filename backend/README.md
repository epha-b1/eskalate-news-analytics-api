# Eskalate News Analytics API (Backend)

## Requirements
- Node.js 18+
- PostgreSQL
- Redis

## Setup
1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies:
   - `npm install`
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

## Environment Variables
- `DATABASE_URL`
- `JWT_SECRET`
- `REDIS_URL`
- `PORT`

## Notes
- Read tracking uses a short Redis TTL to prevent rapid refreshes from creating excessive `ReadLog` entries.
- Analytics aggregation runs in UTC (GMT) and upserts into `DailyAnalytics`.

## Tests
- Run tests: `npm run test`
