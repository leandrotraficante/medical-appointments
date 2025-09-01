import UserRepository from "../repositories/user.repository.js";

const userRepository = new UserRepository();

const getAllDoctors = async (page = null, limit = null) => {
    const result = await userRepository.getAllDoctors(page, limit);
    return result;
};

const getAllPatients = async (page = null, limit = null) => {
    const result = await userRepository.getAllPatients(page, limit);
    return result;
};

const findActiveDoctors = async (page = 1, limit = 5) => {
    const result = await userRepository.findActiveDoctors(page, limit);
    return result;
};

const findActivePatients = async (page = 1, limit = 5) => {
    const result = await userRepository.findActivePatients(page, limit);
    return result;
};

const findInactiveDoctors = async (page = 1, limit = 5) => {
    const result = await userRepository.findInactiveDoctors(page, limit);
    return result;
};

/**
 * Retrieves all inactive patients from the database
 * @returns {Promise<Array>} - Array of inactive patient documents
 * @example
 * const inactivePatients = await findInactivePatients();
 * 
 * // Clean up inactive patient data
 * const oldInactivePatients = inactivePatients.filter(patient => 
 *   new Date(patient.updatedAt) < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
 * );
 */
const findInactivePatients = async (page = 1, limit = 5) => {
    const result = await userRepository.findInactivePatients(page, limit);
    return result;
};

/**
 * Unified flexible search function that searches across all fields and user types
 * Performs intelligent search across names, emails, DNI, license numbers, and specialties
 * 
 * @param {string} query - Search query (searches in all relevant fields)
 * @returns {Promise<Array>} - Array of matching users with their type information
 * @throws {Error} - If search query is missing or empty
 * 
 * @example
 * // Search by name
 * const results = await searchUsers('john');
 * // Returns: [{ user: {...}, type: 'doctor' }, { user: {...}, type: 'patient' }]
 * 
 * // Search by DNI or license
 * const results = await searchUsers('123');
 * // Returns: users with DNI, license, or name containing "123"
 * 
 * // Search by specialty
 * const results = await searchUsers('cardiology');
 * // Returns: doctors with specialty containing "cardiology"
 * 
 * // Process search results
 * results.forEach(result => {
 *   (`${result.type}: ${result.user.name} - ${result.user.email}`);
 * });
 */
const searchUsers = async (query) => {
    const results = await userRepository.searchUsers(query);
    return results;
};















/**
 * Finds a doctor by their MongoDB ID
 * @param {string} doctorId - Doctor's MongoDB ID
 * @returns {Promise<Object|null>} - Doctor object if found, null otherwise
 * @throws {Error} - If doctor ID is missing or invalid
 * @example
 * const doctor = await findDoctorById('507f1f77bcf86cd799439011');
 * if (doctor) {
 *   ('Found doctor:', doctor.name, 'Specialties:', doctor.specialties);
 * }
 */
const findDoctorById = async (doctorId) => {
    if (!doctorId) {
        throw new Error('Doctor ID is required');
    }
    
    const doctor = await userRepository.findDoctorById(doctorId);
    return doctor;
};

const findPatientById = async (patientId) => {
    if (!patientId) {
        throw new Error('Patient ID is required');
    }
    
    const patient = await userRepository.findPatientById(patientId);
    return patient;
};

const getMyProfile = async (userId, userRole) => {
    if (!userId) {
        throw new Error('User ID is required');
    }
    
    if (!userRole) {
        throw new Error('User role is required');
    }
    
    let userProfile;
    
    switch (userRole) {
        case 'admin':
            userProfile = await userRepository.findAdminById(userId);
            break;
        case 'doctor':
            userProfile = await userRepository.findDoctorById(userId);
            break;
        case 'patient':
            userProfile = await userRepository.findPatientById(userId);
            break;
        default:
            throw new Error('Invalid user role');
    }
    
    if (!userProfile) {
        throw new Error('User profile not found');
    }
    
    return userProfile;
};

export default {
    getAllDoctors,
    getAllPatients,
    findActiveDoctors,
    findActivePatients,
    findInactiveDoctors,
    findInactivePatients,
    searchUsers,
    findDoctorById,
    findPatientById,
    getMyProfile
};