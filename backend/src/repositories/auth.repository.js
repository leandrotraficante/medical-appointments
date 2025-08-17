import adminModel from "../models/admin.model.js";
import doctorsModel from "../models/doctor.model.js";
import patientsModel from "../models/patient.model.js";

export default class AuthRepository {
    // Para login de admins
    async findAdminByEmail(email) {
        const adminLogin = await adminModel.findOne({ email, isActive: true });
        return adminLogin;
    }

    // Para login de doctores
    async findDoctorByEmail(email) {
        const doctorLogin = await doctorsModel.findOne({ email, isActive: true });
        return doctorLogin;
    }

    // Para login de pacientes
    async findPatientByEmail(email) {
        const patientLogin = await patientsModel.findOne({ email, isActive: true });
        return patientLogin;
    }

    // Para verificar si un email ya existe
    async checkEmailExists(email) {
        const admin = await adminModel.findOne({ email });
        const doctor = await doctorsModel.findOne({ email });
        const patient = await patientsModel.findOne({ email });

        return admin || doctor || patient;
    }

    // Para crear usuarios
    async createAdmin(adminData) {
        const newAdmin = await adminModel.create(adminData);
        return newAdmin;
    }

    async createDoctor(doctorData) {
        const newDoctor = await doctorsModel.create(doctorData);
        return newDoctor;
    }

    async createPatient(patientData) {
        const newPatient = await patientsModel.create(patientData);
        return newPatient;
    }

    // Métodos para activar/desactivar usuarios
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

    // Métodos para buscar usuarios activos/inactivos
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

    // Método para buscar usuario por ID y tipo
    async findUserByIdAndType(userId, userType) {
        switch (userType) {
            case 'admin':
                return await adminModel.findById(userId);
            case 'doctor':
                return await doctorsModel.findById(userId);
            case 'patient':
                return await patientsModel.findById(userId);
            default:
                throw new Error('Tipo de usuario no válido');
        }
    }
};

