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
┌────────┴──────────────────────────┐
│         Backend API                │
│   (Node.js + Express + MongoDB)    │
├────────┬──────────────────────────┤
│ Auth   │ Products │ Admin APIs    │
│ Routes │ Routes   │ (Role-based)  │
└────────┴──────────────────────────┘
         │            │
    ┌────┴──────┐     └──────────────────┐
    │   Web     │      Web Admin         │
    │ (Customer)│     (Dashboard)        │
    └───────────┘     └──────────────────┘
```

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS

### Frontend (Customer)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Admin Dashboard
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Notifications**: Sonner
- **Routing**: React Router v6

### Mobile
- **Framework**: React Native (Expo)
- **Package Manager**: npm/yarn

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Add your MONGO_URI and JWT_SECRET

# Seed database with admin user
npm run seed

# Start development server
npm run dev
```

**Default Admin Credentials** (created by seed):
- Email: `gauravwaghmare17384@gmail.com`
- Password: `123456789`

⚠️ **Change these in production!**

Backend runs on: `http://localhost:5000`

---

## Database Seeding

The backend includes a comprehensive seeding system that populates the database with sample data for development and testing purposes.

### Running the Seeds

```bash
cd backend
npm run seed
```

This will:
1. Connect to your MongoDB database
2. Create sample users (if they don't exist)
3. Generate 1000 sample products
4. Create a default admin user

### Seed Data Overview

#### Sample Users

The seed creates two sample users (only if no other users exist):

| Name  | Email                | Password     | Role |
|-------|---------------------|--------------|------|
| Alice | alice@example.com   | password123  | user |
| Bob   | bob@example.com     | password123  | user |

#### Default Admin User

The admin user is always created/updated (idempotent operation):

| Name  | Email                           | Password   | Role  |
|-------|----------------------------------|------------|-------|
| Admin | gauravwaghmare17384@gmail.com   | 123456789  | admin |

#### Sample Products

The seed generates **1000 sample products** with:
- Sequential titles: "Sample Product 1" through "Sample Product 1000"
- Random prices: $10 - $210
- Auto-generated descriptions
- Random images from picsum.photos
- Distributed among existing users

### Customizing Seed Data via Environment Variables

You can customize the admin user credentials by setting these environment variables in your `.env` file:

```
DEFAULT_ADMIN_EMAIL=your-admin@example.com
DEFAULT_ADMIN_PWD=your-secure-password
DEFAULT_ADMIN_NAME=Super Admin
```

**Example `.env` file:**

```
MONGO_URI=mongodb://localhost:27017/micro-marketplace
JWT_SECRET=your-super-secret-key-min-32-chars
NODE_ENV=development
DEFAULT_ADMIN_EMAIL=myadmin@company.com
DEFAULT_ADMIN_PWD=secureAdmin123
DEFAULT_ADMIN_NAME=System Administrator
```

### Seed Behavior

The seed script is **idempotent**, meaning it can be run multiple times without creating duplicates:

1. **Sample Users**: Only created if the database has exactly 1 user (the admin). This prevents duplicate sample users in development.
2. **Products**: Only created if no products exist. Skips if products already exist.
3. **Admin User**: Always checks for existence. If exists and not admin, promotes to admin. If doesn't exist, creates new.

### Troubleshooting Seeds

- **"Users already exist, skipping user seed"**: Normal behavior - sample users are only created when there's exactly 1 user (the admin).
- **"Products already exist, skipping product seed"**: Normal behavior - products are only created on first run.
- **"Seeding failed: MongoNetworkError"**: Ensure MongoDB is running and check your `MONGO_URI` in `.env`.

### 2. Customer Frontend Setup

```bash
cd web
npm install

# Create .env file
VITE_API_URL=http://localhost:5000

# Start dev server
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 3. Admin Dashboard Setup

```bash
cd web-admin
npm install

# Create .env file
VITE_API_URL=http://localhost:5000

# Start dev server
npm run dev
```

Admin dashboard runs on: `http://localhost:5174`

### 4. Mobile App Setup

```bash
cd mobile
npm install
npm start
```

## Role-Based Access Control

### User Roles
- **`user`**: Default role for all new users
  - Browse products
  - Add to favorites
  - View own profile
  
- **`admin`**: Administrative access
  - Manage all users
  - Manage all products
  - Access admin dashboard
  - View user statistics

### Authorization

**Protected Admin Routes** (`/api/admin/*`):
- `GET /api/admin/users` - List all users (paginated, searchable)
- `GET /api/admin/users/:id` - Get user details
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/products` - List all products (paginated, searchable)
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

All admin routes require:
1. Valid JWT token in `Authorization: Bearer <token>` header
2. User role must be `admin`
3. Returns `403 Forbidden` if not admin

## Admin Dashboard Features

### Dashboard
- **Overview**: Total users and products statistics
- **Quick Actions**: Links to user and product management

### User Management
- **List Users**: Paginated list with search functionality
- **View Details**: User email, role, and creation date
- **Delete Users**: Remove users safely (prevents deletion of last admin)
- **Search**: Filter by name or email
- **Pagination**: 20 items per page

### Product Management
- **List Products**: Grid view of all products
- **View Details**: Title, price, description, and image
- **Edit Products**: Update product information in real-time
- **Delete Products**: Remove products from inventory
- **Search**: Filter by title or description
- **Pagination**: 20 items per page
- **Modal Editor**: Clean interface for bulk edits

### Security Features
- **Role Verification**: Only admins can access
- **Protected Routes**: All pages require valid token
- **Auto Logout**: Expired tokens trigger automatic logout
- **Secure Storage**: Tokens stored in localStorage
- **Input Validation**: Client and server-side validation

## API Documentation

### Authentication Endpoints

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "gauravwaghmare17384@gmail.com",
  "password": "123456789"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Gaurav Waghmare",
    "email": "gauravwaghmare17384@gmail.com",
    "role": "admin"
  }
}
```

### Admin API Endpoints

**Get Users**
```http
GET /api/admin/users?page=1&limit=20&q=search_term
Authorization: Bearer <token>

Response:
{
  "total": 100,
  "page": 1,
  "limit": 20,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

**Update Product**
```http
PUT /api/admin/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 99.99,
  "description": "Updated description",
  "image": "https://example.com/image.jpg"
}

Response:
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Updated Title",
  "price": 99.99,
  "description": "Updated description",
  "image": "https://example.com/image.jpg",
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-15T14:30:00Z"
}
```

See individual subproject READMEs for detailed API documentation.

## Project Structure

```
micro-marketplace/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── favoriteController.js
│   │   │   └── productController.js
│   │   ├── middleware/
│   │   │   ├── adminAuth.js
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── Product.js
│   │   │   └── User.js (with role field)
│   │   ├── routes/
│   │   │   ├── admin.js
│   │   │   ├── auth.js
│   │   │   ├── favorites.js
│   │   │   └── products.js
│   │   ├── seed/
│   │   │   └── seed.js (creates admin user)
│   │   └── utils/
│   │       └── validate.js
│   └── package.json
│
├── web/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   ├── components/
│   │   └── api/
│   ├── package.json
│   └── vite.config.js
│
├── web-admin/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Users.jsx
│   │   │   └── Products.jsx
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Toast.jsx
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   └── admin.js
│   │   ├── context/
│   │   │   └── store.js (Zustand)
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── mobile/
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── app.json
│
└── README.md (this file)
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed with bcryptjs),
  role: String (enum: ['user', 'admin'], default: 'user'),
  favorites: [ObjectId], // References to Products
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  price: Number (required),
  description: String,
  image: String (URL),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Best Practices Implemented

### Backend
✅ Password hashing with bcryptjs (salt: 10 for regular users, 12 for admin)
✅ JWT token-based authentication with expiry (7 days)
✅ Role-based authorization middleware
✅ Input validation with express-validator
✅ CORS protection with credentials handling
✅ Helmet.js for HTTP headers security
✅ MongoDB injection prevention via Mongoose
✅ Prevent privilege escalation (can't delete last admin)

### Frontend
✅ Secure token storage in localStorage
✅ Protected routes with role verification
✅ Automatic logout on 401 responses
✅ XSS protection (React's built-in escaping)
✅ CSRF protection via SameSite cookies

## Deployment

### Backend Deployment (Heroku)
```bash
cd backend
git push heroku main
heroku config:set MONGO_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret-key
```

### Admin Dashboard Deployment (Netlify)
```bash
cd web-admin
npm run build
# Deploy dist folder to Netlify
```

### Environment Variables

**Backend**
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-super-secret-key-min-32-chars
NODE_ENV=production
PORT=5000
```

**Frontend**
```
VITE_API_URL=https://api.yourdomain.com
```

## Monitoring & Logging

- Backend includes Morgan for HTTP request logging
- Error handling middleware captures and logs errors
- Validation errors provide detailed feedback
- Frontend toast notifications for user feedback

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Commit: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Create a pull request

## Roadmap

- [ ] Advanced analytics dashboard
- [ ] Dashboard charts (Recharts integration)
- [ ] Activity logs for all admin actions
- [ ] Batch operations (bulk delete, update)
- [ ] Export to CSV/Excel
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Admin audit trail
- [ ] Product categories and filtering
- [ ] Inventory management

## Support

For issues or questions:
1. Check individual subproject READMEs
2. Review API documentation above
3. Check backend logs: `npm run dev`
4. Check browser console for frontend errors

## License

MIT License - See individual projects for details
#   M i c r o - M a r k e t p l a c e 
 
 