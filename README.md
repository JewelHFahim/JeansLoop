# MERN E-commerce Platform

A production-grade full-stack e-commerce platform for men's clothing built with the MERN stack (MongoDB, Express, React/Next.js, Node.js) in a monorepo architecture.

## 🏗️ Architecture

This project uses a **monorepo** structure with three main applications:

- **Backend API** (`apps/api`) - Node.js + Express + TypeScript + MongoDB
- **Admin Dashboard** (`apps/admin`) - Next.js 16 + TypeScript + Tailwind CSS
- **Storefront** (`apps/storefront`) - Next.js 16 + TypeScript + Tailwind CSS
- **Shared Library** (`packages/shared`) - Zod schemas and TypeScript types

## ✨ Features

### Backend API
- ✅ JWT Authentication (Access + Refresh Tokens with httpOnly cookies)
- ✅ User Management with Role-Based Access Control (SUPER_ADMIN, ADMIN, MANAGER, SUPPORT, CUSTOMER)
- ✅ Product Management with Variants (Size, Color, SKU, Stock)
- ✅ Order Management with Stripe Payment Integration
- ✅ File Upload (Local filesystem + Cloudinary support)
- ✅ Security: Helmet, CORS, Rate Limiting, Input Validation (Zod)
- ✅ Clean Architecture: Controllers → Services → Repositories → Models

### Admin Dashboard
- ✅ Admin Authentication & Protected Routes
- ✅ Dashboard with Statistics (Products, Orders, Users, Sales)
- ✅ Product Management (CRUD with Variants)
- ✅ Order Management
- ✅ User Management
- ✅ Modern UI with shadcn/ui components

### Storefront
- ✅ Homepage with Hero Section & Featured Products
- ✅ Shop Page with Category Filtering & Pagination
- ✅ Product Details with Variant Selection
- ✅ Shopping Cart with Zustand State Management
- ✅ Checkout with Stripe Payment
- ✅ Responsive Design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (or use Docker Compose)
- npm

### Installation

1. **Clone the repository**
```bash
cd e:/JeansLoop
```

2. **Install dependencies**
```bash
npm install
```

3. **Start MongoDB** (using Docker)
```bash
docker-compose up -d
```

4. **Configure environment variables**

Copy the example env files and update with your values:
```bash
# Backend API
cp apps/api/.env.example apps/api/.env

# Admin Dashboard
cp apps/admin/.env.example apps/admin/.env.local

# Storefront
cp apps/storefront/.env.example apps/storefront/.env.local
```

**Important:** Update the following in `apps/api/.env`:
- `JWT_SECRET` and `JWT_REFRESH_SECRET` (use strong random strings)
- `STRIPE_SECRET_KEY` (get from Stripe Dashboard)

Update in `apps/storefront/.env.local`:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (get from Stripe Dashboard)

5. **Start all applications**
```bash
npm run dev
```

This will start:
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:3001
- Storefront: http://localhost:3000

## 📁 Project Structure

```
JeansLoop/
├── apps/
│   ├── api/                 # Backend API (Express + TypeScript)
│   │   ├── src/
│   │   │   ├── controllers/ # Request handlers
│   │   │   ├── models/      # Mongoose models
│   │   │   ├── routes/      # API routes
│   │   │   ├── middlewares/ # Auth, error handling
│   │   │   ├── services/    # Business logic
│   │   │   └── utils/       # Helper functions
│   │   └── package.json
│   ├── admin/               # Admin Dashboard (Next.js)
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   ├── components/  # React components
│   │   │   └── lib/         # API client, utilities
│   │   └── package.json
│   └── storefront/          # Customer Storefront (Next.js)
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── components/  # React components
│       │   ├── store/       # Zustand stores
│       │   └── lib/         # API client, utilities
│       └── package.json
├── packages/
│   └── shared/              # Shared types and schemas
│       ├── src/
│       │   └── index.ts     # Zod schemas & TypeScript types
│       └── package.json
├── docker-compose.yml       # MongoDB container
└── package.json             # Root workspace config
```

## 🔧 Development

### Running Individual Apps

```bash
# Backend API only
npm run dev -w apps/api

# Admin Dashboard only
npm run dev -w apps/admin

# Storefront only
npm run dev -w apps/storefront
```

### Building for Production

```bash
npm run build
```

## 🔐 Default Admin Credentials

After starting the backend, create an admin user via API:

```bash
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "SUPER_ADMIN"
}
```

Then login at: http://localhost:3001

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Validation:** Zod
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS, bcryptjs
- **Payments:** Stripe
- **File Upload:** Multer + Cloudinary

### Frontend (Admin & Storefront)
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI)
- **State Management:** Zustand (Storefront), React Query (both)
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod
- **Payments:** Stripe.js

## 📝 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh access token

### Products
- `GET /api/v1/products` - List products (public)
- `GET /api/v1/products/:slug` - Get product by slug (public)
- `POST /api/v1/products` - Create product (admin)
- `PUT /api/v1/products/:id` - Update product (admin)
- `DELETE /api/v1/products/:id` - Delete product (admin)

### Orders
- `POST /api/v1/orders` - Create order (authenticated)
- `GET /api/v1/orders/myorders` - Get user's orders (authenticated)
- `GET /api/v1/orders/:id` - Get order by ID (authenticated)
- `GET /api/v1/orders` - List all orders (admin)

### Users
- `GET /api/v1/users/profile` - Get user profile (authenticated)
- `PUT /api/v1/users/profile` - Update profile (authenticated)
- `GET /api/v1/users` - List all users (admin)
- `DELETE /api/v1/users/:id` - Delete user (admin)

### Stats
- `GET /api/v1/stats` - Get dashboard statistics (admin)

### Upload
- `POST /api/v1/upload` - Upload image (admin)

## 🔒 Security Features

- JWT with refresh token rotation
- HttpOnly cookies for refresh tokens
- Password hashing with bcrypt
- Input validation with Zod
- CORS configuration
- Helmet security headers
- Rate limiting on auth endpoints
- Role-based access control
- SQL injection prevention (MongoDB)

## 📦 Deployment

### Environment Variables for Production

Make sure to set these in production:
- `NODE_ENV=production`
- Strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Production MongoDB URI
- Stripe production keys
- Cloudinary credentials (if using)

### Recommended Deployment Platforms

- **Backend:** Railway, Render, DigitalOcean
- **Frontend:** Vercel, Netlify
- **Database:** MongoDB Atlas

## 🤝 Contributing

This is a production-ready template. Feel free to customize and extend it for your needs.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.
