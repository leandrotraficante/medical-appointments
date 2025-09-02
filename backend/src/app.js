import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.route.js';
import appointmentsRoutes from './routes/appointments.route.js';
import usersRoutes from './routes/users.route.js';
import adminRoutes from './routes/admin.route.js';
import configs from './config/configs.js';

// Load environment variables from .env file
dotenv.config();
const app = express();
const PORT = configs.PORT || 3000;

// Configure trust proxy for Render (required for rate limiting)
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir archivos estáticos
app.use(express.static('public'));

const globalLimiter = rateLimit({
    windowMs: 25 * 60 * 1000,
    max: 100,
    message: {
        error: 'Too many requests',
        message: 'Please try again in 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 25 * 60 * 1000,
    max: 15,
    message: {
        error: 'Too many authentication attempts',
        message: 'Please try again in 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

app.use(globalLimiter);
app.use('/api/auth', authLimiter);

// Health check endpoint for Render
app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(configs.mongoUrl, {})
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
        });
    })
    .catch(err => {
        process.exit(1);
    });