import express from 'express';
import { register, login, logout, validateToken } from '../controllers/auth.controller.js';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.get('/logout', logout);
authRoutes.post('/validateToken', validateToken);

export default authRoutes;
