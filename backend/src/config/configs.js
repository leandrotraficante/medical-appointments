import dotenv from 'dotenv';

dotenv.config();

const configs = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URI,
    privateKeyJwt: process.env.PRIVATE_KEY_JWT,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN 
};

export const ROLE_CONFIG = {
    validRoles: ['admin', 'doctor', 'patient'],
    handlers: {
        admin: 'createAdmin',
        doctor: 'createDoctor',
        patient: 'createPatient'
    }
};

export default configs;