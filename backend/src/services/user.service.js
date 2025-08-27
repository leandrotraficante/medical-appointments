import UserRepository from "../repositories/user.repository.js";

const userRepository = new UserRepository();

/**
 * Retrieves all doctors from the database
 * @returns {Promise<Array>} - Array of all doctor documents
 * @example
 * const doctors = await getAllDoctors();
 * console.log(`Found ${doctors.length} doctors`);
 * 
 * // Example response structure:
 * // [
 * //   {
 * //     _id: '507f1f77bcf86cd799439011',
 * //     name: 'Dr. John Smith',
 * //     email: 'john.smith@hospital.com',
 * //     specialties: ['Cardiology'],
 * //     isActive: true
 * //   }
 * // ]
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
 * 
 * // Example response structure:
 * // [
 * //   {
 * //     _id: '507f1f77bcf86cd799439012',
 * //     name: 'Jane Doe',
 * //     email: 'jane.doe@email.com',
 * //     personalId: '11223344',
 * //     isActive: true
 * //   }
 * // ]
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
 * 
 * // Filter active doctors for display
 * const availableDoctors = activeDoctors.filter(doctor => 
 *   doctor.specialties.includes('Cardiology')
 * );
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
 * 
 * // Get patients with phone numbers for notifications
 * const patientsWithPhone = activePatients.filter(patient => patient.phone);
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
 * 
 * // Send reactivation emails to inactive doctors
 * inactiveDoctors.forEach(doctor => {
 *   sendReactivationEmail(doctor.email, doctor.name);
 * });
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
 * 
 * // Clean up inactive patient data
 * const oldInactivePatients = inactivePatients.filter(patient => 
 *   new Date(patient.updatedAt) < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
 * );
 */
const findInactivePatients = async () => {
    const inactivePatients = await userRepository.findInactivePatients();
    return inactivePatients;
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
 *   console.log(`${result.type}: ${result.user.name} - ${result.user.email}`);
 * });
 */
const searchUsers = async (query) => {
    const results = await userRepository.searchUsers(query);
    return results;
};

/**
 * Finds a doctor by their medical license number
 * @param {string} license - Doctor's medical license number
 * @returns {Promise<Object>} - Doctor object if found
 * @throws {Error} - If license is missing or doctor not found
 * 
 * @example
 * const doctor = await findDoctorByLicense('MD12345');
 * if (doctor) {
 *   console.log('Found doctor:', doctor.name, 'Specialties:', doctor.specialties);
 *   
 *   // Check if doctor is available for appointments
 *   if (doctor.isActive) {
 *     console.log('Doctor is available for new patients');
 *   }
 * }
 * 
 * // Handle not found case
 * try {
 *   const doctor = await findDoctorByLicense('INVALID123');
 * } catch (error) {
 *   console.log('Doctor not found:', error.message);
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
 * 
 * @example
 * const doctor = await findDoctorByPersonalId('87654321');
 * if (doctor) {
 *   console.log('Found doctor:', doctor.name, 'Email:', doctor.email);
 *   
 *   // Validate doctor's active status
 *   if (!doctor.isActive) {
 *     console.log('Warning: Doctor account is inactive');
 *   }
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
 * 
 * @example
 * const doctor = await findDoctorByEmail('john.doe@hospital.com');
 * if (doctor) {
 *   console.log('Found doctor:', doctor.name, 'License:', doctor.license);
 *   
 *   // Send notification to doctor
 *   sendAppointmentNotification(doctor.email, 'New appointment request');
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
 * 
 * @example
 * const patient = await findPatientByPersonalId('11223344');
 * if (patient) {
 *   console.log('Found patient:', patient.name, 'Email:', patient.email);
 *   
 *   // Check patient's active status
 *   if (patient.isActive) {
 *     console.log('Patient can book new appointments');
 *   }
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
 * 
 * @example
 * const patient = await findPatientByEmail('jane.smith@email.com');
 * if (patient) {
 *   console.log('Found patient:', patient.name, 'Phone:', patient.phone);
 *   
 *   // Send appointment reminder
 *   if (patient.phone) {
 *     sendSMSReminder(patient.phone, 'Appointment tomorrow at 10:00 AM');
 *   }
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
 * Performs case-insensitive search on both first name and last name fields
 * 
 * @param {string} searchTerm - Search term for doctor's name
 * @returns {Promise<Array>} - Array of matching doctor objects
 * @throws {Error} - If search term is missing or empty
 * 
 * @example
 * // Search by first name
 * const doctors = await searchDoctorsByName('John');
 * console.log(`Found ${doctors.length} doctors with name containing 'John'`);
 * 
 * // Search by last name
 * const smithDoctors = await searchDoctorsByName('Smith');
 * 
 * // Process results
 * doctors.forEach(doctor => {
 *   console.log(`${doctor.name} ${doctor.lastname} - ${doctor.specialties.join(', ')}`);
 * });
 * 
 * // Handle empty search
 * try {
 *   const results = await searchDoctorsByName('');
 * } catch (error) {
 *   console.log('Search error:', error.message);
 * }
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
 * Performs case-insensitive search on both first name and last name fields
 * 
 * @param {string} searchTerm - Search term for patient's name
 * @returns {Promise<Array>} - Array of matching patient objects
 * @throws {Error} - If search term is missing or empty
 * 
 * @example
 * // Search by first name
 * const patients = await searchPatientsByName('Jane');
 * console.log(`Found ${patients.length} patients with name containing 'Jane'`);
 * 
 * // Search by last name
 * const doePatients = await searchPatientsByName('Doe');
 * 
 * // Process results for notifications
 * patients.forEach(patient => {
 *   if (patient.isActive && patient.email) {
 *     sendNewsletter(patient.email, patient.name);
 *   }
 * });
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
    searchUsers,
    findDoctorByLicense,
    findDoctorByPersonalId,
    findDoctorByEmail,
    findPatientByPersonalId,
    findPatientByEmail,
    searchDoctorsByName,
    searchPatientsByName
};