import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import {
    getAllDoctors,
    getAllPatients,
    findActiveDoctors,
    findActivePatients,
    findInactiveDoctors,
    findInactivePatients,
    findUserByIdAndRole,
    findDoctorByLicense,
    findDoctorByPersonalId,
    findDoctorByEmail,
    findPatientByPersonalId,
    findPatientByEmail,
    searchDoctorsByName,
    searchPatientsByName
} from '../controllers/users.controller.js';

const usersRoutes = express.Router();

usersRoutes.get('/doctors', authenticateToken, requireRole(['admin']), getAllDoctors);
usersRoutes.get('/patients', authenticateToken, requireRole(['admin']), getAllPatients);
usersRoutes.get('/active-doctors', authenticateToken, requireRole(['admin']), findActiveDoctors);
usersRoutes.get('/active-patients', authenticateToken, requireRole(['admin']), findActivePatients);
usersRoutes.get('/inactive-doctors', authenticateToken, requireRole(['admin']), findInactiveDoctors);
usersRoutes.get('/inactive-patients', authenticateToken, requireRole(['admin']), findInactivePatients);

usersRoutes.get('/users/:userId/:role', authenticateToken, requireRole(['admin']), findUserByIdAndRole);
usersRoutes.get('/doctors/license/:license', authenticateToken, requireRole(['admin']), findDoctorByLicense);
usersRoutes.get('/doctors/personal-id/:personalId', authenticateToken, requireRole(['admin']), findDoctorByPersonalId);
usersRoutes.get('/doctors/email/:email', authenticateToken, requireRole(['admin']), findDoctorByEmail);
usersRoutes.get('/patients/personal-id/:personalId', authenticateToken, requireRole(['admin']), findPatientByPersonalId);
usersRoutes.get('/patients/email/:email', authenticateToken, requireRole(['admin']), findPatientByEmail);

usersRoutes.get('/doctors-by-name', authenticateToken, requireRole(['admin']), searchDoctorsByName);
usersRoutes.get('/patients-by-name', authenticateToken, requireRole(['admin']), searchPatientsByName);

export default usersRoutes;


