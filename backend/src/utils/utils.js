import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import configs from '../config/configs.js';

const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (plainPassword, hashedPassword) =>
    bcrypt.compareSync(plainPassword, hashedPassword);

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
