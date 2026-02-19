# Admin System Setup Guide

This guide provides step-by-step instructions for setting up and running the complete Micro Marketplace admin system.

## Prerequisites

- Node.js 16+ (recommended: 18 or higher)
- npm 8+ or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Git

## Step 1: Database Setup

### Option A: MongoDB Atlas (Cloud)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 free tier is sufficient for development)
4. Create a database user with credentials
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

### Option B: Local MongoDB

```bash
# Install MongoDB (macOS with Homebrew)
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Default connection string
mongodb://localhost:27017/micro-marketplace
```

## Step 2: Backend Setup

### Clone and Install

```bash
cd backend
npm install
```

### Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/micro-marketplace?retryWrites=true&w=majority

# JWT Secret (use a strong, random string)
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters-long

# Node Environment
NODE_ENV=development

# Server Port
PORT=5000
```

### Seed Database with Admin User

```bash
npm run seed
```

This will:
- Create sample users (Alice, Bob with role='user')
- Create 1000 sample products
- Create/verify default admin user:
  - Email: `gauravwaghmare17384@gmail.com`
  - Password: `123456789`
  - Role: `admin`

### Start Backend Server

```bash
npm run dev
```

Expected output:
```
Server running on port 5000
Connected to MongoDB
```

**Backend API URL**: `http://localhost:5000`

## Step 3: Customer Web Frontend Setup

### Clone and Install

```bash
cd web
npm install
```

### Configure Environment Variables

Create a `.env` file in the `web/` directory:

```env
VITE_API_URL=http://localhost:5000
```

### Start Development Server

```bash
npm run dev
```

**Web Frontend URL**: `http://localhost:5173`

## Step 4: Admin Dashboard Setup

### Clone and Install

```bash
cd web-admin
npm install
```

### Configure Environment Variables

Create a `.env` file in the `web-admin/` directory:

```env
VITE_API_URL=http://localhost:5000
```

### Start Development Server

```bash
npm run dev
```

**Admin Dashboard URL**: `http://localhost:5174`

## Step 5: Access Admin Dashboard

1. Open browser: `http://localhost:5174`
2. You'll be redirected to `/login`
3. Enter admin credentials:
   - Email: `gauravwaghmare17384@gmail.com`
   - Password: `123456789`
4. Click "Sign In"

You should now see the admin dashboard!

## Complete System Startup Command

For easy development, you can start all services in separate terminal tabs:

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Customer Web
cd web && npm run dev

# Terminal 3: Admin Dashboard
cd web-admin && npm run dev
```

Then access:
- Admin Dashboard: `http://localhost:5174`
- Customer Web: `http://localhost:5173`
- API: `http://localhost:5000`

## Docker Compose Setup (Optional)

Create a `docker-compose.yml` in the root directory:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: micro-marketplace-db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    container_name: micro-marketplace-backend
    ports:
      - "5000:5000"
    environment:
      MONGO_URI: mongodb://admin:password@mongodb:27017/micro-marketplace?authSource=admin
      JWT_SECRET: ${JWT_SECRET:-your-secret-key}
      NODE_ENV: development
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

Start with Docker:
```bash
docker-compose up
```

## Verification Checklist

- [ ] MongoDB is running and accessible
- [ ] Backend starts without errors on port 5000
- [ ] Can access `/health` endpoint: `http://localhost:5000/health`
- [ ] Admin user created after seed
- [ ] Admin Dashboard loads at `http://localhost:5174`
- [ ] Can login with admin credentials
- [ ] Can view users and products in admin dashboard

## Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Ensure MongoDB is running. Check with:
```bash
# macOS
brew services list

# Or start it
brew services start mongodb-community

# Or use MongoDB Atlas with correct connection string
```

### Admin User Not Created

```bash
# Re-run seed
npm run seed

# Check if user exists
# Login to MongoDB shell and query
db.users.findOne({ email: "gauravwaghmare17384@gmail.com" })
```

### Admin Dashboard Won't Load

1. Check backend is running: `curl http://localhost:5000/health`
2. Check network tab in browser DevTools for CORS errors
3. Verify `VITE_API_URL` in `.env` matches backend address
4. Clear browser cache: `Ctrl+Shift+Delete`

### Token Expired / Automatic Logout

The JWT token expires after 7 days. Simply login again:
```
Email: gauravwaghmare17384@gmail.com
Password: 123456789
```

## Changing Admin Credentials

### Via Database

1. Generate new password hash:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your-new-password';
bcrypt.hash(password, 12, (err, hash) => {
  console.log(hash);
});
```

2. Update user in database:

```javascript
db.users.updateOne(
  { email: "gauravwaghmare17384@gmail.com" },
  { $set: { password: "your-hash-here" } }
)
```

### Production Recommendation

- Generate a strong random password
- Store in secure environment variables / secrets manager
- Update via admin dashboard (future feature)

## Performance Settings

### Database Connection Pool

In `backend/src/config/db.js`, adjust connection pool:

```javascript
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000
};
```

### Pagination Defaults

In `backend/src/controllers/adminController.js`:

```javascript
const limit = 20; // Adjust based on performance
const maxLimit = 100; // Prevent abuse
```

## Security Hardening Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (min 32 chars)
- [ ] Enable HTTPS in production
- [ ] Set CORS properly for production domains
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Enable request rate limiting (production)
- [ ] Set up CSRF protection (if using cookies)
- [ ] Enable HTTPS enforced connections
- [ ] Regular backups of MongoDB

## Production Deployment

### Backend Deployment (Heroku)

```bash
cd backend

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-production-secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)

```bash
cd web-admin

# Build
npm run build

# Deploy dist folder to Netlify/Vercel
```

## Monitoring & Logging

### Backend Logging

The backend logs HTTP requests using Morgan:

```
GET /api/admin/users 200 45.230 ms
POST /auth/login 401 12.123 ms
```

Check logs:
```bash
npm run dev 2>&1 | tee app.log
```

### Admin Dashboard Logging

Browser console logs via:
- Network errors
- API responses
- Component lifecycle

## Support & Documentation

- Backend README: See `backend/README.md`
- Admin Dashboard README: See `web-admin/README.md`
- API Documentation: See main `README.md`
- MongoDB Docs: [docs.mongodb.com](https://docs.mongodb.com)
- React Docs: [react.dev](https://react.dev)
