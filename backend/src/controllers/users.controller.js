import userService from "../services/user.service.js";
import { isValidObjectId } from "../utils/validation.js";

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
        // Obtener parámetros de paginación
        const page = parseInt(req.query.page) || null;
        const limit = parseInt(req.query.limit) || null;
        
        const result = await userService.getAllDoctors(page, limit);
        
        if (result.pagination) {
            // Respuesta con paginación
            res.status(200).json({ 
                success: true, 
                data: result.doctors,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(result.total / limit),
                    total: result.total,
                    limit: limit
                }
            });
        } else {
            // Respuesta sin paginación (compatibilidad)
            res.status(200).json({ success: true, data: result });
        }
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
        // Obtener parámetros de paginación
        const page = parseInt(req.query.page) || null;
        const limit = parseInt(req.query.limit) || null;
        
        const result = await userService.getAllPatients(page, limit);
        
        if (result.pagination) {
            // Respuesta con paginación
            res.status(200).json({ 
                success: true, 
                data: result.patients,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(result.total / limit),
                    total: result.total,
                    limit: limit
                }
            });
        } else {
            // Respuesta sin paginación (compatibilidad)
            res.status(200).json({ success: true, data: result });
        }
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
        // Obtener parámetros de paginación
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        
        const result = await userService.findActiveDoctors(page, limit);
        
        if (result.pagination) {
            // Respuesta con paginación
            res.status(200).json({ 
                success: true, 
                data: result.doctors,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(result.total / limit),
                    total: result.total,
                    limit: limit
                }
            });
        } else {
            // Respuesta sin paginación (compatibilidad)
            res.status(200).json({ success: true, data: result });
        }
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
        // Obtener parámetros de paginación
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        
        const result = await userService.findActivePatients(page, limit);
        
        if (result.pagination) {
            // Respuesta con paginación
            res.status(200).json({ 
                success: true, 
                data: result.patients,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(result.total / limit),
                    total: result.total,
                    limit: limit
                }
            });
        } else {
            // Respuesta sin paginación (compatibilidad)
            res.status(200).json({ success: true, data: result });
        }
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
        // Obtener parámetros de paginación
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        
        const result = await userService.findInactiveDoctors(page, limit);
        
        if (result.pagination) {
            // Respuesta con paginación
            res.status(200).json({ 
                success: true, 
                data: result.doctors,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(result.total / limit),
                    total: result.total,
                    limit: limit
                }
            });
        } else {
            // Respuesta sin paginación (compatibilidad)
            res.status(200).json({ success: true, data: result });
        }
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
        // Obtener parámetros de paginación
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        
        const result = await userService.findInactivePatients(page, limit);
        
        if (result.pagination) {
            // Respuesta con paginación
            res.status(200).json({ 
                success: true, 
                data: result.patients,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(result.total / limit),
                    total: result.total,
                    limit: limit
                }
            });
        } else {
            // Respuesta sin paginación (compatibilidad)
            res.status(200).json({ success: true, data: result });
        }
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
        
        // Siempre devolver 200, incluso si no hay resultados
        res.status(200).json({ 
            success: true, 
            data: results,
            message: results.length > 0 ? `Found ${results.length} user(s) matching "${q}"` : `No users found matching "${q}"`
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
    
    if (!isValidObjectId(doctorId)) {
        return res.status(400).json({ error: 'Invalid doctor ID format' });
    }
    
    try {
        const doctor = await userService.findDoctorById(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        console.error('Error getting doctor by ID:', error);
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
            _id: userProfile._id, // ID necesario para operaciones como crear citas
            name: userProfile.name,
            lastname: userProfile.lastname || null,
            age: age,
            dateOfBirth: userProfile.dateOfBirth || null,
            phone: userProfile.phone || null,
            email: userProfile.email,
            role: userProfile.role,
            personalId: userProfile.personalId || null,
            isActive: userProfile.isActive,
            createdAt: userProfile.createdAt || null
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
    getDoctorById,
    getPatientById,
    getMyProfile
};