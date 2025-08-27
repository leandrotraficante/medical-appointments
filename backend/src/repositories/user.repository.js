import adminModel from "../models/admin.model.js";
import doctorsModel from "../models/doctor.model.js";
import patientsModel from "../models/patient.model.js";

export default class UserRepository {
    /**
     * Retrieves all doctors from the database
     * @returns {Promise<Array>} - Array of all doctor documents
     * @example
     * const doctors = await userRepository.getAllDoctors();
     * console.log(`Found ${doctors.length} doctors`);
     */
    getAllDoctors = async () => {
        return await doctorsModel.find().select('-password');
    }

    /**
     * Retrieves all patients from the database
     * @returns {Promise<Array>} - Array of all patient documents
     * @example
     * const patients = await userRepository.getAllPatients();
     * console.log(`Found ${patients.length} patients`);
     */
    getAllPatients = async () => {
        return await patientsModel.find().select('-password');
    }

    /**
     * Retrieves all active doctors from the database
     * @returns {Promise<Array>} - Array of active doctor documents
     * @example
     * const activeDoctors = await userRepository.findActiveDoctors();
     * console.log(`Found ${activeDoctors.length} active doctors`);
     */
    findActiveDoctors = async () => {
        return await doctorsModel.find({ isActive: true }).select('-password');
    }

    /**
     * Retrieves all active patients from the database
     * @returns {Promise<Array>} - Array of active patient documents
     * @example
     * const activePatients = await userRepository.findActivePatients();
     * console.log(`Found ${activePatients.length} active patients`);
     */
    findActivePatients = async () => {
        return await patientsModel.find({ isActive: true }).select('-password');
    }

    /**
     * Retrieves all inactive doctors from the database
     * @returns {Promise<Array>} - Array of inactive doctor documents
     * @example
     * const inactiveDoctors = await userRepository.findInactiveDoctors();
     * console.log(`Found ${inactiveDoctors.length} inactive doctors`);
     */
    findInactiveDoctors = async () => {
        return await doctorsModel.find({ isActive: false }).select('-password');
    }

    /**
     * Retrieves all inactive patients from the database
     * @returns {Promise<Array>} - Array of inactive patient documents
     * @example
     * const inactivePatients = await userRepository.findInactivePatients();
     * console.log(`Found ${inactivePatients.length} inactive patients`);
     */
    findInactivePatients = async () => {
        return await patientsModel.find({ isActive: false }).select('-password');
    }

    /**
     * Finds an admin by their MongoDB ID
     * @param {string} adminId - Admin's MongoDB ID
     * @returns {Promise<Object|null>} - Admin object if found, null otherwise
     * @example
     * const admin = await userRepository.findAdminById('507f1f77bcf86cd799439011');
     */
    findAdminById = async (adminId) => {
        return await adminModel.findById(adminId).select('-password');
    }

    /**
     * Finds a doctor by their MongoDB ID
     * @param {string} doctorId - Doctor's MongoDB ID
     * @returns {Promise<Object|null>} - Doctor object if found, null otherwise
     * @example
     * const doctor = await userRepository.findDoctorById('507f1f77bcf86cd799439011');
     */
    findDoctorById = async (doctorId) => {
        return await doctorsModel.findById(doctorId).select('-password');
    }

    /**
     * Finds a patient by their MongoDB ID
     * @param {string} patientId - Patient's MongoDB ID
     * @returns {Promise<Object|null>} - Patient object if found, null otherwise
     * @example
     * const patient = await userRepository.findPatientById('507f1f77bcf86cd799439011');
     */
    findPatientById = async (patientId) => {
        return await patientsModel.findById(patientId).select('-password');
    }

    /**
     * Unified flexible search function that searches across all fields and user types
     * @param {string} query - Search query (searches in all relevant fields)
     * @returns {Promise<Array>} - Array of matching users with their type information
     * @example
     * const results = await userRepository.searchUsers('john');
     * // Returns: [{ user: {...}, type: 'doctor' }, { user: {...}, type: 'patient' }]
     * 
     * const results = await userRepository.searchUsers('123');
     * // Returns: users with DNI, license, or name containing "123"
     */
    searchUsers = async (query) => {
        const results = [];
        const searchRegex = { $regex: query, $options: 'i' };
        
        // Buscar en TODOS los campos de TODOS los usuarios
        const admins = await adminModel.find({
            $or: [
                { name: searchRegex },
                { lastname: searchRegex },
                { email: searchRegex },
                { personalId: searchRegex }
            ]
        });
        
        const doctors = await doctorsModel.find({
            $or: [
                { name: searchRegex },
                { lastname: searchRegex },
                { email: searchRegex },
                { personalId: searchRegex },
                { license: searchRegex },
                { specialties: { $in: [new RegExp(query, 'i')] } }
            ]
        });
        
        const patients = await patientsModel.find({
            $or: [
                { name: searchRegex },
                { lastname: searchRegex },
                { email: searchRegex },
                { personalId: searchRegex }
            ]
        });
        
        // Agregar tipo a cada resultado
        admins.forEach(admin => results.push({ user: admin, type: 'admin' }));
        doctors.forEach(doctor => results.push({ user: doctor, type: 'doctor' }));
        patients.forEach(patient => results.push({ user: patient, type: 'patient' }));
        
        return results;
    }

    /**
     * Finds a doctor by their medical license number
     * @param {string} license - Doctor's medical license number
     * @returns {Promise<Object|null>} - Doctor object if found, null otherwise
     * @example
     * const doctor = await userRepository.findDoctorByLicense('MD12345');
     */
    findDoctorByLicense = async (license) => {
        return await doctorsModel.findOne({ license });
    }

    /**
     * Finds a doctor by their personal ID/DNI
     * @param {string} personalId - Doctor's personal ID/DNI
     * @returns {Promise<Object|null>} - Doctor object if found, null otherwise
     * @example
     * const doctor = await userRepository.findDoctorByPersonalId('87654321');
     */
    findDoctorByPersonalId = async (personalId) => {
        return await doctorsModel.findOne({ personalId });
    }

    /**
     * Finds a doctor by their email address
     * @param {string} email - Doctor's email address
     * @returns {Promise<Object|null>} - Doctor object if found, null otherwise
     * @example
     * const doctor = await userRepository.findDoctorByEmail('john.doe@hospital.com');
     */
    findDoctorByEmail = async (email) => {
        return await doctorsModel.findOne({ email });
    }

    /**
     * Finds a patient by their personal ID/DNI
     * @param {string} personalId - Patient's personal ID/DNI
     * @returns {Promise<Object|null>} - Doctor object if found, null otherwise
     * @example
     * const patient = await userRepository.findPatientByPersonalId('11223344');
     */
    findPatientByPersonalId = async (personalId) => {
        return await patientsModel.findOne({ personalId });
    }

    /**
     * Finds a patient by their email address
     * @param {string} email - Patient's email address
     * @returns {Promise<Object|null>} - Doctor object if found, null otherwise
     * @example
     * const patient = await userRepository.findPatientByEmail('jane.smith@email.com');
     */
    findPatientByEmail = async (email) => {
        return await patientsModel.findOne({ email });
    }

    /**
     * Searches for doctors by name using partial matching
     * @param {string} searchTerm - Search term for doctor's name
     * @returns {Promise<Array>} - Array of matching doctor objects
     * @example
     * const doctors = await userRepository.searchDoctorsByName('John');
     */
    searchDoctorsByName = async (searchTerm) => {
        return await doctorsModel.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { lastname: { $regex: searchTerm, $options: 'i' } }
            ]
        });
    }

    /**
     * Searches for patients by name using partial matching
     * @param {string} searchTerm - Search term for patient's name
     * @returns {Promise<Array>} - Array of matching patient objects
     * @example
     * const patients = await userRepository.searchPatientsByName('Jane');
     */
    searchPatientsByName = async (searchTerm) => {
        return await patientsModel.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { lastname: { $regex: searchTerm, $options: 'i' } }
            ]
        });
    }
}
