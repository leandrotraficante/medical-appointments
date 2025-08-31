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
    getAllDoctors = async (page = null, limit = null) => {
        if (page && limit) {
            // Con paginación
            const skip = (page - 1) * limit;
            const [doctors, total] = await Promise.all([
                doctorsModel.find().select('-password').skip(skip).limit(limit),
                doctorsModel.countDocuments()
            ]);
            return { doctors, total, pagination: true };
        } else {
            // Sin paginación (comportamiento original)
            return await doctorsModel.find().select('-password');
        }
    }



    /**
     * Retrieves all patients from the database
     * @returns {Promise<Array>} - Array of all patient documents
     * @example
     * const patients = await userRepository.getAllPatients();
     * console.log(`Found ${patients.length} patients`);
     */
    getAllPatients = async (page = null, limit = null) => {
        if (page && limit) {
            // Con paginación
            const skip = (page - 1) * limit;
            const [patients, total] = await Promise.all([
                patientsModel.find().select('-password').skip(skip).limit(limit),
                patientsModel.countDocuments()
            ]);
            return { patients, total, pagination: true };
        } else {
            // Sin paginación (comportamiento original)
            return await patientsModel.find().select('-password');
        }
    }

    /**
     * Retrieves all active doctors from the database
     * @returns {Promise<Array>} - Array of active doctor documents
     * @example
     * const activeDoctors = await userRepository.findActiveDoctors();
     * console.log(`Found ${activeDoctors.length} active doctors`);
     */
    findActiveDoctors = async (page = 1, limit = 5) => {
        if (page && limit) {
            // Con paginación
            const skip = (page - 1) * limit;
            const [doctors, total] = await Promise.all([
                doctorsModel.find({ isActive: true }).select('-password').skip(skip).limit(limit),
                doctorsModel.countDocuments({ isActive: true })
            ]);
            return { doctors, total, pagination: true };
        } else {
            // Sin paginación (comportamiento original)
            return await doctorsModel.find({ isActive: true }).select('-password');
        }
    }

    /**
     * Retrieves all active patients from the database
     * @returns {Promise<Array>} - Array of active patient documents
     * @example
     * const activePatients = await userRepository.findActivePatients();
     * console.log(`Found ${activePatients.length} active patients`);
     */
    findActivePatients = async (page = 1, limit = 5) => {
        if (page && limit) {
            // Con paginación
            const skip = (page - 1) * limit;
            const [patients, total] = await Promise.all([
                patientsModel.find({ isActive: true }).select('-password').skip(skip).limit(limit),
                patientsModel.countDocuments({ isActive: true })
            ]);
            return { patients, total, pagination: true };
        } else {
            // Sin paginación (comportamiento original)
            return await patientsModel.find({ isActive: true }).select('-password');
        }
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
    findInactivePatients = async (page = 1, limit = 5) => {
        if (page && limit) {
            // Con paginación
            const skip = (page - 1) * limit;
            const [patients, total] = await Promise.all([
                patientsModel.find({ isActive: false }).select('-password').skip(skip).limit(limit),
                patientsModel.countDocuments({ isActive: false })
            ]);
            return { patients, total, pagination: true };
        } else {
            // Sin paginación (comportamiento original)
            return await patientsModel.find({ isActive: false }).select('-password');
        }
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














}
