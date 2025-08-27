import AdminRepository from '../repositories/admin.repository.js';

const adminRepository = new AdminRepository();

// ===== ADMIN MANAGEMENT =====

/**
 * Retrieves admin profile information
 * @param {string} adminId - Admin's MongoDB ID
 * @returns {Promise<Object>} - Admin profile object
 * @throws {Error} - If admin ID format is invalid or admin not found
 * @example
 * const adminProfile = await getAdminProfile('507f1f77bcf86cd799439011');
 */
const getAdminProfile = async (adminId) => {
    const adminProfile = await adminRepository.getAdminProfile(adminId);
    if (!adminProfile) {
        throw new Error('Admin not found');
    }
    return adminProfile;
};

/**
 * Retrieves all admins from the database
 * @returns {Promise<Array>} - Array of all admin documents
 * @example
 * const admins = await getAllAdmins();
 * console.log(`Found ${admins.length} admins`);
 */
const getAllAdmins = async () => {
    const admins = await adminRepository.getAllAdmins();
    return admins;
};

// ===== DOCTOR MANAGEMENT =====

/**
 * Activates a doctor account
 * @param {string} doctorId - Doctor's MongoDB ID
 * @returns {Promise<Object>} - Activated doctor object
 * @throws {Error} - If doctor ID format is invalid or doctor not found
 * @example
 * const activatedDoctor = await activateDoctor('507f1f77bcf86cd799439011');
 */
const activateDoctor = async (doctorId) => {
    const activatedDoctor = await adminRepository.activateDoctor(doctorId);
    return activatedDoctor;
};

/**
 * Deactivates a doctor account
 * @param {string} doctorId - Doctor's MongoDB ID
 * @returns {Promise<Object>} - Deactivated doctor object
 * @throws {Error} - If doctor ID format is invalid or doctor not found
 * @example
 * const deactivatedDoctor = await deactivateDoctor('507f1f77bcf86cd799439011');
 */
const deactivateDoctor = async (doctorId) => {
    const deactivatedDoctor = await adminRepository.deactivateDoctor(doctorId);
    return deactivatedDoctor;
};

/**
 * Updates doctor information
 * @param {string} doctorId - Doctor's MongoDB ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated doctor object
 * @throws {Error} - If doctor ID format is invalid, doctor not found, or update data is invalid
 * @example
 * const updatedDoctor = await updateDoctor('507f1f77bcf86cd799439011', { specialties: ['Cardiology'] });
 */
const updateDoctor = async (doctorId, updateData) => {
    // Prevent updating sensitive fields
    const allowedFields = ['name', 'lastname', 'phone', 'dateOfBirth', 'specialties'];
    const filteredData = {};

    Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
            filteredData[key] = updateData[key];
        }
    });

    if (Object.keys(filteredData).length === 0) {
        throw new Error('No valid fields to update');
    }

    const updatedDoctor = await adminRepository.updateDoctor(doctorId, filteredData);
    if (!updatedDoctor) {
        throw new Error('Doctor not found');
    }

    return updatedDoctor;
};

/**
 * Deletes a doctor (sets isActive to false)
 * @param {string} doctorId - Doctor's MongoDB ID
 * @returns {Promise<Object>} - Deactivated doctor object
 * @throws {Error} - If doctor ID format is invalid or doctor not found
 * @example
 * const deactivatedDoctor = await deleteDoctor('507f1f77bcf86cd799439011');
 */
const deleteDoctor = async (doctorId) => {
    const deactivatedDoctor = await adminRepository.deleteDoctor(doctorId);
    if (!deactivatedDoctor) {
        throw new Error('Doctor not found');
    }
    
    return deactivatedDoctor;
};

// ===== PATIENT MANAGEMENT =====

/**
 * Activates a patient account
 * @param {string} patientId - Patient's MongoDB ID
 * @returns {Promise<Object>} - Activated patient object
 * @throws {Error} - If patient ID format is invalid or patient not found
 * @example
 * const activatedPatient = await activatePatient('507f1f77bcf86cd799439011');
 */
const activatePatient = async (patientId) => {
    const activatedPatient = await adminRepository.activatePatient(patientId);
    return activatedPatient;
};

/**
 * Deactivates a patient account
 * @param {string} patientId - Patient's MongoDB ID
 * @returns {Promise<Object>} - Deactivated patient object
 * @throws {Error} - If patient ID format is invalid or patient not found
 * @example
 * const deactivatedPatient = await deactivatePatient('507f1f77bcf86cd799439011');
 */
const deactivatePatient = async (patientId) => {
    const deactivatedPatient = await adminRepository.deactivatePatient(patientId);
    return deactivatedPatient;
};

/**
 * Updates patient information
 * @param {string} patientId - Patient's MongoDB ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated patient object
 * @throws {Error} - If patient ID format is invalid, patient not found, or update data is invalid
 * @example
 * const updatedPatient = await updatePatient('507f1f77bcf86cd799439011', { phone: '123456789' });
 */
const updatePatient = async (patientId, updateData) => {
    // Prevent updating sensitive fields
    const allowedFields = ['name', 'lastname', 'phone', 'dateOfBirth'];
    const filteredData = {};

    for (const key in updateData) {
        if (allowedFields.includes(key)) {
            filteredData[key] = updateData[key];
        }
    }

    if (Object.keys(filteredData).length === 0) {
        throw new Error('No valid fields to update');
    }

    const updatedPatient = await adminRepository.updatePatient(patientId, filteredData);
    if (!updatedPatient) {
        throw new Error('Patient not found');
    }

    return updatedPatient;
};

/**
 * Deletes a patient (sets isActive to false)
 * @param {string} patientId - Patient's MongoDB ID
 * @returns {Promise<Object>} - Deactivated patient object
 * @throws {Error} - If patient ID format is invalid or patient not found
 * @example
 * const deactivatedPatient = await deletePatient('507f1f77bcf86cd799439011');
 */
const deletePatient = async (patientId) => {
    const deactivatedPatient = await adminRepository.deletePatient(patientId);
    if (!deactivatedPatient) {
        throw new Error('Patient not found');
    }
    
    return deactivatedPatient;
};

export default {
    getAllAdmins,
    getAdminProfile,
    activateDoctor,
    deactivateDoctor,
    updateDoctor,
    deleteDoctor,
    activatePatient,
    deactivatePatient,
    updatePatient,
    deletePatient
};
