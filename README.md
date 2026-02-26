# Eskalate News Analytics API

This repository contains the backend for the Eskalate News Analytics assessment.

## Repository structure
All source code and logic live under the `backend` directory.

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
# eskalate-news-analytics-api
<<<<<<< HEAD
=======
# eskalate-news-analytics-api
# eskalate-news-analytics-api
>>>>>>> 15f210c (chore: initial commit)
