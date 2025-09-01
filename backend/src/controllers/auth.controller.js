import authService from '../services/auth.service.js';
import { generateToken } from '../utils/utils.js';

const register = async (req, res) => {
    try {

        const { name, lastname, email, personalId, dateOfBirth, phone, password, role, license, specialties } = req.body;

        if (!name || !email || !personalId || !password || !role) {
            return res.status(400).json({ 
                success: false,
                error: 'Name, email, personal ID, password and role are required' 
            });
        }

        if (dateOfBirth && isNaN(new Date(dateOfBirth).getTime())) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid date format' 
            });
        }

        const userData = {
            name,
            email: email.toLowerCase(),
            personalId,
            password,
            phone,
            dateOfBirth,
            ...(lastname && { lastname }),
            ...(role === 'doctor' && license && { license }),
            ...(role === 'doctor' && specialties && { specialties: Array.isArray(specialties) ? specialties : [specialties] })
        };

        const user = await authService.register(userData, role);

        if (!user) {
            return res.status(400).json({ 
                success: false,
                error: 'Cannot create user: email already exists' 
            });
        }
        
        // Solo generar token si NO viene de la ruta de admin (create-doctor)
        if (req.originalUrl !== '/api/auth/create-doctor') {
            const token = generateToken(user);

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });
        }

        res.status(201).json({
            success: true,
            user: user,
            message: 'User registered successfully'
        });
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
        }

        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: validationErrors
            });
            
        }

        if (error.code === 11000) {
            return res.status(409).json({ 
                success: false,
                error: 'User already exists' 
            });
        }

        return res.status(500).json({ 
            success: false,
            error: error.message || 'Internal server error' 
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Email and password are required' 
            });
        }

        const result = await authService.login(email.toLowerCase(), password);

        if (!result) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid credentials' 
            });
        }

        res.cookie('jwt', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            user: result.user,
            message: 'Login successful'
        });
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            res.status(401).json({ 
                success: false,
                error: 'Invalid email or password' 
            });
        } else if (error.message === 'User account is deactivated') {
            res.status(403).json({ 
                success: false,
                error: 'Your account has been deactivated. Please contact support' 
            });
        } else {
            res.status(500).json({ 
                success: false,
                error: 'Unable to log in. Please try again later' 
            });
        }
    }
};

const logout = async (req, res) => {
    try {
        const userId = req.user?.userId || 'unknown';
        
        // Lógica simple sin service
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            success: true,
            message: 'Logout successful',
            userId: userId
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: 'Unable to log out. Please try again later' 
        });
    }
};

export {
    register,
    login,
    logout
};