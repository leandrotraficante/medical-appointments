import authService from '../services/auth.service.js';

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '') || 
                     req.cookies?.token || 
                     req.body?.token;

        if (!token) {
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.status(401).send({ error: 'Unauthorized' });
            }
            return res.redirect('/login');
        }

        const decoded = await authService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        return res.redirect('/login');
    }
};

// Middleware to require specific roles
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.status(401).send({ error: 'Unauthorized' });
            }
            return res.redirect('/login');
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.status(403).send({ error: 'Forbidden' });
            }
            return res.status(403).render('error', { 
                title: 'Access Denied',
                message: 'You do not have permission to access this page'
            });
        }
        
        next();
    };
};

// Middleware to check if user is authenticated (for login/register pages)
export const redirectIfAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '') || 
                     req.cookies?.token || 
                     req.body?.token;

        if (token) {
            try {
                const decoded = await authService.verifyToken(token);
                if (decoded) {
                    // Redirect based on role
                    switch (decoded.role) {
                        case 'admin':
                            return res.redirect('/admin');
                        case 'doctor':
                            return res.redirect('/doctor');
                        case 'patient':
                            return res.redirect('/patient');
                        default:
                            return res.redirect('/login');
                    }
                }
            } catch (error) {
                // Token invalid, continue to next middleware
            }
        }
        next();
    } catch (error) {
        next();
    }
};
