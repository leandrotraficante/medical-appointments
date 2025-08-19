import adminModel from "../models/admin.model.js";
import doctorsModel from "../models/doctor.model.js";
import patientsModel from "../models/patient.model.js";

export default class UserRepository {
    // Methods to activate/deactivate users
    async deactivateAdmin(adminId) {
        return await adminModel.findByIdAndUpdate(
            adminId,
            { isActive: false },
            { new: true }
        );
    }

    async activateAdmin(adminId) {
        return await adminModel.findByIdAndUpdate(
            adminId,
            { isActive: true },
            { new: true }
        );
    }

    async deactivateDoctor(doctorId) {
        return await doctorsModel.findByIdAndUpdate(
            doctorId,
            { isActive: false },
            { new: true }
        );
    }

    async activateDoctor(doctorId) {
        return await doctorsModel.findByIdAndUpdate(
            doctorId,
            { isActive: true },
            { new: true }
        );
    }

    async deactivatePatient(patientId) {
        return await patientsModel.findByIdAndUpdate(
            patientId,
            { isActive: false },
            { new: true }
        );
    }

    async activatePatient(patientId) {
        return await patientsModel.findByIdAndUpdate(
            patientId,
            { isActive: true },
            { new: true }
        );
    }

    // Methods to find active/inactive users
    async findActiveAdmins() {
        return await adminModel.find({ isActive: true });
    }

    async findInactiveAdmins() {
        return await adminModel.find({ isActive: false });
    }

    async findActiveDoctors() {
        return await doctorsModel.find({ isActive: true });
    }

    async findInactiveDoctors() {
        return await doctorsModel.find({ isActive: false });
    }

    async findActivePatients() {
        return await patientsModel.find({ isActive: true });
    }

    async findInactivePatients() {
        return await patientsModel.find({ isActive: false });
    }

    // Method to find user by ID and type
    async findUserByIdAndType(userId, userType) {
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
};
