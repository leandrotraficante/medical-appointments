import adminModel from "../models/admin.model.js";
import doctorsModel from "../models/doctor.model.js";
import patientsModel from "../models/patient.model.js";

export default class AuthRepository {
    // CREATE
    createAdmin = async (adminData) => {
        const newAdmin = await adminModel.create(adminData);
        return newAdmin;
    }

    createDoctor = async (doctorData) => {
        const newDoctor = await doctorsModel.create(doctorData);
        return newDoctor;
    }

    createPatient = async (patientData) => {
        const newPatient = await patientsModel.create(patientData);
        return newPatient;
    }

    // READ (GET) - De más general a más específico
    checkEmailExists = async (email) => {
        const admin = await adminModel.findOne({ email });
        const doctor = await doctorsModel.findOne({ email });
        const patient = await patientsModel.findOne({ email });

        return admin || doctor || patient;
    }

    findAdminByEmail = async (email) => {
        const adminLogin = await adminModel.findOne({ email, isActive: true });
        return adminLogin;
    }

    findDoctorByEmail = async (email) => {
        const doctorLogin = await doctorsModel.findOne({ email, isActive: true });
        return doctorLogin;
    }

    findPatientByEmail = async (email) => {
        const patientLogin = await patientsModel.findOne({ email, isActive: true });
        return patientLogin;
    }
}

