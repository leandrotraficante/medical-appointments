import authService from '../services/auth.service.js';

const register = async (req, res) => {
    try {
        const { name, lastname, email, personalId, dateOfBirth, phone, password, role } = req.body;

        if (!name || !email || !personalId || !password || !role) {
            return res.status(400).send({ error: 'Name, email, personal ID, password and role are required' });
        }

        if (!email && !phone) {
            return res.status(400).send({ error: 'At least one contact method (email or phone) is required' });
        }

        if (dateOfBirth) {
            const birthDate = new Date(dateOfBirth);
            if (isNaN(birthDate.getTime())) {
                return res.status(400).send({ error: 'Invalid date of birth' });
            }
        }

        const userData = { 
            name, 
            email: email?.toLowerCase(), 
            personalId, 
            password,
            ...(lastname && { lastname }),
            ...(dateOfBirth && { dateOfBirth }),
            ...(phone && { phone })
        };
        
        const user = await authService.register(userData, role);

        if (!user) {
            return res.status(400).send({ error: 'Cannot create user: email already exists' });
        }

        // Generate token for auto-login after registration
        const token = await authService.generateToken(user);
        
        // Set token in cookie for auto-login
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // If the request is from a browser form submission (Accept: text/html), redirect
        if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return res.redirect('/patient');
        }

        res.status(201).send({
            user: user,
            token: token,
            redirectUrl: '/patient',
            message: 'Patient registered successfully'
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.log(error)
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.status(400).render('login', { title: 'Login', error: 'Invalid credentials.' });
            }
            return res.status(400).send({ error: 'Invalid credentials.' });
        }

        const result = await authService.login(email?.toLowerCase(), password);

        if (!result) {
            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.status(401).render('login', { title: 'Login', error: 'Invalid credentials.' });
            }
            return res.status(401).send({ error: 'Invalid credentials.' });
        }
        // Set token in cookie
        res.cookie('token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // If the request is from the login form (HTML), redirect by role
        if (req.headers.accept && req.headers.accept.includes('text/html')) {
            switch (result.user?.role) {
                case 'admin':
                    return res.redirect('/admin');
                case 'doctor':
                    return res.redirect('/doctor');
                case 'patient':
                default:
                    return res.redirect('/patient');
            }
        }

        res.status(200).send({
            token: result.access_token,
            message: result.message,
            user: {
                userId: result.user?._id || result.user?.userId,
                email: result.user?.email,
                role: result.user?.role,
                name: result.user?.name
            }
        });
    } catch (error) {
        if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return res.status(401).render('login', { title: 'Login', error: 'Invalid credentials.' });
        }
        res.status(401).send({ error: 'Invalid credentials.' });
    }
};

const logout = async (req, res) => {
    try {
        // JWT es stateless: alcanza con borrar la cookie del cliente
        res.clearCookie('token');

        if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return res.redirect('/login');
        }

        res.status(200).send({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const validateToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).send({ error: 'Token is required' });
        }

        const decoded = await authService.verifyToken(token);

        if (!decoded) {
            return res.status(401).send({ error: 'Invalid token' });
        }

        res.status(200).send({
            message: 'Token is valid',
            user: {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            }
        });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
};




export {
    register,
    login,
    logout,
    validateToken
};