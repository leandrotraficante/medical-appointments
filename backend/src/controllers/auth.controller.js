import authService from '../services/auth.service.js';

const register = async (req, res) => {
    try {
        const { name, lastname, email, personalId, dateOfBirth, phone, password, role, license, specialties } = req.body;

        if (!name || !email || !personalId || !password || !role) {
            return res.status(400).json({ error: 'Name, email, personal ID, password and role are required' });
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

        const token = await authService.generateToken(user);
        
        res.status(201).json({
            user: user,
            token: token,
            message: 'User registered successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(401).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const validateToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const decoded = await authService.verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        res.status(200).json({
            message: 'Token is valid',
            user: {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            }
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export {
    register,
    login,
    logout,
    validateToken
};