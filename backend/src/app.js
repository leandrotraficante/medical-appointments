import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
// import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.route.js';
import appointmentsRoutes from './routes/appointments.route.js';
import usersRoutes from './routes/users.route.js';
import adminRoutes from './routes/admin.route.js';
import { validateEnv } from './utils/validation.js';
import configs from './config/configs.js';

dotenv.config();

// Validate environment variables before starting the app
validateEnv();

/**
 * Main Express application instance
 * @type {express.Application}
 * @description Medical appointments system backend server
 * 
 * @example
 * // Start the server
 * const app = createApp();
 * app.listen(3000, () => console.log('Server running on port 3000'));
 */
const app = express();



/**
 * Server port configuration
 * @type {number}
 * @description Port number for the HTTP server, defaults to 3000 if not specified in environment
 */
const PORT = configs.port || 3000;

/**
 * Middleware configuration
 * @description Sets up essential Express middleware for request processing
 */
// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Parse cookies from request headers
app.use(cookieParser());

// ===== RATE LIMITING =====

/**
 * Global rate limiter - 100 requests per 15 minutes per IP
//  */
// const globalLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutos
//     max: 100, // máximo 100 requests por IP
//     message: {
//         error: 'Too many requests from this IP',
//         message: 'Please try again in 15 minutes'
//     },
//     standardHeaders: true,
//     legacyHeaders: false
// });

// /**
//  * Auth rate limiter - 5 attempts per 15 minutes per IP
//  */
// const authLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutos
//     max: 5, // máximo 5 intentos de login/register
//     message: {
//         error: 'Too many authentication attempts',
//         message: 'Please try again in 15 minutes'
//     },
//     standardHeaders: true,
//     legacyHeaders: false
// });

// // Apply rate limiting
// app.use(globalLimiter); // Global para todas las rutas
// app.use('/api/auth', authLimiter); // Específico para autenticación

/**
 * Route configuration
 * @description Sets up application routes for API endpoints
 */

// API Routes - serve JSON responses for application logic
app.use('/api/auth', authRoutes);        // Authentication endpoints
app.use('/api/appointments', appointmentsRoutes); // Appointment management
app.use('/api/users', usersRoutes);      // User management
app.use('/api/admin', adminRoutes);      // Administrative operations



/**
 * Connects to MongoDB and starts the Express server
 * @async
 * @description Initializes database connection and starts HTTP server
 * @returns {Promise<void>}
 * @throws {Error} If MongoDB connection fails
 * 
 * @example
 * // This function runs automatically when the module is imported
 * // No manual call needed
 */
mongoose.connect(configs.mongoUrl, {})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });