import express from 'express';
import { authenticateToken, requireRole, redirectIfAuthenticated } from '../middleware/auth.middleware.js';

const viewsRoutes = express.Router();

// Login Page
viewsRoutes.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('login', {
        title: 'Login'
    });
});

// Register Page
viewsRoutes.get('/register', redirectIfAuthenticated, (req, res) => {
    res.render('register', {
        title: 'Patient Registration'
    });
});

// Admin Dashboard
viewsRoutes.get('/admin', authenticateToken, requireRole(['admin']), (req, res) => {
    res.render('admin-dashboard', { 
        title: 'Admin Dashboard',
        user: req.user,
        totalDoctors: 0,
        totalPatients: 0,
        todayAppointments: 0,
        pendingAppointments: 0,
        doctors: [],
        appointments: []
    });
});

// Doctor Panel
viewsRoutes.get('/doctor', authenticateToken, requireRole(['doctor']), (req, res) => {
    res.render('doctor-panel', { 
        title: 'Doctor Panel',
        user: req.user,
        doctor: {
            name: 'Dr. García',
            specialties: 'Cardiología, Medicina Interna',
            license: 'MED123'
        },
        todayAppointments: [],
        upcomingAppointments: []
    });
});

// Patient Portal
viewsRoutes.get('/patient', authenticateToken, requireRole(['patient']), (req, res) => {
    // Usamos lo que viene en el JWT para render rápido; si luego necesitás más datos, los cargamos vía AJAX
    const { name, lastname, personalId, email } = req.user;
    res.render('patient-portal', { 
        title: 'Patient Portal',
        user: req.user,
        patient: { name, lastname, personalId, email },
        nextAppointment: null,
        recentAppointments: []
    });
});

// Appointments View
viewsRoutes.get('/appointments', authenticateToken, requireRole(['admin', 'doctor']), (req, res) => {
    res.render('appointments', { 
        title: 'Appointments',
        user: req.user,
        appointments: [],
        doctors: [],
        stats: {
            pending: 0,
            confirmed: 0,
            cancelled: 0,
            completed: 0
        }
    });
});

// Home page (redirects to login)
viewsRoutes.get('/', (req, res) => {
    res.redirect('/login');
});

export default viewsRoutes;
