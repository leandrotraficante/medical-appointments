import dotenv from 'dotenv';

dotenv.config();

const configs = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    privateKeyJwt: process.env.PRIVATE_KEY_JWT,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN 
};

// Role configuration and handlers
export const ROLE_CONFIG = {
    validRoles: ['admin', 'doctor', 'patient'],
    handlers: {
        admin: 'createAdmin',
        doctor: 'createDoctor',
        patient: 'createPatient'
    }
};

export default configs;