import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import configs from '../config/configs.js';

/**
 * Creates a secure hash from a plain text password using bcrypt
 * @param {string} password - The plain text password to hash
 * @returns {string} - The hashed password
 * @example
 * const hashedPassword = createHash('myPassword123');
 * // Returns: '$2a$10$...'
 */
const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

/**
 * Validates a plain text password against a hashed password
 * @param {string} plainPassword - The plain text password to validate
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {boolean} - True if passwords match, false otherwise
 * @example
 * const isValid = isValidPassword('myPassword123', hashedPassword);
 * // Returns: true or false
 */
const isValidPassword = (plainPassword, hashedPassword) =>
    bcrypt.compareSync(plainPassword, hashedPassword);

/**
 * Generates a JWT token for user authentication
 * @param {Object} user - The user object containing user data
 * @param {string} user._id - User's MongoDB ID
 * @param {string} user.email - User's email address
 * @param {string} user.role - User's role (admin, doctor, patient)
 * @param {string} user.name - User's name
 * @returns {string} - The generated JWT token
 * @example
 * const token = generateToken({
 *   _id: '507f1f77bcf86cd799439011',
 *   email: 'user@example.com',
 *   role: 'admin',
 *   name: 'John Doe'
 * });
 */
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

/**
 * Verifies and decodes a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object} - The decoded token payload containing userId, email, role, name
 * @throws {Error} - If token is missing, invalid, or expired
 * @example
 * try {
 *   const decoded = await verifyToken('eyJhbGciOiJIUzI1NiIs...');
 *   console.log(decoded.userId); // '507f1f77bcf86cd799439011'
 * } catch (error) {
 *   console.error('Token verification failed:', error.message);
 * }
 */
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

export {
    createHash,
    isValidPassword,
    generateToken,
    verifyToken
};
