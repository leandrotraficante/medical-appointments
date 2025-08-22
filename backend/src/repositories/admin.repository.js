import adminModel from "../models/admin.model.js";
import doctorsModel from "../models/doctor.model.js";
import patientsModel from "../models/patient.model.js";

export default class AdminRepository {
    // UPDATE - Operaciones administrativas de activación/desactivación
    activateAdmin = async (adminId) => {
        // Verificar que el usuario exista antes de activarlo
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
        // Verificar que el usuario exista antes de activarlo
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
        // Verificar que el usuario exista antes de activarlo
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
        // Verificar que el usuario exista antes de desactivarlo
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
        // Verificar que el usuario exista antes de desactivarlo
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
        // Verificar que el usuario exista antes de desactivarlo
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
