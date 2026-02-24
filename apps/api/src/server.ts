import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import uploadRoutes from './routes/uploadRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';
import statsRoutes from './routes/statsRoutes';
import categoryRoutes from './routes/categoryRoutes';
import couponRoutes from './routes/couponRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import { validateEnv } from './utils/env';

// Global Error Handlers
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection at:', err);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
});

dotenv.config();

// Validate Environment
validateEnv();

const app = express();
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
console.log('--- API Startup Sequence (V1.2 - CORS FIX) ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
const PORT = process.env.PORT || 5000;

// Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 attempts per hour
    message: 'Too many login/register attempts from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.set('trust proxy', 1); // Trust first proxy (e.g. Vercel, Heroku, Nginx)
app.use(compression()); // Compress all responses
app.use(globalLimiter); // Apply global rate limiting
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow loading images

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://176.57.189.196:3000',
        'http://176.57.189.196:3001'
    ];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // Allow if origin matches our production IP or localhost
        const isAllowed = allowedOrigins.includes(origin) ||
            (origin.includes('176.57.189.196')) ||
            process.env.NODE_ENV !== 'production';

        if (isAllowed) {
            callback(null, true);
        } else {
            console.error(`CORS REJECTED | Origin: ${origin} | Allowed:`, allowedOrigins);
            callback(new Error(`CORS_NOT_ALLOWED: ${origin}`));
        }
    },
    credentials: true
}));

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-ecommerce';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err: Error) => console.error('❌ MongoDB Connection Error:', err));

// Static Folder
app.use('/uploads', express.static(path.join(path.resolve(), 'apps/api/public/uploads')));

// Routes
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 API Server running on port ${PORT}`);
});
