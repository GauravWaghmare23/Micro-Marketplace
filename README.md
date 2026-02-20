# Micro Marketplace Monorepo

A production-grade multi-platform marketplace application with role-based admin system.

This monorepo contains four subprojects:

- `backend/` - Node.js + Express API (MongoDB) with role-based admin APIs
- `web/` - React + Vite + Tailwind customer frontend
- `web-admin/` - React + Vite + Tailwind admin dashboard
- `mobile/` - Expo React Native app

## Project Overview

### Architecture

```
┌─────────────────┐
│   Mobile App    │
│  (Expo/React)   │
└────────┬────────┘
         │
<!--
    Expanded README for Micro Marketplace monorepo
    This file is intentionally long to provide exhaustive developer and operator guidance.
    It includes architecture, setup, API reference, deployment recipes, CI examples,
    troubleshooting, security checklist, performance tips, testing, and contribution guidelines.
-->

# Micro Marketplace — Monorepo

Comprehensive, production-grade multi-platform marketplace reference application. This monorepo
contains four coordinated projects that together provide a full-stack marketplace experience:

- `backend/` — Node.js + Express API, MongoDB (Mongoose), JWT-based authentication
- `web/` — Customer-facing React app (Vite + Tailwind)
- `web-admin/` — Admin dashboard (React + Vite + Tailwind + Zustand)
- `mobile/` — Expo React Native app for Android/iOS

This README documents development, testing, deployment, API reference, and operational guidance.

---

## Table of contents

1. Overview & architecture
2. Quick start (development)
3. Environment variables
4. Backend: design & API reference
5. Frontend: web and admin - structure & dev commands
6. Mobile: structure & run instructions
7. Seeding & test data
8. Authentication & authorization
9. Error handling & logging
10. Security checklist
11. Performance & scaling
12. Testing strategy
13. CI / CD example (GitHub Actions)
14. Docker & production deployment notes
15. Troubleshooting common issues
16. Contributing guidelines
17. Release & changelog notes
18. Appendix: useful commands and references

---

## 1. Overview & architecture

The project is split into four main subprojects to keep concerns separated and allow independent
development and deployment. The architecture is service-oriented but intentionally simple to remain
developer-friendly.

High-level diagram

```
                                                                                +----------------+
                                                                                |   Mobile App   |
                                                                                |   (Expo)       |
                                                                                +--------+-------+
                                                                                                 |
                                                                                                 v
                                            +------------------+   +--------------+   +---------------+
                                            |  Customer (web)  |<->|  Backend API |<->|   Database     |
                                            |   (React/Vite)   |   |  (Express)   |   |   (MongoDB)    |
                                            +------------------+   +--------------+   +---------------+
                                                                                                     ^  ^
                                                                                                     |  |
                                                                             +-----------+  +-----------+
                                                                             |                            |
                                                                +------+------+              +-----+------+
                                                                |  Admin Dashboard |            |  Third-party |
                                                                | (web-admin)      |            |  Integrations|
                                                                +------------------+            +--------------+
```

Core responsibilities

- Backend: authentication, authorization, products CRUD, favorites, admin endpoints, search, pagination.
- Web: customer UX — browse/search products, product detail, favorites, auth.
- Web-admin: admin management UI — users, products, stats, edit/delete.
- Mobile: mobile-focused experience mirroring core customer functionality.

Design goals

- Secure by default (JWT, input validation, role checks)
- Simple, modular API surface (RESTful endpoints)
- Scalable seed data for testing (1k+ products)
- Clear local development experience — run each subproject independently

---

## 2. Quick start (development)

Prerequisites

- Node.js 16+ (LTS recommended)
- npm or yarn
- MongoDB (local or Atlas)
- Optional: Android emulator / iOS simulator for mobile

Recommended workflow

1. Clone repository

```bash
git clone <repo-url> micro-marketplace
cd micro-marketplace
```

2. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI and JWT_SECRET
npm run seed   # populate DB with sample data and default admin
npm run dev    # starts server on PORT (default 5000)
```

3. Web (customer)

```bash
cd ../web
npm install
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```

4. Web-admin (dashboard)

```bash
cd ../web-admin
npm install
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```

5. Mobile (Expo)

```bash
cd ../mobile
npm install
npm start   # opens Expo dev tools
```

Access URLs (local defaults)

- Backend API: http://localhost:5000
- Web customer app: http://localhost:5173 (Vite)
- Admin dashboard: http://localhost:5174 (Vite)

---

## 3. Environment variables (detailed)

Backend (`backend/.env` example)

```
MONGO_URI=mongodb://localhost:27017/micro-marketplace
JWT_SECRET=super-secret-key-at-least-32-chars
NODE_ENV=development
PORT=5000
DEFAULT_ADMIN_EMAIL=gauravwaghmare17384@gmail.com
DEFAULT_ADMIN_PWD=123456789
DEFAULT_ADMIN_NAME=Admin
```

Frontend (Vite) — `web/.env` and `web-admin/.env`

```
VITE_API_URL=http://localhost:5000
VITE_APP_TITLE="Micro Marketplace"
```

Mobile (Expo) — `app.json` or `.env`

- Use `EXPO_PUBLIC_API_URL` or similar to configure API host for the mobile app.

Security note: Do NOT commit production secrets. Use environment variables or secret managers
for CI/CD and deployments.

---

## 4. Backend — design & API reference

Technology

- Node.js + Express
- MongoDB with Mongoose
- JWT for auth
- express-validator for request validation
- Helmet, CORS for security

Project layout (backend/src)

```
src/
├─ app.js           # express app initialization
├─ server.js        # bootstraps the app and connects DB
├─ config/db.js     # mongoose connection
├─ controllers/
│  ├─ authController.js
│  ├─ productController.js
│  ├─ favoriteController.js
│  └─ adminController.js
├─ middleware/
│  ├─ auth.js       # verifies JWT
│  ├─ adminAuth.js  # verifies admin role
│  └─ errorHandler.js
├─ models/
│  ├─ User.js
│  └─ Product.js
└─ routes/
     ├─ auth.js
     ├─ products.js
     ├─ favorites.js
     └─ admin.js
```

API conventions

- All JSON responses use this envelope where appropriate:

```json
{ "success": true, "data": ..., "message": "optional message" }
```

- Authentication is JWT via `Authorization: Bearer <token>` header.
- Admin endpoints are namespaced under `/api/admin/*` and require admin role.

Authentication endpoints

POST /auth/register

Request body

```json
{ "name": "string", "email": "string", "password": "string" }
```

Response

```json
{ "success": true, "data": { "token": "...", "user": {...} } }
```

POST /auth/login

Request

```json
{ "email": "...", "password": "..." }
```

Response

```json
{ "success": true, "data": { "token": "...", "user": {"role": "user|admin"} } }
```

Products endpoints

GET /products?page=1&limit=20&q=searchTerm

- Returns paginated list of products. Supports `q` search on title/description.

GET /products/:id

- Returns product detail.

POST /products (admin)

- Create product (admin only). Body: title, price, description, image.

PUT /products/:id (admin)

- Update product (admin only).

DELETE /products/:id (admin)

- Delete product (admin only).

Favorites endpoints (authenticated)

GET /favorites

- Returns user's favorites.

POST /favorites/:productId

- Toggle add/remove favorite for authenticated user.

Admin endpoints

GET /api/admin/users?page=1&limit=20&q=search

- List users with pagination and optional search.

PUT /api/admin/products/:id
DELETE /api/admin/products/:id

- Admin product management endpoints.

Error handling

- Validation errors return `400` with details; unauthorized access returns `401` or `403` where appropriate.
- Server errors return `500` with a safe message and logged stack trace on the server.

---

## 5. Frontend — web (customer) and web-admin (dashboard)

Shared patterns

- Axios centralized instances (`/src/api/axios.js`) configure `baseURL` and attach `Authorization` header when a token exists.
- Auth flow: login saves token to `localStorage` (or secure storage for mobile), components read token to determine auth state.
- Protected routes check token and role when navigating. Admin UI uses a state store (Zustand) to keep `user` and `token`.

Web (customer) structure highlights

```
web/src/
├─ api/            # axios instance and API helpers
├─ components/     # presentational components (Navbar, ProductCard, Layout)
├─ pages/          # React Router pages (Products, ProductDetail, Login)
└─ App.jsx
```

Web-admin (dashboard) structure

```
web-admin/src/
├─ api/            # axios admin instance and helpers
├─ components/     # Header, Sidebar, Modal, Toast
├─ context/        # Zustand stores for auth + UI
├─ pages/          # Dashboard, Users, Products
└─ main.jsx
```

Dev commands (recap)

```bash
cd web
npm install
npm run dev

cd web-admin
npm install
npm run dev
```

Build commands

```bash
cd web
npm run build
cd ../web-admin
npm run build
```

---

## 6. Mobile (Expo) — structure & tips

The `mobile/` Expo project is set up as a React Native app using the expo-router pattern and TypeScript.

Key folders

```
mobile/
├─ app/            # expo routes
├─ src/
│  ├─ api/         # axios instance (EXPO_PUBLIC_API_URL)
│  ├─ components/
│  ├─ screens/
│  └─ context/
└─ app.json
```

Run locally

```bash
cd mobile
npm install
npm start
# or expo start
```

Device notes

- For Android emulator use `10.0.2.2` to reach host `localhost` when `EXPO_PUBLIC_API_URL` points to local machine.
- For physical devices use LAN IP for API host (e.g. `http://192.168.1.10:5000`).

---

## 7. Seeding & test data

The backend includes a `seed/seed.js` script to create sample users, products, and the default admin. The script is idempotent and safe to re-run.

Seed behavior

- Admin user: created/updated based on `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PWD` env vars.
- Sample users: created only when certain conditions are met (to avoid duplicates).
- Products: bulk-generated (1000 records by default) using randomized data and `picsum.photos` for images.

Run seeding

```bash
cd backend
npm run seed
```

Troubleshooting

- If seeding fails with `MongoNetworkError`, ensure `MONGO_URI` is correct and MongoDB is reachable.
- If images fail to load, check network and refer to `picsum.photos` service availability.

---

## 8. Authentication & authorization

Auth flow summary

1. User calls `POST /auth/login` with email/password.
2. Backend validates credentials and returns a JWT and user payload.
3. Client stores JWT (localStorage for web; secure storage for mobile in production), attaches to future requests.
4. Backend verifies JWT middleware (`auth.js`) and, for admin routes, `adminAuth.js` checks `user.role === 'admin'`.

Token expiry & auto-logout

- Tokens are short-lived in production. The client should gracefully handle `401` responses by redirecting to login and clearing stored token.

Security considerations

- Prefer refresh token flows for long-lived sessions in production.
- If storing tokens in `localStorage`, protect against XSS; Content Security Policy and proper sanitization reduce risk.

---

## 9. Error handling & logging

Backend

- Errors are captured by error handler middleware and logged.
- Use structured logging (JSON) for production to integrate with log aggregation (e.g. ELK, Datadog).

Frontend

- Axios response interceptors handle 401/403 and redirect to login when needed.
- For 5xx errors the client logs full error payload to console during development. In production use a client-side error tracker (Sentry, LogRocket).

Debugging tips

- Reproduce failing request with `curl` or Postman to isolate frontend vs backend issue.
- Use backend logs (console or configured logger) to find stack traces for 500 errors.

---

## 10. Security checklist (pre-production)

Backend

- [ ] Ensure `JWT_SECRET` is strong and stored in a secret manager.
- [ ] Enable HTTPS/TLS for production domains.
- [ ] Rate-limit auth endpoints to prevent brute-force attacks.
- [ ] Validate and sanitize all inputs.
- [ ] Enforce CORS policies to allow only known origins.

Frontend

- [ ] Avoid placing secrets in client builds.
- [ ] Set secure cookie attributes if cookies are used.
- [ ] Use Content Security Policy headers where possible.

Infrastructure

- [ ] Monitor for suspicious activity and setup alerts.
- [ ] Use managed DB with backups and access controls.

---

## 11. Performance & scaling

Backend

- Use MongoDB indexes on frequently queried fields (e.g. `title`, `createdAt`, `price`).
- Add pagination and limit default page sizes to prevent large responses.
- Consider connection pooling and horizontal scaling with stateless API servers.

Frontend

- Lazy-load heavy components and images.
- Optimize images and use caching/CDN for static assets.

Database

- Use replica sets for high availability; shard for large datasets.

---

## 12. Testing strategy

Unit tests

- Backend: Jest + supertest for controllers and API endpoints.
- Frontend: React Testing Library + Jest for components and behavior.

Integration tests

- Run integration tests against a local or in-memory database (mongodb-memory-server) to validate routes and business logic.

End-to-end (E2E)

- Cypress or Playwright to exercise user flows (login, search, favorites, admin CRUD).

Continuous testing

- Run unit and integration tests in CI on every PR.

---

## 13. CI / CD example (GitHub Actions)

Below is a concise GitHub Actions example for running tests and building web projects. Use secrets for production deploys.

`.github/workflows/ci.yml`

```yaml
name: CI

on: [push, pull_request]

jobs:
    backend-tests:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - name: Use Node.js 18
                uses: actions/setup-node@v4
                with:
                    node-version: 18
            - name: Install backend deps
                run: |
                    cd backend
                    npm ci
            - name: Run backend tests
                run: |
                    cd backend
                    npm test -- --coverage

    web-build:
        runs-on: ubuntu-latest
        needs: backend-tests
        steps:
            - uses: actions/checkout@v4
            - name: Node.js
                uses: actions/setup-node@v4
                with:
                    node-version: 18
            - name: Build web
                run: |
                    cd web
                    npm ci
                    npm run build
            - name: Build web-admin
                run: |
                    cd web-admin
                    npm ci
                    npm run build
```

Deployment steps will vary by target (Heroku, Netlify, Vercel, Docker-based infra). Use environment secrets and atomic deployments.

---

## 14. Docker & production deployment notes

This repo can be containerized. Below are sample Dockerfile ideas and docker-compose for local production testing.

Sample backend `Dockerfile`

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
```

`docker-compose.yml` (local staging)

```yaml
version: '3.8'
services:
    mongo:
        image: mongo:6
        restart: always
        volumes:
            - ./data/db:/data/db
        ports:
            - 27017:27017

    backend:
        build: ./backend
        environment:
            - MONGO_URI=mongodb://mongo:27017/micro-marketplace
            - JWT_SECRET=${JWT_SECRET}
        ports:
            - 5000:5000
        depends_on:
            - mongo

    web:
        build: ./web
        environment:
            - VITE_API_URL=http://localhost:5000
        ports:
            - 5173:5173
        depends_on:
            - backend
```

Production tips

- Use a managed MongoDB (Atlas) or a hardened self-hosted cluster.
- Serve web apps behind a CDN and enable HTTP/2.
- Use a process manager (PM2) or container orchestrator for backend processes.

---

## 15. Troubleshooting — common issues and fixes

Problem: `500 Internal Server Error` when calling `/auth/login` from frontend

- Check backend logs for stack trace. Run `cd backend && npm run dev` and reproduce the request.
- Verify `MONGO_URI` and that MongoDB is reachable.
- Check that `JWT_SECRET` is set and meets length requirements if enforced by code.

Problem: Frontend dev server fails with esbuild transform errors

- Often caused by syntax errors or duplicate imports. Inspect the error and open the referenced file.
- Example fix applied in this repo: removed duplicate React hook imports in `web/src/components/design/Navbar.jsx`.

Problem: Admin pages show 403 Forbidden

- Ensure the logged-in user has role `admin`.
- Confirm the token sent is valid (`Authorization` header present) and not expired.

Network / CORS

- Ensure backend `CORS` configuration includes your frontend origin(s). In development you can allow `http://localhost:5173` and `http://localhost:5174`.

---

## 16. Contributing guidelines (expanded)

How to propose changes

1. Fork the repo and create a branch: `git checkout -b feature/your-feature`
2. Keep changes small and focused per PR.
3. Write tests for new behavior (unit/integration) and ensure they pass.
4. Update or add docs when changing public APIs or behaviors.
5. Open a PR and provide a clear description and preview steps.

Code style

- Use Prettier for formatting and ESLint for linting. Configure editors to format on save.
- Keep commits descriptive: `feat:`, `fix:`, `chore:`, `docs:`, `test:`.

Review checklist for PRs

- Does the change include tests or a reasonable justification?
- Are secrets or credentials accidentally included?
- Do the changes affect performance or security? If so, include notes.

---

## 17. Release & changelog notes

We recommend using semantic versioning and a CHANGELOG.md generated from commit messages.

Release process

1. Merge PR to `main` once approved.
2. Tag a release `vX.Y.Z` and push tag to trigger CI/CD deploy pipelines.
3. Publish release notes highlighting breaking changes and upgrade steps.

---

## 18. Appendix — useful commands and examples

General

```bash
# run backend in development
cd backend && npm run dev

# run frontend (web)
cd web && npm run dev

# run admin dashboard
cd web-admin && npm run dev

# run mobile (expo)
cd mobile && npm start
```

Testing

```bash
# backend tests
cd backend && npm test

# web tests (if configured)
cd web && npm test
```

Database

```bash
# open mongo shell
mongo --host localhost --port 27017

# list products
use micro-marketplace
db.products.find().limit(5).pretty()
```

API examples (curl)

Login (customer)

```bash
curl -X POST http://localhost:5000/auth/login \
    -H 'Content-Type: application/json' \
    -d '{"email": "alice@example.com", "password": "password123"}'
```

Get products

```bash
curl http://localhost:5000/products?page=1&limit=20
```

Create product (admin)

```bash
curl -X POST http://localhost:5000/products \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer <token>' \
    -d '{"title":"New Product","price":19.99,"description":"..."}'
```

---

## Appendix B — Data models (detailed)

User schema example (Mongoose)

```js
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
```

Product schema example

```js
const ProductSchema = new mongoose.Schema({
    title: { type: String, index: true, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
```

---

## Appendix C — Example API contract (detailed endpoints)

Below are expanded endpoint descriptions with sample requests and responses.

1) POST `/auth/register`

Request

```json
{
    "name": "Alice",
    "email": "alice@example.com",
    "password": "password123"
}
```

Response (201)

```json
{
    "success": true,
    "data": {
        "token": "<jwt>",
        "user": { "_id": "...", "name": "Alice", "email": "alice@example.com", "role": "user" }
    }
}
```

2) POST `/auth/login`

Request

```json
{ "email": "alice@example.com", "password": "password123" }
```

Response (200)

```json
{ "success": true, "data": { "token": "<jwt>", "user": { "email": "alice@example.com", "role": "user" } } }
```

3) GET `/products?page=1&limit=20&q=shirt`

Response

```json
{
    "success": true,
    "data": {
        "total": 123,
        "page": 1,
        "limit": 20,
        "products": [ {"_id":"...","title":"Red Shirt", "price": 29.99 }, ... ]
    }
}
```

4) POST `/favorites/:productId` (toggle)

Response

```json
{ "success": true, "data": { "favorited": true, "productId": "..." } }
```

... (other endpoints follow the same patterns)

---

## Appendix D — Operational runbook (short)

When incidents occur

1. Identify the service: is it backend, web, web-admin, or mobile?
2. Check health endpoints and logs:
     - Backend: `curl http://localhost:5000/health` (if implemented)
     - Web: check console for build errors
3. Check database availability and replication status.
4. If the issue is an unhandled exception, gather stack trace and reproduce with a `curl` call.

Contacting support

- Include logs, environment variables (redact secrets), and exact reproduction steps.

---

## Closing notes

This README aims to be a single authoritative source for developers working across the monorepo.
If you'd like, I can also:

- Generate or update per-subproject `README.md` files (backend, web, web-admin, mobile) with trimmed content.
- Add a full OpenAPI/Swagger spec for the backend generated from controllers.
- Add GitHub Actions or other CI templates specialized for deployment (Heroku, Netlify, DockerHub).

If you want any of those expansions, tell me which one to produce next and I will add it.

