import AdminModel from '../models/admin.model.js';
import DoctorModel from '../models/doctor.model.js';
import PatientModel from '../models/patient.model.js';

class AuthRepository {
    async createAdmin(adminData) {
        return await AdminModel.create(adminData);
    }

    async createDoctor(doctorData) {
        return await DoctorModel.create(doctorData);
    }

    async createPatient(patientData) {
        return await PatientModel.create(patientData);
    }

    async checkEmailExists(email) {
        const admin = await AdminModel.findOne({ email });
        if (admin) return admin;

        const doctor = await DoctorModel.findOne({ email });
        if (doctor) return doctor;

        const patient = await PatientModel.findOne({ email });
        if (patient) return patient;

        return null;
    }
}

export default AuthRepository;

