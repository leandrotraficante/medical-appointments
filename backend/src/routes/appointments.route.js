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

/**
 * Router for appointment management endpoints
 * @type {express.Router}
 * @description Handles CRUD operations, searching, and management of medical appointments
 */
const appointmentsRoutes = express.Router();

// ===== MIDDLEWARE =====
// All appointment routes require authentication
appointmentsRoutes.use(authenticateToken);

// ===== APPOINTMENT MANAGEMENT ROUTES =====

/**
 * @route POST /api/appointments
 * @desc Create a new appointment in the system
 * @access Authenticated users (admin, doctor, patient)
 * @body {Object} appointmentData - Patient, doctor, and date information
 * @returns {Object} JSON response with created appointment data
 * @example
 * POST /api/appointments
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * Body: {
 *   "patient": "507f1f77bcf86cd799439011",
 *   "doctor": "507f1f77bcf86cd799439012",
 *   "date": "2024-01-20T10:00:00.000Z"
 * }
 * // Returns: { success: true, data: { appointment details } }
 */
appointmentsRoutes.post('/', requireRole(['admin', 'doctor', 'patient']), createAppointment);

/**
 * @route GET /api/appointments
 * @desc Get all appointments with optional filtering
 * @access Authenticated users (admin, doctor, patient)
 * @query {Object} filters - Optional filter criteria
 * @returns {Object} JSON response with filtered appointments
 * @example
 * GET /api/appointments?status=pending&doctor=507f1f77bcf86cd799439012
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: [appointment1, appointment2, ...] }
 */
appointmentsRoutes.get('/', requireRole(['admin', 'doctor', 'patient']), getAllAppointments);

/**
 * @route GET /api/appointments/date-range
 * @desc Search appointments within a specific date range
 * @access Admin and doctor only
 * @query {string} startDate - Start date for search range (YYYY-MM-DD)
 * @query {string} endDate - End date for search range (YYYY-MM-DD)
 * @returns {Object} JSON response with appointments in date range
 * @example
 * GET /api/appointments/date-range?startDate=2024-01-01&endDate=2024-01-31&status=pending
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: [appointment1, appointment2, ...] }
 */
appointmentsRoutes.get('/date-range', requireRole(['admin', 'doctor']), findAppointmentsByDateRange);

/**
 * @route GET /api/appointments/status
 * @desc Search appointments by their current status
 * @access Admin and doctor only
 * @query {string} status - Appointment status to search for
 * @returns {Object} JSON response with appointments matching the status
 * @example
 * GET /api/appointments/status?status=pending&doctor=507f1f77bcf86cd799439012
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: [pending appointment1, pending appointment2, ...] }
 */
appointmentsRoutes.get('/status', requireRole(['admin', 'doctor']), findAppointmentsByStatus);

/**
 * @route GET /api/appointments/available-slots/:doctorId
 * @desc Get available time slots for a doctor on a specific date
 * @access Authenticated users (admin, doctor, patient)
 * @param {string} doctorId - Doctor's MongoDB ID
 * @query {string} date - Date to check for available slots (YYYY-MM-DD)
 * @returns {Object} JSON response with available time slots
 * @example
 * GET /api/appointments/available-slots/507f1f77bcf86cd799439012?date=2024-01-15
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: [{ time: "2024-01-15T09:00:00.000Z", formatted: "09:00" }, ...] }
 */
appointmentsRoutes.get('/available-slots/:doctorId', requireRole(['admin', 'doctor', 'patient']), getAvailableSlots);

/**
 * @route GET /api/appointments/doctor/:doctorId
 * @desc Get all appointments for a specific doctor
 * @access Admin and doctor only
 * @param {string} doctorId - Doctor's MongoDB ID
 * @query {Object} filters - Optional filter criteria
 * @returns {Object} JSON response with doctor's appointments
 * @example
 * GET /api/appointments/doctor/507f1f77bcf86cd799439012?status=pending
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: [appointment1, appointment2, ...] }
 */
appointmentsRoutes.get('/doctor/:doctorId', requireRole(['admin', 'doctor']), getAppointmentByDoctor);

/**
 * @route GET /api/appointments/patient/:patientId
 * @desc Get all appointments for a specific patient
 * @access Authenticated users (admin, doctor, patient)
 * @param {string} patientId - Patient's MongoDB ID
 * @query {Object} filters - Optional filter criteria
 * @returns {Object} JSON response with patient's appointments
 * @example
 * GET /api/appointments/patient/507f1f77bcf86cd799439011?status=confirmed
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: [appointment1, appointment2, ...] }
 */
appointmentsRoutes.get('/patient/:patientId', requireRole(['admin', 'doctor', 'patient']), getAppointmentByPatient);

/**
 * @route GET /api/appointments/:appointmentId
 * @desc Get a specific appointment by ID
 * @access Authenticated users (admin, doctor, patient)
 * @param {string} appointmentId - Appointment's MongoDB ID
 * @returns {Object} JSON response with appointment data
 * @example
 * GET /api/appointments/507f1f77bcf86cd799439011
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: { appointment details } }
 */
appointmentsRoutes.get('/:appointmentId', requireRole(['admin', 'doctor', 'patient']), getAppointmentById);

/**
 * @route PUT /api/appointments/:appointmentId/status
 * @desc Update appointment status
 * @access Admin and doctor only
 * @param {string} appointmentId - Appointment's MongoDB ID
 * @body {string} status - New status for the appointment
 * @returns {Object} JSON response with updated appointment data
 * @example
 * PUT /api/appointments/507f1f77bcf86cd799439011/status
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * Body: { "status": "confirmed" }
 * // Returns: { success: true, data: { updated appointment } }
 */
appointmentsRoutes.put('/:appointmentId/status', requireRole(['admin', 'doctor']), updateAppointmentStatus);

/**
 * @route PUT /api/appointments/:appointmentId/date
 * @desc Update appointment date and time
 * @access Admin and doctor only
 * @param {string} appointmentId - Appointment's MongoDB ID
 * @body {string} date - New date and time for the appointment
 * @returns {Object} JSON response with updated appointment data
 * @example
 * PUT /api/appointments/507f1f77bcf86cd799439011/date
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * Body: { "date": "2024-01-16T14:00:00.000Z" }
 * // Returns: { success: true, data: { updated appointment } }
 */
appointmentsRoutes.put('/:appointmentId/date', requireRole(['admin', 'doctor']), updateAppointmentDate);

/**
 * @route DELETE /api/appointments/:appointmentId
 * @desc Cancel an appointment (sets status to cancelled)
 * @access Admin only
 * @param {string} appointmentId - Appointment's MongoDB ID
 * @returns {Object} JSON response with deleted appointment data
 * @example
 * DELETE /api/appointments/507f1f77bcf86cd799439011
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: { deleted appointment }, message: "Appointment deleted successfully" }
 */
appointmentsRoutes.delete('/:appointmentId', requireRole(['admin']), deleteAppointment);

/**
 * @route POST /api/appointments/doctor/:doctorId/cancel-week
 * @desc Cancel all appointments for a doctor within a specified week
 * @access Admin and doctor only
 * @param {string} doctorId - Doctor's MongoDB ID
 * @body {string} startDate - Start date of the week (YYYY-MM-DD)
 * @body {string} endDate - End date of the week (YYYY-MM-DD)
 * @body {string} reason - Reason for cancellation (optional)
 * @returns {Object} JSON response with cancellation results
 * @example
 * POST /api/appointments/doctor/507f1f77bcf86cd799439012/cancel-week
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * Body: {
 *   "startDate": "2024-01-15",
 *   "endDate": "2024-01-21",
 *   "reason": "Doctor on vacation"
 * }
 * // Returns: { success: true, data: { modifiedCount: 5 }, message: "Successfully cancelled 5 appointments" }
 */
appointmentsRoutes.post('/doctor/:doctorId/cancel-week', requireRole(['admin', 'doctor']), cancelAllDoctorAppointmentsInWeek);

export default appointmentsRoutes;
