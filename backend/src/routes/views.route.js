import express from 'express';
import { authenticateToken, requireRole, redirectIfAuthenticated } from '../middleware/auth.middleware.js';
import UserRepository from '../repositories/user.repository.js';
import appointmentsModel from '../models/appointment.model.js';

const userRepository = new UserRepository();

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
viewsRoutes.get('/admin', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const [doctors, patients, todayCount, pendingCount] = await Promise.all([
            userRepository.findActiveDoctors(),
            userRepository.findActivePatients(),
            appointmentsModel.countDocuments({
                date: { $gte: new Date(new Date().setHours(0,0,0,0)), $lt: new Date(new Date().setHours(23,59,59,999)) }
            }),
            appointmentsModel.countDocuments({ status: 'pending' })
        ]);

        // Últimos 5 turnos (mock si no hay modelo completo de join)
        const recentAppointments = await appointmentsModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('patient')
            .populate('doctor');

        res.render('admin-dashboard', { 
            title: 'Admin Dashboard',
            user: req.user,
            totalDoctors: doctors.length,
            totalPatients: patients.length,
            todayAppointments: todayCount,
            pendingAppointments: pendingCount,
            doctors,
            appointments: recentAppointments
        });
    } catch (error) {
        res.status(500).render('error', { title: 'Error', message: error.message });
    }
});

// Doctor Panel
viewsRoutes.get('/doctor', authenticateToken, requireRole(['doctor']), async (req, res) => {
    try {
        const doctor = await userRepository.findUserByIdAndType(req.user.userId, 'doctor');
        if (!doctor) {
            return res.status(404).render('error', { title: 'Not Found', message: 'Doctor not found' });
        }

        const startOfDay = new Date(new Date().setHours(0,0,0,0));
        const endOfDay = new Date(new Date().setHours(23,59,59,999));

        const [todayAppointments, upcomingAppointments] = await Promise.all([
            appointmentsModel.find({ doctor: doctor._id, date: { $gte: startOfDay, $lt: endOfDay } })
                .sort({ date: 1 })
                .populate('patient'),
            appointmentsModel.find({ doctor: doctor._id, date: { $gt: endOfDay } })
                .sort({ date: 1 })
                .limit(10)
                .populate('patient')
        ]);

        res.render('doctor-panel', { 
            title: 'Doctor Panel',
            user: req.user,
            doctor: {
                name: doctor.name,
                specialties: (doctor.specialties || []).join(', '),
                license: doctor.license
            },
            todayAppointments,
            upcomingAppointments
        });
    } catch (error) {
        res.status(500).render('error', { title: 'Error', message: error.message });
    }
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
