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
 * Unified flexible search function that searches across all fields and user types
 * @param {Object} req - Express request object
 * @param {string} req.query.q - Search query (searches in all relevant fields)
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with matching users and their types
 * @throws {Error} - If search query is missing or empty
 * @example
 * GET /api/users/search?q=john
 * // Returns: { success: true, data: [{ user: {...}, type: 'doctor' }, { user: {...}, type: 'patient' }] }
 * 
 * GET /api/users/search?q=123
 * // Returns: users with DNI, license, or name containing "123"
 * 
 * GET /api/users/search?q=cardiology
 * // Returns: doctors with specialty containing "cardiology"
 */
const searchUsers = async (req, res) => {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
        return res.status(400).json({ error: 'Search query is required' });
    }
    
    try {
        const results = await userService.searchUsers(q);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'No users found matching your search' });
        }
        
        res.status(200).json({ 
            success: true, 
            data: results,
            message: `Found ${results.length} user(s) matching "${q}"`
        });
    } catch (error) {
        if (error?.message === 'Search query is required') {
            res.status(400).json({ error: 'Search query is required' });
        } else {
            res.status(500).json({ error: 'Unable to search users. Please try again later' });
        }
    }
};

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
 * GET /api/users/doctors/personal-id/11223344
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
 * GET /api/users/doctors/email/jane.smith@email.com
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
 * GET /api/users/doctors-by-name?searchTerm=Jane
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

/**
 * Retrieves a specific doctor by ID
 * @param {Object} req - Express request object
 * @param {string} req.params.doctorId - Doctor's MongoDB ID
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with doctor data
 * @throws {Error} - If doctor ID is invalid or doctor not found
 * @example
 * GET /api/users/doctors/507f1f77bcf86cd799439011
 * // Returns: { success: true, data: { doctor details } }
 */
const getDoctorById = async (req, res) => {
    const { doctorId } = req.params;
    
    if (!doctorId) {
        return res.status(400).json({ error: 'Doctor ID is required' });
    }
    
    try {
        const doctor = await userService.findDoctorById(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ error: 'Unable to get doctor. Please try again later' });
    }
}

/**
 * Retrieves a specific patient by ID
 * @param {Object} req - Express request object
 * @param {string} req.params.patientId - Patient's MongoDB ID
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with patient data
 * @throws {Error} - If patient ID is invalid or patient not found
 * @example
 * GET /api/users/patients/507f1f77bcf86cd799439011
 * // Returns: { success: true, data: { patient details } }
 */
const getPatientById = async (req, res) => {
    const { patientId } = req.params;
    
    if (!patientId) {
        return res.status(400).json({ error: 'Patient ID is required' });
    }
    
    try {
        const patient = await userService.findPatientById(patientId);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        res.status(500).json({ error: 'Unable to get patient. Please try again later' });
    }
}

const getMyProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userId = req.user.userId;
        const userRole = req.user.role;

        // Usar el service en lugar de llamar directamente al repository
        const userProfile = await userService.getMyProfile(userId, userRole);

        // Calcular edad si hay fecha de nacimiento
        let age = null;
        if (userProfile.dateOfBirth) {
            const birthDate = new Date(userProfile.dateOfBirth);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }

        // Retornar solo datos no sensibles
        const profileData = {
            name: userProfile.name,
            lastname: userProfile.lastname || null,
            age: age,
            phone: userProfile.phone || null,
            email: userProfile.email,
            role: userProfile.role
        };

        // Agregar datos específicos según el rol
        if (userRole === 'doctor') {
            profileData.specialties = userProfile.specialties || [];
            profileData.license = userProfile.license || null;
        }

        res.status(200).json({
            success: true,
            data: profileData,
            message: 'Profile retrieved successfully'
        });

    } catch (error) {
        console.error('Error getting profile:', error);
        
        if (error.message === 'User profile not found') {
            return res.status(404).json({ error: 'User profile not found' });
        }
        
        res.status(500).json({ error: 'Unable to retrieve profile. Please try again later' });
    }
};

export {
    getAllDoctors,
    getAllPatients,
    findActiveDoctors,
    findActivePatients,
    findInactiveDoctors,
    findInactivePatients,
    searchUsers,
    findDoctorByLicense,
    findDoctorByPersonalId,
    findDoctorByEmail,
    findPatientByPersonalId,
    findPatientByEmail,
    searchDoctorsByName,
    searchPatientsByName,
    getDoctorById,
    getPatientById,
    getMyProfile
};