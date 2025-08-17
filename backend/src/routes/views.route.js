import express from 'express';

const router = express.Router();

// Admin Dashboard
router.get('/admin', (req, res) => {
    res.render('admin-dashboard', { 
        title: 'Admin Dashboard',
        totalDoctors: 0,
        totalPatients: 0,
        todayAppointments: 0,
        pendingAppointments: 0,
        doctors: [],
        appointments: []
    });
});

// Doctor Panel
router.get('/doctor', (req, res) => {
    res.render('doctor-panel', { 
        title: 'Doctor Panel',
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
router.get('/patient', (req, res) => {
    res.render('patient-portal', { 
        title: 'Patient Portal',
        patient: {
            name: 'Juan',
            lastname: 'Pérez',
            personalId: '12345',
            email: 'juan@email.com'
        },
        nextAppointment: null,
        recentAppointments: []
    });
});

// Appointments View
router.get('/appointments', (req, res) => {
    res.render('appointments', { 
        title: 'Appointments',
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

// Home page (redirects to admin dashboard)
router.get('/', (req, res) => {
    res.redirect('/admin');
});

export default router;
