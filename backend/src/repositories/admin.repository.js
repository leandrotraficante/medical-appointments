import adminModel from "../models/admin.model.js";
import doctorsModel from "../models/doctor.model.js";
import patientsModel from "../models/patient.model.js";

export default class AdminRepository {
    activateAdmin = async (adminId) => {
        const existingAdmin = await adminModel.findById(adminId);
        if (!existingAdmin) {
            throw new Error('Admin not found');
        }
        
        return await adminModel.findByIdAndUpdate(
            adminId,
            { isActive: true },
            { new: true }
        );
    }

    activateDoctor = async (doctorId) => {
        const existingDoctor = await doctorsModel.findById(doctorId);
        if (!existingDoctor) {
            throw new Error('Doctor not found');
        }
        
        return await doctorsModel.findByIdAndUpdate(
            doctorId,
            { isActive: true },
            { new: true }
        );
    }

    activatePatient = async (patientId) => {
        const existingPatient = await patientsModel.findById(patientId);
        if (!existingPatient) {
            throw new Error('Patient not found');
        }
        
        return await patientsModel.findByIdAndUpdate(
            patientId,
            { isActive: true },
            { new: true }
        );
    }

    deactivateAdmin = async (adminId) => {
        const existingAdmin = await adminModel.findById(adminId);
        if (!existingAdmin) {
            throw new Error('Admin not found');
        }
        
        return await adminModel.findByIdAndUpdate(
            adminId,
            { isActive: false },
            { new: true }
        );
    }

    deactivateDoctor = async (doctorId) => {
        const existingDoctor = await doctorsModel.findById(doctorId);
        if (!existingDoctor) {
            throw new Error('Doctor not found');
        }
        
        return await doctorsModel.findByIdAndUpdate(
            doctorId,
            { isActive: false },
            { new: true }
        );
    }

    deactivatePatient = async (patientId) => {
        const existingPatient = await patientsModel.findById(patientId);
        if (!existingPatient) {
            throw new Error('Patient not found');
        }
        
        return await patientsModel.findByIdAndUpdate(
            patientId,
            { isActive: false },
            { new: true }
        );
    }
}
