import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import {
    getAllAdmins,
    activateDoctor,
    deactivateDoctor,
    updateDoctor,
    deleteDoctor,
    activatePatient,
    deactivatePatient,
    updatePatient,
    deletePatient
} from '../controllers/admin.controller.js';

/**
 * Router for administrative operations
 * @type {express.Router}
 * @description Handles admin-only operations for managing doctors, patients, and system administration
 */
const adminRoutes = express.Router();

// ===== MIDDLEWARE =====
// Todas las rutas requieren autenticación y rol de admin
adminRoutes.use(authenticateToken);
adminRoutes.use(requireRole(['admin']));

// ===== ADMIN MANAGEMENT ROUTES =====

/**
 * @route GET /api/admin/admins
 * @desc Get all administrators in the system
 * @access Admin only
 * @returns {Object} JSON response with array of admin objects
 * @example
 * GET /api/admin/admins
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: [...], message: "Found X admin(s)" }
 */
adminRoutes.get('/admins', getAllAdmins);

// ===== DOCTOR MANAGEMENT ROUTES =====

/**
 * @route PUT /api/admin/doctors/:doctorId/activate
 * @desc Activate a deactivated doctor account
 * @access Admin only
 * @param {string} doctorId - Doctor's MongoDB ID
 * @returns {Object} JSON response with activated doctor data
 * @example
 * PUT /api/admin/doctors/507f1f77bcf86cd799439011/activate
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: {...}, message: "Doctor activated successfully" }
 */
adminRoutes.put('/doctors/:doctorId/activate', activateDoctor);

/**
 * @route PUT /api/admin/doctors/:doctorId/deactivate
 * @desc Deactivate an active doctor account
 * @access Admin only
 * @param {string} doctorId - Doctor's MongoDB ID
 * @returns {Object} JSON response with deactivated doctor data
 * @example
 * PUT /api/admin/doctors/507f1f77bcf86cd799439011/deactivate
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: {...}, message: "Doctor deactivated successfully" }
 */
adminRoutes.put('/doctors/:doctorId/deactivate', deactivateDoctor);

/**
 * @route PUT /api/admin/doctors/:doctorId
 * @desc Update doctor information (non-sensitive fields only)
 * @access Admin only
 * @param {string} doctorId - Doctor's MongoDB ID
 * @body {Object} updateData - Data to update (name, lastname, phone, dateOfBirth, specialties)
 * @returns {Object} JSON response with updated doctor data
 * @example
 * PUT /api/admin/doctors/507f1f77bcf86cd799439011
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * Body: { "specialties": ["Cardiology", "Internal Medicine"] }
 * // Returns: { success: true, data: {...}, message: "Doctor updated successfully" }
 */
adminRoutes.put('/doctors/:doctorId', updateDoctor);

/**
 * @route DELETE /api/admin/doctors/:doctorId
 * @desc Delete doctor account completely from database
 * @access Admin only
 * @param {string} doctorId - Doctor's MongoDB ID
 * @returns {Object} JSON response with deleted doctor data
 * @example
 * DELETE /api/admin/doctors/507f1f77bcf86cd799439011
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: {...}, message: "Doctor deleted successfully" }
 */
adminRoutes.delete('/doctors/:doctorId', deleteDoctor);

// ===== PATIENT MANAGEMENT ROUTES =====

/**
 * @route PUT /api/admin/patients/:patientId/activate
 * @desc Activate a deactivated patient account
 * @access Admin only
 * @param {string} patientId - Patient's MongoDB ID
 * @returns {Object} JSON response with activated patient data
 * @example
 * PUT /api/admin/patients/507f1f77bcf86cd799439011/activate
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: {...}, message: "Patient activated successfully" }
 */
adminRoutes.put('/patients/:patientId/activate', activatePatient);

/**
 * @route PUT /api/admin/patients/:patientId/deactivate
 * @desc Deactivate an active patient account
 * @access Admin only
 * @param {string} patientId - Patient's MongoDB ID
 * @returns {Object} JSON response with deactivated patient data
 * @example
 * PUT /api/admin/patients/507f1f77bcf86cd799439011/deactivate
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: {...}, message: "Patient deactivated successfully" }
 */
adminRoutes.put('/patients/:patientId/deactivate', deactivatePatient);

/**
 * @route PUT /api/admin/patients/:patientId
 * @desc Update patient information (non-sensitive fields only)
 * @access Admin only
 * @param {string} patientId - Patient's MongoDB ID
 * @body {Object} updateData - Data to update (name, lastname, phone, dateOfBirth)
 * @returns {Object} JSON response with updated patient data
 * @example
 * PUT /api/admin/patients/507f1f77bcf86cd799439011
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * Body: { "phone": "+54 9 11 1234-5678" }
 * // Returns: { success: true, data: {...}, message: "Patient updated successfully" }
 */
adminRoutes.put('/patients/:patientId', updatePatient);

/**
 * @route DELETE /api/admin/patients/:patientId
 * @desc Delete patient account completely from database
 * @access Admin only
 * @param {string} patientId - Patient's MongoDB ID
 * @returns {Object} JSON response with deleted patient data
 * @example
 * DELETE /api/admin/patients/507f1f77bcf86cd799439011
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: {...}, message: "Patient deleted successfully" }
 */
adminRoutes.delete('/patients/:patientId', deletePatient);

export default adminRoutes;
