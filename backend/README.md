# Backend - Micro Marketplace

## Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run seed data:

```bash
npm run seed
```

4. Start server:

```bash
npm run dev
```

## API

- `POST /auth/register` - register
- `POST /auth/login` - login
- `GET /products` - list (supports `search`, `page`, `limit`, `sort`)
- `GET /products/:id` - get product
- `POST /products` - create (auth required)
- `PUT /products/:id` - update (auth required)
- `DELETE /products/:id` - delete (auth required)
- `POST /favorites/:productId` - favorite (auth required)
- `DELETE /favorites/:productId` - unfavorite (auth required)
- `GET /favorites` - list favorites (auth required)

Test credentials (from seed):
- `alice@example.com` / `password123`
- `bob@example.com` / `password123`

