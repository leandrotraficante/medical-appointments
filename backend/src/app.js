import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import viewsRoutes from './routes/views.route.js';
import authRoutes from './routes/auth.route.js';

// Importar los modelos para que se creen las colecciones
import './models/admin.model.js';
import './models/patient.model.js';
import './models/doctor.model.js';
import './models/appointment.model.js';

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.engine('handlebars', engine({
	helpers: {
		eq: (a, b) => a === b,
		or: (...args) => {
			const options = args.pop();
			return args.some(Boolean);
		},
		formatDate: (date) => {
			try {
				const d = new Date(date);
				if (Number.isNaN(d.getTime())) return '';
				return d.toLocaleDateString('en-GB');
			} catch {
				return '';
			}
		},
		formatTime: (date) => {
			try {
				const d = new Date(date);
				if (Number.isNaN(d.getTime())) return '';
				return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
			} catch {
				return '';
			}
		}
	}
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Usar rutas de vistas (sin prefijo)
app.use('/', viewsRoutes);

// Usar rutas de auth con prefijo /api/auth
app.use('/api/auth', authRoutes);

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