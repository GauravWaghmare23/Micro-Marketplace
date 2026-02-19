# Micro Marketplace - Admin Dashboard

Professional, production-grade admin dashboard for managing the Micro Marketplace ecosystem. Built with React, Vite, and Tailwind CSS.

## Features

- 🔐 **Role-Based Access Control**: Admin-only authentication
- 📊 **Dashboard**: Overview with key metrics
- 👥 **User Management**: View, search, and delete users
- 📦 **Product Management**: View, edit, and delete products
- 🎨 **Modern UI**: Dark mode design with Framer Motion animations
- 📱 **Responsive**: Works seamlessly on desktop and tablet
- 🔄 **Pagination**: Efficient data handling with client-side pagination
- 🔍 **Search**: Real-time search for users and products
- 🚨 **Notifications**: Toast notifications for user feedback

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Notifications**: Sonner

## Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on http://localhost:5000

## Installation

```bash
cd web-admin
npm install
```

## Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the API URL if your backend is running on a different port:

```
VITE_API_URL=http://localhost:5000
```

## Development

Start the development server:

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5174`

## Production Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Admin Credentials

Default admin credentials (from seed):

- **Email**: `gauravwaghmare17384@gmail.com`
- **Password**: `123456789`

⚠️ **Security Note**: Change these credentials in production!

## Project Structure

```
web-admin/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Button.jsx
│   │   ├── Header.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Sidebar.jsx
│   │   └── Toast.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Products.jsx
│   │   └── Users.jsx
│   ├── api/                 # API service layer
│   │   ├── admin.js
│   │   └── axios.js
│   ├── context/             # Zustand stores
│   │   └── store.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── main.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.cjs
└── package.json
```

## Usage

### Authentication

1. Navigate to `/login`
2. Enter admin credentials
3. Dashboard redirects to `/` on successful login
4. Non-admin users are redirected to login

### User Management

- **View Users**: Browse all registered users with pagination
- **Search**: Filter users by name or email
- **Delete**: Remove users (prevents deletion of last admin)

### Product Management

- **View Products**: Browse products in a card grid
- **Edit**: Modify product details (title, price, description, image)
- **Delete**: Remove products from the system
- **Search**: Filter products by title or description

## API Integration

The dashboard integrates with the backend API:

- **Auth**: `/auth/login`, `/auth/profile`
- **Users**: `/api/admin/users`, `/api/admin/users/:id`
- **Products**: `/api/admin/products`, `/api/admin/products/:id`

## Security Features

- ✅ JWT token-based authentication
- ✅ Secure token storage in localStorage
- ✅ Automatic logout on 401 responses
- ✅ Admin role verification
- ✅ Protected routes with ProtectedRoute component
- ✅ Input validation and sanitization (backend)

## Styling

The dashboard uses a dark-themed design with custom Tailwind configuration:

- **Primary Colors**: Blues for actions
- **Danger Colors**: Reds for destructive actions
- **Neutral Colors**: Dark grays for background and text

### Custom Tailwind Theme

```javascript
dark: {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
  950: '#030712'
}
```

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of page components
- Optimized re-renders with React hooks
- Efficient pagination (20 items per page)
- Debounced search queries

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "preview"]
```

### Environment Variables for Production

```
VITE_API_URL=https://api.yourdomain.com
```

## Troubleshooting

### Login fails with "Invalid credentials"

- Ensure backend is running
- Check admin credentials
- Verify JWT_SECRET matches between frontend and backend

### API timeouts

- Increase timeout in `src/api/axios.js`
- Check backend health at `/health` endpoint
- Verify CORS configuration

### Styles not loading

```bash
npm run build
npm run preview
```

## Future Enhancements

- [ ] Dashboard analytics and charts
- [ ] Activity logs
- [ ] Batch operations
- [ ] Export to CSV
- [ ] Admin settings panel
- [ ] Email verification system
- [ ] Two-factor authentication

## Contributing

1. Create a feature branch
2. Commit changes
3. Push and create a pull request

## License

MIT
