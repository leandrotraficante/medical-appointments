import AuthRepository from '../repositories/auth.repository.js';
import { UserAlreadyExists, InvalidCredentials } from '../utils/custom.exceptions.js';
import { createHash, isValidPassword, generateToken } from '../utils/utils.js';
import { ROLE_CONFIG } from '../config/configs.js';

const authRepository = new AuthRepository();

/**
 * Registers a new user in the system with the specified role
 * @param {Object} user - User data object
 * @param {string} user.name - User's full name
 * @param {string} user.email - User's email address
 * @param {string} user.personalId - User's personal ID/DNI
 * @param {string} user.password - User's plain text password (will be hashed)
 * @param {string} [user.lastname] - User's last name (optional)
 * @param {string} [user.dateOfBirth] - User's date of birth (optional)
 * @param {string} [user.phone] - User's phone number (optional)
 * @param {string} [user.license] - Doctor's license number (required if role is 'doctor')
 * @param {Array<string>} [user.specialties] - Doctor's specialties (required if role is 'doctor')
 * @param {string} role - User role: 'admin', 'doctor', or 'patient'
 * @returns {Promise<Object>} - Created user object without password
 * @throws {Error} - If user data is missing, role is invalid, or license missing for doctors
 * @throws {UserAlreadyExists} - If user with same email already exists
 * @example
 * const userData = {
 *   name: 'Dr. John Doe',
 *   email: 'john@example.com',
 *   personalId: '12345678',
 *   password: 'secure123',
 *   license: 'MD12345',
 *   specialties: ['Cardiology']
 * };
 * const newUser = await register(userData, 'doctor');
 */
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
    const newUser = { ...user, password: hashedPassword};

    return await authRepository[ROLE_CONFIG.handlers[role]](newUser);
};

/**
 * Authenticates a user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's plain text password
 * @returns {Promise<Object>} - Object containing JWT token and user data
 * @returns {string} returns.token - JWT token for authentication
 * @returns {Object} returns.user - User object without password
 * @throws {Error} - If email or password is missing
 * @throws {InvalidCredentials} - If user not found, account deactivated, or password invalid
 * @example
 * const result = await login('john@example.com', 'secure123');
 * // Returns: { token: 'jwt_token_here', user: { name: 'John', email: 'john@example.com', ... } }
 */
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
        token: token,
        user: user
    }
}

/**
 * Logs out the current user
 * In a JWT-based system, logout is typically handled client-side by removing the token
 * This function can be used for additional server-side cleanup if needed
 * @param {string} userId - User's MongoDB ID
 * @returns {Promise<Object>} - Logout confirmation
 * @example
 * const result = await logout('507f1f77bcf86cd799439011');
 * // Returns: { message: 'Logout successful', userId: '507f1f77bcf86cd799439011' }
 */
const logout = async (userId) => {
    // In a JWT system, logout is typically client-side
    // But we can add server-side logic here if needed (e.g., blacklisting tokens)
    
    return {
        message: 'Logout successful',
        userId: userId,
        clearCookie: true // Indicador para el controller borrar la cookie
    };
}

export default {
    register,
    login,
    logout
};