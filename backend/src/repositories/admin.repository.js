import adminModel from "../models/admin.model.js";
import doctorsModel from "../models/doctor.model.js";
import patientsModel from "../models/patient.model.js";

export default class AdminRepository {
    // ===== ADMIN MANAGEMENT =====

    /**
     * Retrieves all admins from the database
     * @returns {Promise<Array>} - Array of all admin documents
     * @example
     * const admins = await adminRepository.getAllAdmins();
     */
    getAllAdmins = async () => {
        return await adminModel.find().select('-password');
    }

    // ===== DOCTOR MANAGEMENT =====

    /**
     * Activates a doctor account
     * @param {string} doctorId - Doctor's MongoDB ID
     * @returns {Promise<Object>} - Activated doctor object
     * @throws {Error} - If doctor not found
     * @example
     * const activatedDoctor = await adminRepository.activateDoctor('507f1f77bcf86cd799439011');
     */
    activateDoctor = async (doctorId) => {
        return await doctorsModel.findByIdAndUpdate(
            doctorId,
            { isActive: true },
            { new: true }
        );
    }

    /**
     * Deactivates a doctor account
     * @param {string} doctorId - Doctor's MongoDB ID
     * @returns {Promise<Object>} - Deactivated doctor object
     * @throws {Error} - If doctor not found
     * @example
     * const deactivatedDoctor = await adminRepository.deactivateDoctor('507f1f77bcf86cd799439011');
     */
    deactivateDoctor = async (doctorId) => {
        return await doctorsModel.findByIdAndUpdate(
            doctorId,
            { isActive: false },
            { new: true }
        );
    }

    /**
     * Updates doctor information
     * @param {string} doctorId - Doctor's MongoDB ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object|null>} - Updated doctor object
     * @example
     * const updatedDoctor = await adminRepository.updateDoctor('507f1f77bcf86cd799439011', { specialties: ['Cardiology'] });
     */
    updateDoctor = async (doctorId, updateData) => {
        return await doctorsModel.findByIdAndUpdate(
            doctorId,
            updateData,
            { new: true, runValidators: true }
        );
    }

    /**
     * Deletes a doctor completely from the database
     * @param {string} doctorId - Doctor's MongoDB ID
     * @returns {Promise<Object|null>} - Deleted doctor object
     * @example
     * const deletedDoctor = await adminRepository.deleteDoctor('507f1f77bcf86cd799439011');
     */
    deleteDoctor = async (doctorId) => {
        return await doctorsModel.findByIdAndDelete(doctorId);
    }

    // ===== PATIENT MANAGEMENT =====

    /**
     * Activates a patient account
     * @param {string} patientId - Patient's MongoDB ID
     * @returns {Promise<Object>} - Activated patient object
     * @throws {Error} - If patient not found
     * @example
     * const activatedPatient = await adminRepository.activatePatient('507f1f77bcf86cd799439011');
     */
    activatePatient = async (patientId) => {
        return await patientsModel.findByIdAndUpdate(
            patientId,
            { isActive: true },
            { new: true }
        );
    }

    /**
     * Deactivates a patient account
     * @param {string} patientId - Patient's MongoDB ID
     * @returns {Promise<Object>} - Deactivated patient object
     * @throws {Error} - If patient not found
     * @example
     * const deactivatedPatient = await adminRepository.deactivatePatient('507f1f77bcf86cd799439011');
     */
    deactivatePatient = async (patientId) => {
        return await patientsModel.findByIdAndUpdate(
            patientId,
            { isActive: false },
            { new: true }
        );
    }

    /**
     * Updates patient information
     * @param {string} patientId - Patient's MongoDB ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object|null>} - Updated patient object
     * @example
     * const updatedPatient = await adminRepository.updatePatient('507f1f77bcf86cd799439011', { phone: '123456789' });
     */
    updatePatient = async (patientId, updateData) => {
        return await patientsModel.findByIdAndUpdate(
            patientId,
            updateData,
            { new: true, runValidators: true }
        );
    }

    /**
     * Deletes a patient completely from the database
     * @param {string} patientId - Patient's MongoDB ID
     * @returns {Promise<Object|null>} - Deleted patient object
     * @example
     * const deletedPatient = await adminRepository.deletePatient('507f1f77bcf86cd799439011');
     */
    deletePatient = async (patientId) => {
        return await patientsModel.findByIdAndDelete(patientId);
    }
}
