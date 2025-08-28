import authService from '../services/auth.service.js';
import UserRepository from '../repositories/user.repository.js';
import { verifyToken } from '../utils/utils.js';

const userRepository = new UserRepository();

export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: 'Authentication token is required. Please log in to continue' });
        }

        const decoded = await verifyToken(token);
        
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


