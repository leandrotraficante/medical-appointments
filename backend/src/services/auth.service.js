import AuthRepository from '../repositories/auth.repository.js';
import { UserAlreadyExists, InvalidCredentials } from '../utils/custom.exceptions.js';
import { createHash, generateToken, isValidPassword } from '../utils/utils.js';
import { ROLE_CONFIG } from '../config/configs.js';

const authRepository = new AuthRepository();

// User registration
const register = async (user, role) => {
    // Basic validations
    if (!user || !role) {
        throw new Error('User and role are required');
    }

    if (!ROLE_CONFIG.validRoles.includes(role)) {
        throw new Error(`Invalid role: ${role}. Valid roles: ${ROLE_CONFIG.validRoles.join(', ')}`);
    }

    const existingUser = await authRepository.checkEmailExists(user.email);

    if (existingUser) {
        throw new UserAlreadyExists('User already exists.');
    }

    const hashedPassword = createHash(user.password);

    const newUser = {
        ...user,
        password: hashedPassword,
    };

    // Direct call to repository method
    return await authRepository[ROLE_CONFIG.handlers[role]](newUser);
};

// User login
const login = async (email, password) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const user = await authRepository.checkEmailExists(email);

    if (!user) {
        throw new InvalidCredentials('Invalid credentials');
    }

    const comparePassword = isValidPassword(password, user.password);

    if (!comparePassword) {
        throw new InvalidCredentials('Invalid credentials');
    }

    const token = generateToken(user);

    return {
        status: 'success',
        message: 'Login successful',
        access_token: token
    }
}

// Logout (invalidate token)
const logout = async (token) => {
    if (!token) {
        throw new Error('Token is required');
    }

    // Verify token is valid before logout
    try {
        const decoded = await verifyToken(token);

        return {
            status: 'success',
            message: 'Logout successful',
            user: {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            }
        };
    } catch (error) {
        throw new Error(`Logout failed: ${error.message}`);
    }
};

// Verify JWT token
const verifyToken = async (token) => {
    if (!token) {
        throw new Error('Token is required');
    }

    try {
        const decoded = jwt.verify(token, configs.privateKeyJwt);
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        } else {
            throw new Error('Token verification failed');
        }
    }
};

export {
    register,
    login,
    logout,
    verifyToken
};