import userService from "../services/user.service.js";
import { isValidObjectId } from "../utils/validation.js";
import configs, { ROLE_CONFIG } from '../config/configs.js';

/**
 * Retrieves all doctors from the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with doctors data
 * @example
 * GET /api/users/doctors
 * // Returns: { success: true, data: [doctor1, doctor2, ...] }
 */
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await userService.getAllDoctors()
        res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        if (error?.message === 'No doctors found') {
            res.status(404).json({ error: 'No doctors found' });
        } else {
            res.status(500).json({ error: 'Unable to get doctors. Please try again later' });
        }
    }
}

/**
 * Retrieves all patients from the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with patients data
 * @example
 * GET /api/users/patients
 * // Returns: { success: true, data: [patient1, patient2, ...] }
 */
const getAllPatients = async (req, res) => {
    try {
        const patients = await userService.getAllPatients()
        res.status(200).json({ success: true, data: patients });
    } catch (error) {
        if (error?.message === 'No patients found') {
            res.status(404).json({ error: 'No patients found' });
        } else {
            res.status(500).json({ error: 'Unable to get patients. Please try again later' });
        }
    }
}

/**
 * Retrieves all active doctors from the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with active doctors data
 * @example
 * GET /api/users/active-doctors
 * // Returns: { success: true, data: [activeDoctor1, activeDoctor2, ...] }
 */
const findActiveDoctors = async (req, res) => {
    try {
        const activeDoctors = await userService.findActiveDoctors();
        res.status(200).json({ success: true, data: activeDoctors });
    } catch (error) {
        if (error?.message === 'No active doctors found') {
            res.status(404).json({ error: 'No active doctors found' });
        } else {
            res.status(500).json({ error: 'Unable to get active doctors. Please try again later' });
        }
    }
}

/**
 * Retrieves all active patients from the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with active patients data
 * @example
 * GET /api/users/active-patients
 * // Returns: { success: true, data: [activePatient1, activePatient2, ...] }
 */
const findActivePatients = async (req, res) => {
    try {
        const activePatients = await userService.findActivePatients();
        res.status(200).json({ success: true, data: activePatients });
    } catch (error) {
        if (error?.message === 'No active patients found') {
            res.status(404).json({ error: 'No active patients found' });
        } else {
            res.status(500).json({ error: 'Unable to get active patients. Please try again later' });
        }
    }
}

/**
 * Retrieves all inactive doctors from the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with inactive doctors data
 * @example
 * GET /api/users/inactive-doctors
 * // Returns: { success: true, data: [inactiveDoctor1, inactiveDoctor2, ...] }
 */
const findInactiveDoctors = async (req, res) => {
    try {
        const inactiveDoctors = await userService.findInactiveDoctors();
        res.status(200).json({ success: true, data: inactiveDoctors });
    } catch (error) {
        if (error?.message === 'No inactive doctors found') {
            res.status(404).json({ error: 'No inactive doctors found' });
        } else {
            res.status(500).json({ error: 'Unable to get inactive doctors. Please try again later' });
        }
    }
}

/**
 * Retrieves all inactive patients from the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with inactive patients data
 * @example
 * GET /api/users/inactive-patients
 * // Returns: { success: true, data: [inactivePatient1, inactivePatient2, ...] }
 */
const findInactivePatients = async (req, res) => {
    try {
        const inactivePatients = await userService.findInactivePatients();
        res.status(200).json({ success: true, data: inactivePatients });
    } catch (error) {
        if (error?.message === 'No inactive patients found') {
            res.status(404).json({ error: 'No inactive patients found' });
        } else {
            res.status(500).json({ error: 'Unable to get inactive patients. Please try again later' });
        }
    }
}

/**
 * Finds a user by their ID and specific role
 * @param {Object} req - Express request object
 * @param {string} req.params.userId - User's MongoDB ID
 * @param {string} req.params.role - User role: 'admin', 'doctor', or 'patient'
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with user data
 * @throws {Error} - If user ID or role is missing, invalid ID format, or invalid role
 * @example
 * GET /api/users/users/507f1f77bcf86cd799439011/doctor
 * // Returns: { success: true, data: { user details } }
 */
const findUserByIdAndRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    if (!role) {
        return res.status(400).json({ error: 'Role is required' });
    }

    if (!isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (!ROLE_CONFIG.validRoles.includes(role)) {
        return res.status(400).json({ 
            error: `Invalid role. Allowed values: ${ROLE_CONFIG.validRoles.join(', ')}` 
        });
    }

    try {
        const userByIdAndRole = await userService.findUserByIdAndRole(userId, role);
        res.status(200).json({ success: true, data: userByIdAndRole });
    } catch (error) {
        res.status(500).json({ error: 'Unable to get user. Please try again later' });
    }
}

/**
 * Finds a doctor by their medical license number
 * @param {Object} req - Express request object
 * @param {string} req.params.license - Doctor's medical license number
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with doctor data
 * @throws {Error} - If license is missing or doctor not found
 * @example
 * GET /api/users/doctors/license/MD12345
 * // Returns: { success: true, data: { doctor details } }
 */
const findDoctorByLicense = async (req, res) => {
    const { license } = req.params;
    
    if (!license) {
        return res.status(400).json({ error: 'License is required' });
    }
    
    try {
        const doctor = await userService.findDoctorByLicense(license);
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        if (error?.message === 'Doctor not found') {
            res.status(404).json({ error: 'Doctor not found' });
        } else {
            res.status(500).json({ error: 'Unable to get doctor. Please try again later' });
        }
    }
}

/**
 * Finds a doctor by their personal ID/DNI
 * @param {Object} req - Express request object
 * @param {string} req.params.personalId - Doctor's personal ID/DNI
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with doctor data
 * @throws {Error} - If personal ID is missing or doctor not found
 * @example
 * GET /api/users/doctors/personal-id/87654321
 * // Returns: { success: true, data: { doctor details } }
 */
const findDoctorByPersonalId = async (req, res) => {
    const { personalId } = req.params;
    
    if (!personalId) {
        return res.status(400).json({ error: 'Personal ID is required' });
    }
    
    try {
        const doctor = await userService.findDoctorByPersonalId(personalId);
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        if (error?.message === 'Doctor not found') {
            res.status(404).json({ error: 'Doctor not found' });
        } else {
            res.status(500).json({ error: 'Unable to get doctor. Please try again later' });
        }
    }
}

/**
 * Finds a doctor by their email address
 * @param {Object} req - Express request object
 * @param {string} req.params.email - Doctor's email address
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with doctor data
 * @throws {Error} - If email is missing or doctor not found
 * @example
 * GET /api/users/doctors/email/john.doe@hospital.com
 * // Returns: { success: true, data: { doctor details } }
 */
const findDoctorByEmail = async (req, res) => {
    const { email } = req.params;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    try {
        const doctor = await userService.findDoctorByEmail(email);
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        if (error?.message === 'Doctor not found') {
            res.status(404).json({ error: 'Doctor not found' });
        } else {
            res.status(500).json({ error: 'Unable to get doctor. Please try again later' });
        }
    }
}

/**
 * Finds a patient by their personal ID/DNI
 * @param {Object} req - Express request object
 * @param {string} req.params.personalId - Patient's personal ID/DNI
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with patient data
 * @throws {Error} - If personal ID is missing or patient not found
 * @example
 * GET /api/users/patients/personal-id/11223344
 * // Returns: { success: true, data: { patient details } }
 */
const findPatientByPersonalId = async (req, res) => {
    const { personalId } = req.params;
    
    if (!personalId) {
        return res.status(400).json({ error: 'Personal ID is required' });
    }
    
    try {
        const patient = await userService.findPatientByPersonalId(personalId);
        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        if (error?.message === 'Patient not found') {
            res.status(404).json({ error: 'Patient not found' });
        } else {
            res.status(500).json({ error: 'Unable to get patient. Please try again later' });
        }
    }
}

/**
 * Finds a patient by their email address
 * @param {Object} req - Express request object
 * @param {string} req.params.email - Patient's email address
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with patient data
 * @throws {Error} - If email is missing or patient not found
 * @example
 * GET /api/users/patients/email/jane.smith@email.com
 * // Returns: { success: true, data: { patient details } }
 */
const findPatientByEmail = async (req, res) => {
    const { email } = req.params;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    try {
        const patient = await userService.findPatientByEmail(email);
        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        if (error?.message === 'Patient not found') {
            res.status(404).json({ error: 'Patient not found' });
        } else {
            res.status(500).json({ error: 'Unable to get patient. Please try again later' });
        }
    }
}

/**
 * Searches for doctors by name (partial match)
 * @param {Object} req - Express request object
 * @param {string} req.query.searchTerm - Search term for doctor's name
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with matching doctors
 * @throws {Error} - If search term is missing or no doctors found
 * @example
 * GET /api/users/doctors-by-name?searchTerm=John
 * // Returns: { success: true, data: [doctor1, doctor2, ...] }
 */
const searchDoctorsByName = async (req, res) => {
    const { searchTerm } = req.query;
    
    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ error: 'Search term is required' });
    }
    
    try {
        const doctors = await userService.searchDoctorsByName(searchTerm);
        res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        if (error?.message === 'No doctors found with that name') {
            res.status(404).json({ error: 'No doctors found with that name' });
        } else {
            res.status(500).json({ error: 'Unable to search doctors. Please try again later' });
        }
    }
}

/**
 * Searches for patients by name (partial match)
 * @param {Object} req - Express request object
 * @param {string} req.query.searchTerm - Search term for patient's name
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with matching patients
 * @throws {Error} - If search term is missing or no patients found
 * @example
 * GET /api/users/patients-by-name?searchTerm=Jane
 * // Returns: { success: true, data: [patient1, patient2, ...] }
 */
const searchPatientsByName = async (req, res) => {
    const { searchTerm } = req.query;
    
    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ error: 'Search term is required' });
    }
    
    try {
        const patients = await userService.searchPatientsByName(searchTerm);
        res.status(200).json({ success: true, data: patients });
    } catch (error) {
        if (error?.message === 'No patients found with that name') {
            res.status(404).json({ error: 'No patients found with that name' });
        } else {
            res.status(500).json({ error: 'Unable to search patients. Please try again later' });
        }
    }
}

export {
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
};