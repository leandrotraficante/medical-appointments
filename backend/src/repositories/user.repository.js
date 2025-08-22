import adminModel from "../models/admin.model.js";
import doctorsModel from "../models/doctor.model.js";
import patientsModel from "../models/patient.model.js";

export default class UserRepository {
    // READ (GET) - De más general a más específico
    getAllDoctors = async () => {
        return await doctorsModel.find();
    }

    getAllPatients = async () => {
        return await patientsModel.find();
    }

    getAllAdmins = async () => {
        return await adminModel.find();
    }

    findActiveAdmins = async () => {
        return await adminModel.find({ isActive: true });
    }

    findActiveDoctors = async () => {
        return await doctorsModel.find({ isActive: true });
    }

    findActivePatients = async () => {
        return await patientsModel.find({ isActive: true });
    }

    findInactiveAdmins = async () => {
        return await adminModel.find({ isActive: false });
    }

    findInactiveDoctors = async () => {
        return await doctorsModel.find({ isActive: false });
    }

    findInactivePatients = async () => {
        return await patientsModel.find({ isActive: false });
    }

    findUserByIdAndType = async (userId, userType) => {
        switch (userType) {
            case 'admin':
                return await adminModel.findById(userId);
            case 'doctor':
                return await doctorsModel.findById(userId);
            case 'patient':
                return await patientsModel.findById(userId);
            default:
                throw new Error('Invalid user type');
        }
    }

    // Search methods for doctors
    findDoctorByLicense = async (license) => {
        return await doctorsModel.findOne({ license });
    }

    findDoctorByPersonalId = async (personalId) => {
        return await doctorsModel.findOne({ personalId });
    }

    findDoctorByEmail = async (email) => {
        return await doctorsModel.findOne({ email });
    }

    // Search methods for patients
    findPatientByPersonalId = async (personalId) => {
        return await patientsModel.findOne({ personalId });
    }

    findPatientByEmail = async (email) => {
        return await patientsModel.findOne({ email });
    }

    // Generic search methods
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

    // UPDATE
    activateAdmin = async (adminId) => {
        return await adminModel.findByIdAndUpdate(
            adminId,
            { isActive: true },
            { new: true }
        );
    }

    activateDoctor = async (doctorId) => {
        return await doctorsModel.findByIdAndUpdate(
            doctorId,
            { isActive: true },
            { new: true }
        );
    }

    activatePatient = async (patientId) => {
        return await patientsModel.findByIdAndUpdate(
            patientId,
            { isActive: true },
            { new: true }
        );
    }

    deactivateAdmin = async (adminId) => {
        return await adminModel.findByIdAndUpdate(
            adminId,
            { isActive: false },
            { new: true }
        );
    }

    deactivateDoctor = async (doctorId) => {
        return await doctorsModel.findByIdAndUpdate(
            doctorId,
            { isActive: false },
            { new: true }
        );
    }

    deactivatePatient = async (patientId) => {
        return await patientsModel.findByIdAndUpdate(
            patientId,
            { isActive: false },
            { new: true }
        );
    }
}
