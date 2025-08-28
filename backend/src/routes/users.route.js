import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import {
    getAllDoctors,
    getAllPatients,
    findActiveDoctors,
    findActivePatients,
    findInactiveDoctors,
    findInactivePatients,
    searchUsers,
    getDoctorById,
    getPatientById,
    getMyProfile
} from '../controllers/users.controller.js';

/**
 * Router for user management endpoints
 * @type {express.Router}
 * @description Handles user queries, searches, and user list operations
 */
const usersRoutes = express.Router();

// ===== MIDDLEWARE =====
// All user routes require authentication
usersRoutes.use(authenticateToken);

// ===== USER MANAGEMENT ROUTES =====

/**
 * @route GET /api/users/doctors
 * @desc Get all doctors in the system
 * @access Admin and patients only
 * @returns {Object} JSON response with array of doctor objects
 * @example
 * GET /api/users/doctors
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 */
usersRoutes.get('/doctors', requireRole(['admin', 'patient']), getAllDoctors);

/**
 * @route GET /api/users/patients
 * @desc Get all patients in the system
 * @access Admin only
 * @returns {Object} JSON response with array of patient objects
 * @example
 * GET /api/users/patients
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 */
usersRoutes.get('/patients', requireRole(['admin']), getAllPatients);

/**
 * @route GET /api/users/active-doctors
 * @desc Get all active doctors in the system
 * @access Admin only
 * @returns {Object} JSON response with array of active doctor objects
 * @example
 * GET /api/users/active-doctors
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 */
usersRoutes.get('/active-doctors', requireRole(['admin']), findActiveDoctors);

/**
 * @route GET /api/users/active-patients
 * @desc Get all active patients in the system
 * @access Admin only
 * @returns {Object} JSON response with array of active patient objects
 * @example
 * GET /api/users/active-patients
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 */
usersRoutes.get('/active-patients', requireRole(['admin']), findActivePatients);

/**
 * @route GET /api/users/inactive-doctors
 * @desc Get all inactive doctors in the system
 * @access Admin only
 * @returns {Object} JSON response with array of inactive doctor objects
 * @example
 * GET /api/users/inactive-doctors
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 */
usersRoutes.get('/inactive-doctors', requireRole(['admin']), findInactiveDoctors);

/**
 * @route GET /api/users/inactive-patients
 * @desc Get all inactive patients in the system
 * @access Admin only
 * @returns {Object} JSON response with array of inactive patient objects
 * @example
 * GET /api/users/inactive-patients
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 */
usersRoutes.get('/inactive-patients', requireRole(['admin']), findInactivePatients);

/**
 * @route GET /api/users/search
 * @desc Unified search across all user types and fields
 * @access Admin only
 * @query {string} q - Search query to find users
 * @returns {Object} JSON response with matching users and their types
 * @example
 * GET /api/users/search?q=john
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns users with name, email, DNI, or specialty containing "john"
 */
usersRoutes.get('/search', requireRole(['admin']), searchUsers);

/**
 * @route GET /api/users/doctors/:doctorId
 * @desc Get a specific doctor by ID
 * @access Admin and patients only
 * @param {string} doctorId - Doctor's MongoDB ID
 * @returns {Object} JSON response with doctor data
 * @example
 * GET /api/users/doctors/507f1f77bcf86cd799439011
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 */
usersRoutes.get('/doctors/:doctorId', requireRole(['admin', 'patient']), getDoctorById);

/**
 * @route GET /api/users/patients/:patientId
 * @desc Get a specific patient by ID
 * @access Admin only
 * @param {string} patientId - Patient's MongoDB ID
 * @returns {Object} JSON response with patient data
 * @example
 * GET /api/users/patients/507f1f77bcf86cd799439011
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 */
usersRoutes.get('/patients/:patientId', requireRole(['admin']), getPatientById);

/**
 * @route GET /api/users/my-profile
 * @desc Get current user's profile information
 * @access Authenticated users (admin, doctor, patient)
 * @returns {Object} JSON response with user profile data
 * @example
 * GET /api/users/my-profile
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 * // Returns: { success: true, data: {...}, message: "Profile retrieved successfully" }
 */
usersRoutes.get('/my-profile', authenticateToken, getMyProfile);

export default usersRoutes;


