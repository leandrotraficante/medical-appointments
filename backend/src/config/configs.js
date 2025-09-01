/**
 * Main configuration object containing environment variables
 * @type {Object}
 * @property {string|undefined} port - Server port from environment
 * @property {string|undefined} mongoUrl - MongoDB connection string
 * @property {string|undefined} privateKeyJwt - Secret key for JWT signing
 * @property {string|undefined} jwtExpiresIn - JWT token expiration time
 */
const configs = {
    PORT: process.env.PORT,
    mongoUrl: process.env.MONGO_URI,
    privateKeyJwt: process.env.PRIVATE_KEY_JWT,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN 
};

/**
 * Configuration for user roles and their creation handlers
 * @type {Object}
 * @property {string[]} validRoles - Array of valid user roles
 * @property {Object} handlers - Mapping of roles to creation methods
 * @property {string} handlers.admin - Method name for creating admin users
 * @property {string} handlers.doctor - Method name for creating doctor users
 * @property {string} handlers.patient - Method name for creating patient users
 */
export const ROLE_CONFIG = {
    validRoles: ['admin', 'doctor', 'patient'],
    handlers: {
        admin: 'createAdmin',
        doctor: 'createDoctor',
        patient: 'createPatient'
    }
};

export default configs;