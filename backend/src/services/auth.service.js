import AuthRepository from '../repositories/auth.repository.js';
import { UserAlreadyExists, InvalidCredentials } from '../utils/custom.exceptions.js';
import { createHash, isValidPassword, generateToken } from '../utils/utils.js';
import { ROLE_CONFIG } from '../config/configs.js';

const authRepository = new AuthRepository();

const register = async (user, role) => {
    if (!user || !role) {
        throw new Error('User and role are required');
    }

    if (!ROLE_CONFIG.validRoles.includes(role)) {
        throw new Error(`Invalid role: ${role}`);
    }

    if (role === 'doctor' && !user.license) {
        throw new Error('License is required for doctors');
    }

    const existingUser = await authRepository.checkEmailExists(user.email);
    if (existingUser) {
        throw new UserAlreadyExists('User already exists.');
    }

    const hashedPassword = createHash(user.password);
    const newUser = { ...user, password: hashedPassword };

    return await authRepository[ROLE_CONFIG.handlers[role]](newUser);
};

const login = async (email, password) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const user = await authRepository.checkEmailExists(email);
    if (!user) {
        throw new InvalidCredentials('Invalid credentials');
    }

    if (!user.isActive) {
        throw new InvalidCredentials('User account is deactivated');
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

export default {
    register,
    login
};