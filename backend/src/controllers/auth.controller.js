import authService from '../services/auth.service.js';
import { generateToken } from '../utils/utils.js';

/**
 * Registers a new user in the system with the specified role
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user data
 * @param {string} req.body.name - User's full name (required)
 * @param {string} req.body.lastname - User's last name (optional)
 * @param {string} req.body.email - User's email address (required)
 * @param {string} req.body.personalId - User's personal ID/DNI (required)
 * @param {string} req.body.dateOfBirth - User's date of birth (optional)
 * @param {string} req.body.phone - User's phone number (optional)
 * @param {string} req.body.password - User's password (required)
 * @param {string} req.body.role - User role: 'admin', 'doctor', or 'patient' (required)
 * @param {string} req.body.license - Doctor's license number (required if role is 'doctor')
 * @param {string|Array} req.body.specialties - Doctor's specialties (required if role is 'doctor')
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with user data and JWT token
 * @throws {Error} - If validation fails or user creation fails
 * @example
 * POST /api/auth/register
 * Body: {
 *   "name": "Dr. John Doe",
 *   "email": "john@example.com",
 *   "personalId": "12345678",
 *   "password": "secure123",
 *   "role": "doctor",
 *   "license": "MD12345",
 *   "specialties": ["Cardiology", "Internal Medicine"]
 * }
 */
const register = async (req, res) => {
    try {
        const { name, lastname, email, personalId, dateOfBirth, phone, password, role, license, specialties } = req.body;

        if (!name || !email || !personalId || !password || !role) {
            return res.status(400).json({ error: 'Name, email, personal ID, password and role are required' });
        }

        if (dateOfBirth && isNaN(new Date(dateOfBirth).getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const userData = { 
            name, 
            email: email.toLowerCase(), 
            personalId, 
            password,
            ...(lastname && { lastname }),
            ...(dateOfBirth && { dateOfBirth }),
            ...(phone && { phone }),
            ...(role === 'doctor' && license && { license }),
            ...(role === 'doctor' && specialties && { specialties: Array.isArray(specialties) ? specialties : [specialties] })
        };
        
        const user = await authService.register(userData, role);

        if (!user) {
            return res.status(400).json({ error: 'Cannot create user: email already exists' });
        }

        const token = generateToken(user);
        
        res.status(201).json({
            user: user,
            token: token,
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error('Error in register:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                error: 'Validation error',
                details: validationErrors 
            });
        }
        
        if (error.code === 11000) {
            return res.status(409).json({ error: 'User already exists' });
        }
        
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

/**
 * Authenticates a user with email and password
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing credentials
 * @param {string} req.body.email - User's email address (required)
 * @param {string} req.body.password - User's password (required)
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with JWT token and user data
 * @throws {Error} - If credentials are invalid or account is deactivated
 * @example
 * POST /api/auth/login
 * Body: {
 *   "email": "john@example.com",
 *   "password": "secure123"
 * }
 * // Returns: { token: "jwt_token_here", user: {...}, message: "Login successful" }
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await authService.login(email.toLowerCase(), password);

        if (!result) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({
            token: result.token,
            user: result.user,
            message: 'Login successful'
        });
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            res.status(401).json({ error: 'Invalid email or password' });
        } else if (error.message === 'User account is deactivated') {
            res.status(403).json({ error: 'Your account has been deactivated. Please contact support' });
        } else {
            res.status(500).json({ error: 'Unable to log in. Please try again later' });
        }
    }
};

/**
 * Logs out the current user (clears session)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response confirming successful logout
 * @example
 * GET /api/auth/logout
 * // Returns: { message: "Logout successful" }
 */
const logout = async (req, res) => {
    try {
        // Get user ID from authenticated request (if using middleware)
        const userId = req.user?.userId || 'unknown';
        
        const result = await authService.logout(userId);
        
        // 🍪 BORRAR LA COOKIE JWT PARA CERRAR LA SESIÓN
        res.clearCookie('jwt'); // Si usas cookie para JWT
        res.clearCookie('token'); // Si usas cookie llamada 'token'
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Unable to log out. Please try again later' });
    }
};

export {
    register,
    login,
    logout
};