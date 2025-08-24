import authService from '../services/auth.service.js';
import { generateToken } from '../utils/utils.js';

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
            token: result.access_token,
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

const logout = async (req, res) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: 'Unable to log out. Please try again later' });
    }
};

export {
    register,
    login,
    logout
};