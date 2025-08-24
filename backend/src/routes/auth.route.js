import express from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/logout', logout);

export default authRoutes;
