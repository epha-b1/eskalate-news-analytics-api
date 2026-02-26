# Eskalate News Analytics API (Backend)

## 🛠️ Implementation Details
This backend provides the core API for the Eskalate News Analytics assessment. It uses:
- **Modular Clean Architecture**: Encapsulated feature modules in `src/modules`.
- **Engagement Tracking**: Redis-based 10s sliding window for view count integrity.
- **Background Jobs**: BullMQ for daily GMT-based analytics processing.
- **Soft Delete**: Articles are flagged with `deletedAt` for author-controlled removal.

## 🚀 Environment Setup
1.  **Dependencies**: `npm install`
2.  **Configuration**: Create `.env` based on `.env.example`.
3.  **Database**:
    ```bash
    npm run prisma:generate
    npm run prisma:migrate
    # Populate test data (Authors, Readers, Articles, Feed logs)
    npm run seed
    ```

## 🎮 Run Commands
- `npm run dev`: Hot-reload development server.
- `npm run build && npm start`: Production execution.
- `npm run test`: Run the test suite (Vitest).

## 📊 Analytics Aggregation
- `npm run enqueue:analytics`: Pushes a date-specific aggregation job into the queue.
- `npm run worker:analytics`: Starts the consumer to aggregate `ReadLog` data into `DailyAnalytics`.

---

## 🔒 Authentication
- Secure JWT (24h) with role-based checks for `author` and `reader`.
- Password hashing with Bcrypt/Argon2.

---

## 🧪 Manual Testing (CURL)

### 1- Authenticate
**Login (Author):**
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"jane@example.com","password":"StrongPass1!"}' | jq -r '.Object.token')
```

### 2- Manage Articles
**Create:**
```bash
curl -X POST http://localhost:3000/articles -H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" -d '{"title":"Test Article","content":"...","category":"Tech","status":"published"}'
```

### 3- Public Feed
**List:**
```bash
curl "http://localhost:3000/articles?category=Tech&page=1&size=5"
```

### 4- Performance
**Dashboard:**
```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/author/dashboard
```

---

## 📝 API Response Standard
All responses return:
```json
{
  "Success": true,
  "Message": "Descriptive message",
  "Object": { ... },
  "PageNumber": 1,
  "PageSize": 10,
  "TotalSize": 0,
  "Errors": null
}
```

Refer to the root `README.md` for a complete project overview and architectural details.
