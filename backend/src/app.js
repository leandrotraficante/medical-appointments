import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import appointmentsRoutes from './routes/appointments.route.js';

dotenv.config();

// Fail-fast on missing environment variables
const validateEnv = () => {
	const missingVars = [];
	if (!process.env.PRIVATE_KEY_JWT) missingVars.push('PRIVATE_KEY_JWT');
	if (!process.env.JWT_EXPIRES_IN) missingVars.push('JWT_EXPIRES_IN');
	if (!process.env.MONGO_URI && !process.env.MONGO_URL) missingVars.push('MONGO_URI or MONGO_URL');

	if (missingVars.length > 0) {
		console.error('Missing required environment variables:', missingVars.join(', '));
		console.error('Please set them in your environment or .env file before starting the server.');
		process.exit(1);
	}
};

validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentsRoutes);

mongoose.connect(MONGO_URI, {})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });