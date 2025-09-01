import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.route.js';
import appointmentsRoutes from './routes/appointments.route.js';
import usersRoutes from './routes/users.route.js';
import adminRoutes from './routes/admin.route.js';
import configs from './config/configs.js';

// Production-ready app - dotenv removed, using Render environment variables
const app = express();
const PORT = configs.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir archivos estáticos
app.use(express.static('public'));

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Too many requests',
        message: 'Please try again in 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
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
        console.log('MongoDB connected successfully');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    });