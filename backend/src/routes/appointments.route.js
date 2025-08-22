import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    getAppointmentByDoctor,
    getAppointmentByPatient,
    findAppointmentsByDateRange,
    findAppointmentsByStatus,
    getAvailableSlots,
    updateAppointmentStatus,
    updateAppointmentDate,
    deleteAppointment,
    cancelAllDoctorAppointmentsInWeek
} from '../controllers/appointments.controller.js';

const appointmentsRoutes = express.Router();

appointmentsRoutes.post('/', authenticateToken, requireRole(['admin', 'doctor']), createAppointment);
appointmentsRoutes.get('/', authenticateToken, requireRole(['admin', 'doctor', 'patient']), getAllAppointments);

// Rutas específicas ANTES de las dinámicas
appointmentsRoutes.get('/date-range', authenticateToken, requireRole(['admin', 'doctor']), findAppointmentsByDateRange);
appointmentsRoutes.get('/status', authenticateToken, requireRole(['admin', 'doctor']), findAppointmentsByStatus);
appointmentsRoutes.get('/available-slots/:doctorId', authenticateToken, requireRole(['admin', 'doctor', 'patient']), getAvailableSlots);
appointmentsRoutes.get('/doctor/:doctorId', authenticateToken, requireRole(['admin', 'doctor']), getAppointmentByDoctor);
appointmentsRoutes.get('/patient/:patientId', authenticateToken, requireRole(['admin', 'doctor', 'patient']), getAppointmentByPatient);

// Rutas con parámetros dinámicos AL FINAL
appointmentsRoutes.get('/:appointmentId', authenticateToken, requireRole(['admin', 'doctor', 'patient']), getAppointmentById);
appointmentsRoutes.put('/:appointmentId/status', authenticateToken, requireRole(['admin', 'doctor']), updateAppointmentStatus);
appointmentsRoutes.put('/:appointmentId/date', authenticateToken, requireRole(['admin', 'doctor']), updateAppointmentDate);
appointmentsRoutes.delete('/:appointmentId', authenticateToken, requireRole(['admin']), deleteAppointment);
appointmentsRoutes.post('/doctor/:doctorId/cancel-week', authenticateToken, requireRole(['admin', 'doctor']), cancelAllDoctorAppointmentsInWeek);

export default appointmentsRoutes;
