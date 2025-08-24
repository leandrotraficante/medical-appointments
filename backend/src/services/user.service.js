import UserRepository from "../repositories/user.repository.js";

const userRepository = new UserRepository();

/**
 * Retrieves all doctors from the database
 * @returns {Promise<Array>} - Array of all doctor documents
 * @example
 * const doctors = await getAllDoctors();
 * console.log(`Found ${doctors.length} doctors`);
 */
const getAllDoctors = async () => {
    const doctors = await userRepository.getAllDoctors();
    return doctors;
};

/**
 * Retrieves all patients from the database
 * @returns {Promise<Array>} - Array of all patient documents
 * @example
 * const patients = await getAllPatients();
 * console.log(`Found ${patients.length} patients`);
 */
const getAllPatients = async () => {
    const patients = await userRepository.getAllPatients();
    return patients;
};

/**
 * Retrieves all active doctors from the database
 * @returns {Promise<Array>} - Array of active doctor documents
 * @example
 * const activeDoctors = await findActiveDoctors();
 * console.log(`Found ${activeDoctors.length} active doctors`);
 */
const findActiveDoctors = async () => {
    const activeDoctors = await userRepository.findActiveDoctors();
    return activeDoctors;
};

/**
 * Retrieves all active patients from the database
 * @returns {Promise<Array>} - Array of active patient documents
 * @example
 * const activePatients = await findActivePatients();
 * console.log(`Found ${activePatients.length} active patients`);
 */
const findActivePatients = async () => {
    const activePatients = await userRepository.findActivePatients();
    return activePatients;
};

/**
 * Retrieves all inactive doctors from the database
 * @returns {Promise<Array>} - Array of inactive doctor documents
 * @example
 * const inactiveDoctors = await findInactiveDoctors();
 * console.log(`Found ${inactiveDoctors.length} inactive doctors`);
 */
const findInactiveDoctors = async () => {
    const inactiveDoctors = await userRepository.findInactiveDoctors();
    return inactiveDoctors;
};

/**
 * Retrieves all inactive patients from the database
 * @returns {Promise<Array>} - Array of inactive patient documents
 * @example
 * const inactivePatients = await findInactivePatients();
 * console.log(`Found ${inactivePatients.length} inactive patients`);
 */
const findInactivePatients = async () => {
    const inactivePatients = await userRepository.findInactivePatients();
    return inactivePatients;
};

/**
 * Finds a user by their ID and specific role
 * @param {string} userId - User's MongoDB ID
 * @param {string} role - User role: 'admin', 'doctor', or 'patient'
 * @returns {Promise<Object>} - User object if found and active
 * @throws {Error} - If user ID or role is missing, user not found, or account deactivated
 * @example
 * const user = await findUserByIdAndRole('507f1f77bcf86cd799439011', 'doctor');
 * if (user) {
 *   console.log('Found doctor:', user.name);
 * }
 */
const findUserByIdAndRole = async (userId, role) => {
    if (!userId || !role) {
        throw new Error('User ID and role are required');
    }
    
    const user = await userRepository.findUserByIdAndRole(userId, role);
    if (!user) {
        throw new Error('User not found');
    }
    
    if (!user.isActive) {
        throw new Error('User account is deactivated');
    }
    
    return user;
};

/**
 * Finds a doctor by their medical license number
 * @param {string} license - Doctor's medical license number
 * @returns {Promise<Object>} - Doctor object if found
 * @throws {Error} - If license is missing or doctor not found
 * @example
 * const doctor = await findDoctorByLicense('MD12345');
 * if (doctor) {
 *   console.log('Found doctor:', doctor.name, 'Specialties:', doctor.specialties);
 * }
 */
const findDoctorByLicense = async (license) => {
    if (!license) {
        throw new Error('License is required');
    }
    
    const doctor = await userRepository.findDoctorByLicense(license);
    if (!doctor) {
        throw new Error('Doctor not found');
    }
    
    return doctor;
};

/**
 * Finds a doctor by their personal ID/DNI
 * @param {string} personalId - Doctor's personal ID/DNI
 * @returns {Promise<Object>} - Doctor object if found
 * @throws {Error} - If personal ID is missing or doctor not found
 * @example
 * const doctor = await findDoctorByPersonalId('87654321');
 * if (doctor) {
 *   console.log('Found doctor:', doctor.name, 'Email:', doctor.email);
 * }
 */
const findDoctorByPersonalId = async (personalId) => {
    if (!personalId) {
        throw new Error('Personal ID is required');
    }
    
    const doctor = await userRepository.findDoctorByPersonalId(personalId);
    if (!doctor) {
        throw new Error('Doctor not found');
    }
    
    return doctor;
};

/**
 * Finds a doctor by their email address
 * @param {string} email - Doctor's email address
 * @returns {Promise<Object>} - Doctor object if found
 * @throws {Error} - If email is missing or doctor not found
 * @example
 * const doctor = await findDoctorByEmail('john.doe@hospital.com');
 * if (doctor) {
 *   console.log('Found doctor:', doctor.name, 'License:', doctor.license);
 * }
 */
const findDoctorByEmail = async (email) => {
    if (!email) {
        throw new Error('Email is required');
    }
    
    const doctor = await userRepository.findDoctorByEmail(email);
    if (!doctor) {
        throw new Error('Doctor not found');
    }
    
    return doctor;
};

/**
 * Finds a patient by their personal ID/DNI
 * @param {string} personalId - Patient's personal ID/DNI
 * @returns {Promise<Object>} - Patient object if found
 * @throws {Error} - If personal ID is missing or patient not found
 * @example
 * const patient = await findPatientByPersonalId('11223344');
 * if (patient) {
 *   console.log('Found patient:', patient.name, 'Email:', patient.email);
 * }
 */
const findPatientByPersonalId = async (personalId) => {
    if (!personalId) {
        throw new Error('Personal ID is required');
    }
    
    const patient = await userRepository.findPatientByPersonalId(personalId);
    if (!patient) {
        throw new Error('Patient not found');
    }
    
    return patient;
};

/**
 * Finds a patient by their email address
 * @param {string} email - Patient's email address
 * @returns {Promise<Object>} - Patient object if found
 * @throws {Error} - If email is missing or patient not found
 * @example
 * const patient = await findPatientByEmail('jane.smith@email.com');
 * if (patient) {
 *   console.log('Found patient:', patient.name, 'Phone:', patient.phone);
 * }
 */
const findPatientByEmail = async (email) => {
    if (!email) {
        throw new Error('Email is required');
    }
    
    const patient = await userRepository.findPatientByEmail(email);
    if (!patient) {
        throw new Error('Patient not found');
    }
    
    return patient;
};

/**
 * Searches for doctors by name using partial matching
 * @param {string} searchTerm - Search term for doctor's name
 * @returns {Promise<Array>} - Array of matching doctor objects
 * @throws {Error} - If search term is missing or empty
 * @example
 * const doctors = await searchDoctorsByName('John');
 * console.log(`Found ${doctors.length} doctors with name containing 'John'`);
 */
const searchDoctorsByName = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
        throw new Error('Search term is required');
    }
    
    const doctors = await userRepository.searchDoctorsByName(searchTerm);
    return doctors;
};

/**
 * Searches for patients by name using partial matching
 * @param {string} searchTerm - Search term for patient's name
 * @returns {Promise<Array>} - Array of matching patient objects
 * @throws {Error} - If search term is missing or empty
 * @example
 * const patients = await searchPatientsByName('Jane');
 * console.log(`Found ${patients.length} patients with name containing 'Jane'`);
 */
const searchPatientsByName = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
        throw new Error('Search term is required');
    }
    
    const patients = await userRepository.searchPatientsByName(searchTerm);
    return patients;
};

export default {
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