import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importar los modelos para que se creen las colecciones
import './models/patient.model.js';
import './models/doctor.model.js';
import './models/appointment.model.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Medical Appointments Running');
});

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