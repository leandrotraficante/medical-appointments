import express from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';

/**
 * Router for authentication-related endpoints
 * @type {express.Router}
 * @description Handles user registration, login, and logout operations
 */
const authRoutes = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user in the system
 * @access Public
 * @body {Object} userData - User registration data
 * @returns {Object} JSON response with user data and JWT token
 * @example
 * POST /api/auth/register
 * Body: {
 *   "name": "Dr. John Doe",
 *   "email": "john@example.com",
 *   "personalId": "12345678",
 *   "password": "secure123",
 *   "role": "doctor",
 *   "license": "MD12345",
 *   "specialties": ["Cardiology"]
 * }
 */
authRoutes.post('/register', register);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user with email and password
 * @access Public
 * @body {Object} credentials - User login credentials
 * @returns {Object} JSON response with JWT token and user data
 * @example
 * POST /api/auth/login
 * Body: {
 *   "email": "john@example.com",
 *   "password": "secure123"
 * }
 */
authRoutes.post('/login', login);

/**
 * @route GET /api/auth/logout
 * @desc Logout current user and clear session
 * @access Authenticated users
 * @returns {Object} JSON response confirming successful logout
 * @example
 * GET /api/auth/logout
 * Headers: { "Authorization": "Bearer <jwt_token>" }
 */
authRoutes.post('/logout', logout);

export default authRoutes;
