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
        return await doctorsModel.find();
    }

    /**
     * Retrieves all patients from the database
     * @returns {Promise<Array>} - Array of all patient documents
     * @example
     * const patients = await userRepository.getAllPatients();
     * console.log(`Found ${patients.length} patients`);
     */
    getAllPatients = async () => {
        return await patientsModel.find();
    }

    /**
     * Retrieves all active doctors from the database
     * @returns {Promise<Array>} - Array of active doctor documents
     * @example
     * const activeDoctors = await userRepository.findActiveDoctors();
     * console.log(`Found ${activeDoctors.length} active doctors`);
     */
    findActiveDoctors = async () => {
        return await doctorsModel.find({ isActive: true });
    }

    findActivePatients = async () => {
        return await patientsModel.find({ isActive: true });
    }

    findInactiveDoctors = async () => {
        return await doctorsModel.find({ isActive: false });
    }

    findInactivePatients = async () => {
        return await patientsModel.find({ isActive: false });
    }

    findUserByIdAndRole = async (userId, role) => {
        switch (role) {
            case 'admin':
                return await adminModel.findById(userId);
            case 'doctor':
                return await doctorsModel.findById(userId);
            case 'patient':
                return await patientsModel.findById(userId);
            default:
                throw new Error('Invalid user role');
        }
    }

    findDoctorByLicense = async (license) => {
        return await doctorsModel.findOne({ license });
    }

    findDoctorByPersonalId = async (personalId) => {
        return await doctorsModel.findOne({ personalId });
    }

    findDoctorByEmail = async (email) => {
        return await doctorsModel.findOne({ email });
    }

    findPatientByPersonalId = async (personalId) => {
        return await patientsModel.findOne({ personalId });
    }

    findPatientByEmail = async (email) => {
        return await patientsModel.findOne({ email });
    }

    searchDoctorsByName = async (searchTerm) => {
        return await doctorsModel.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { lastname: { $regex: searchTerm, $options: 'i' } }
            ]
        });
    }

    searchPatientsByName = async (searchTerm) => {
        return await patientsModel.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { lastname: { $regex: searchTerm, $options: 'i' } }
            ]
        });
    }
}
