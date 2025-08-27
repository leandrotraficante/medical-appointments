import authService from '../services/auth.service.js';
import UserRepository from '../repositories/user.repository.js';
import { verifyToken } from '../utils/utils.js';

const userRepository = new UserRepository();

/**
 * Middleware to authenticate JWT tokens from request headers
 * Verifies token validity, decodes user information, and validates user existence and status
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 * @throws {Error} - If authentication fails, token is invalid, or user is deactivated
 * 
 * @example
 * // Basic usage
 * app.use('/protected', authenticateToken, (req, res) => {
 *   // req.user is now available with decoded token data
 *   res.json({ message: 'Access granted', userId: req.user.userId });
 * });
 * 
 * @example
 * // With role-based access
 * app.get('/admin', authenticateToken, requireRole(['admin']), adminController);
 * 
 * @example
 * // Token format in headers
 * Headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 */
export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication token is required. Please log in to continue' });
        }

        const decoded = await verifyToken(token);
        
        // Verificar que el usuario existe y está activo según su rol
        let user;
        switch (decoded.role) {
            case 'admin':
                user = await userRepository.findAdminById(decoded.userId);
                break;
            case 'doctor':
                user = await userRepository.findDoctorById(decoded.userId);
                break;
            case 'patient':
                user = await userRepository.findPatientById(decoded.userId);
                break;
            default:
                return res.status(401).json({ error: 'Invalid user role' });
        }
        
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Your account has been deactivated or not found. Please contact support' });
        }
        
        // Normalizar el objeto user para consistencia
        req.user = {
            id: decoded.userId,
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name
        };
        next();
    } catch (error) {
        if (error.message === 'Token has expired') {
            return res.status(401).json({ error: 'Your session has expired. Please log in again' });
        } else if (error.message === 'Invalid token') {
            return res.status(401).json({ error: 'Invalid or corrupted authentication token' });
        } else {
            return res.status(401).json({ error: 'Authentication failed. Please log in again' });
        }
    }
};

/**
 * Middleware factory to require specific user roles for access
 * Creates a middleware function that checks if the authenticated user has the required role
 * 
 * @param {string[]} allowedRoles - Array of roles that can access the route
 * @returns {Function} - Express middleware function that validates user role
 * 
 * @example
 * // Only admins can access
 * app.get('/admin', requireRole(['admin']), adminController);
 * 
 * @example
 * // Admins and doctors can access
 * app.get('/doctors', requireRole(['admin', 'doctor']), doctorController);
 * 
 * @example
 * // Multiple roles with different permissions
 * app.get('/appointments', requireRole(['admin', 'doctor', 'patient']), appointmentsController);
 * 
 * @example
 * // Usage in route definitions
 * router.get('/sensitive-data', authenticateToken, requireRole(['admin']), (req, res) => {
 *   // Only admins can access this route
 *   res.json({ data: 'Sensitive information' });
 * });
 */
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required. Please log in to continue' });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'You do not have permission to access this resource' });
        }
        
        next();
    };
};


