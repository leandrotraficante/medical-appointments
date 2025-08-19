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
};

