import authService from '../services/auth.service.js';
import UserRepository from '../repositories/user.repository.js';
import { verifyToken } from '../utils/utils.js';

const userRepository = new UserRepository();

/**
 * Middleware to authenticate JWT tokens from request headers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 * @throws {Error} - If authentication fails
 * @example
 * app.use('/protected', authenticateToken, (req, res) => {
 *   // req.user is now available with decoded token data
 *   res.json({ message: 'Access granted' });
 * });
 */
export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication token is required. Please log in to continue' });
        }

        const decoded = await verifyToken(token);
        
        const user = await userRepository.findUserByIdAndRole(decoded.userId, decoded.role);
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Your account has been deactivated or not found. Please contact support' });
        }
        
        req.user = decoded;
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
 * @param {string[]} allowedRoles - Array of roles that can access the route
 * @returns {Function} - Express middleware function
 * @example
 * // Only admins can access
 * app.get('/admin', requireRole(['admin']), adminController);
 * 
 * // Admins and doctors can access
 * app.get('/doctors', requireRole(['admin', 'doctor']), doctorController);
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


