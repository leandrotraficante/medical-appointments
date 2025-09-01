import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.route.js';
import appointmentsRoutes from './routes/appointments.route.js';
import usersRoutes from './routes/users.route.js';
import adminRoutes from './routes/admin.route.js';
import { validateEnv } from './utils/validation.js';
import configs from './config/configs.js';

dotenv.config();
validateEnv();

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

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(configs.mongoUrl, {})
    .then(() => {
        app.listen(PORT, () => { });
    })
    .catch(err => { });