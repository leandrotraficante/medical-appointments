import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import appointmentsRoutes from './routes/appointments.route.js';
import usersRoutes from './routes/users.route.js';
import { validateEnv } from './utils/validation.js';

import configs from './config/configs.js';

dotenv.config();

// Validate environment variables before starting the app
validateEnv();

/**
 * Main Express application instance
 * @type {express.Application}
 */
const app = express();

/**
 * Server port configuration
 * @type {number}
 */
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/users', usersRoutes);

/**
 * Connects to MongoDB and starts the Express server
 * @async
 * @returns {Promise<void>}
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