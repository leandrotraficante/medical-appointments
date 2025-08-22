import AuthRepository from '../repositories/auth.repository.js';
import { UserAlreadyExists, InvalidCredentials } from '../utils/custom.exceptions.js';
import { createHash, isValidPassword } from '../utils/utils.js';
import configs, { ROLE_CONFIG } from '../config/configs.js';
import jwt from 'jsonwebtoken';

const authRepository = new AuthRepository();

// User registration
const register = async (user, role) => {
    if (!user || !role) {
        throw new Error('User and role are required');
    }

    if (!ROLE_CONFIG.validRoles.includes(role)) {
        throw new Error(`Invalid role: ${role}`);
    }

    const existingUser = await authRepository.checkEmailExists(user.email);
    if (existingUser) {
        throw new UserAlreadyExists('User already exists.');
    }

    const hashedPassword = createHash(user.password);
    const newUser = { ...user, password: hashedPassword };

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
        access_token: token,
        user: user
    }
}

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role,
            name: user.name
        },
        configs.privateKeyJwt,
        { expiresIn: configs.jwtExpiresIn }
    );
}

// Verify JWT token
const verifyToken = async (token) => {
    if (!token) {
        throw new Error('Token is required');
    }

    try {
        return jwt.verify(token, configs.privateKeyJwt);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else {
            throw new Error('Invalid token');
        }
    }
};

export default {
    register,
    login,
    generateToken,
    verifyToken
};