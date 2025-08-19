import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import configs from '../config/configs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __mainDirname = path.join(__dirname, '..',)

const generateToken = (user) => {
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role },
        configs.privateKeyJwt, { expiresIn: configs.jwtExpiresIn });
    return token;
};

const authorization = (role) => {
    return async (req, res, next) => {
        if (req.user.role !== role) return res.status(403).send({ status: 'error', message: 'Access denied' })
        next();
    }
};

const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (plainPassword, hashedPassword) =>
    bcrypt.compareSync(plainPassword, hashedPassword);

export {
    generateToken,
    authorization,
    createHash,
    isValidPassword
}
