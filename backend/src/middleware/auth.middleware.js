import authService from '../services/auth.service.js';
import UserRepository from '../repositories/user.repository.js';

const userRepository = new UserRepository();

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = await authService.verifyToken(token);
        
        // Verificar que el usuario siga activo
        const user = await userRepository.findUserByIdAndType(decoded.userId, decoded.role);
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'User account is deactivated or not found' });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware to require specific roles
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        
        next();
    };
};


