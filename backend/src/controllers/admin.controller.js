import adminService from '../services/admin.service.js';

// ===== ADMIN MANAGEMENT =====

/**
 * Retrieves all admins from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with all admins
 * @example
 * GET /api/admin/admins
 * // Returns: { success: true, data: [...], message: "Found X admin(s)" }
 */
const getAllAdmins = async (req, res) => {
    try {
        const admins = await adminService.getAllAdmins();
        
        res.status(200).json({
            success: true,
            data: admins,
            message: `Found ${admins.length} admin(s)`
        });
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve admins. Please try again later' });
    }
};

// ===== DOCTOR MANAGEMENT =====

/**
 * Activates a doctor account
 * @param {Object} req - Express request object
 * @param {string} req.params.doctorId - Doctor's MongoDB ID
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with activated doctor data
 * @example
 * PUT /api/admin/doctors/:doctorId/activate
 * // Returns: { success: true, data: {...}, message: "Doctor activated successfully" }
 */
const activateDoctor = async (req, res) => {
    const { doctorId } = req.params;
    
    try {
        const activatedDoctor = await adminService.activateDoctor(doctorId);
        
        if (!activatedDoctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        
        res.status(200).json({
            success: true,
            data: activatedDoctor,
            message: 'Doctor activated successfully'
        });
    } catch (error) {
        if (error.message === 'Doctor not found') {
            res.status(404).json({ error: 'Doctor not found' });
        } else {
            res.status(500).json({ error: 'Unable to activate doctor. Please try again later' });
        }
    }
};

/**
 * Deactivates a doctor account
 * @param {Object} req - Express request object
 * @param {string} req.params.doctorId - Doctor's MongoDB ID
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with deactivated doctor data
 * @example
 * PUT /api/admin/doctors/:doctorId/deactivate
 * // Returns: { success: true, data: {...}, message: "Doctor deactivated successfully" }
 */
const deactivateDoctor = async (req, res) => {
    const { doctorId } = req.params;
    
    try {
        const deactivatedDoctor = await adminService.deactivateDoctor(doctorId);
        
        if (!deactivatedDoctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        
        res.status(200).json({
            success: true,
            data: deactivatedDoctor,
            message: 'Doctor deactivated successfully'
        });
    } catch (error) {
        if (error.message === 'Doctor not found') {
            res.status(404).json({ error: 'Doctor not found' });
        } else {
            res.status(500).json({ error: 'Unable to deactivate doctor. Please try again later' });
        }
    }
};

/**
 * Updates doctor information
 * @param {Object} req - Express request object
 * @param {string} req.params.doctorId - Doctor's MongoDB ID
 * @param {Object} req.body - Data to update
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with updated doctor data
 * @example
 * PUT /api/admin/doctors/:doctorId
 * // Body: { specialties: ["Cardiology"] }
 * // Returns: { success: true, data: {...}, message: "Doctor updated successfully" }
 */
const updateDoctor = async (req, res) => {
    const { doctorId } = req.params;
    const updateData = req.body;
    
    try {
        const updatedDoctor = await adminService.updateDoctor(doctorId, updateData);
        
        res.status(200).json({
            success: true,
            data: updatedDoctor,
            message: 'Doctor updated successfully'
        });
    } catch (error) {
        if (error.message === 'Doctor not found') {
            res.status(404).json({ error: 'Doctor not found' });
        } else if (error.message === 'Update data is required' || error.message === 'No valid fields to update') {
            res.status(400).json({ error: 'Invalid update data provided' });
        } else {
            res.status(500).json({ error: 'Unable to update doctor. Please try again later' });
        }
    }
};

/**
 * Deletes a doctor completely from the database
 * @param {Object} req - Express request object
 * @param {string} req.params.doctorId - Doctor's MongoDB ID
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with deleted doctor data
 * @example
 * DELETE /api/admin/doctors/:doctorId
 * // Returns: { success: true, data: {...}, message: "Doctor deleted successfully" }
 */
const deleteDoctor = async (req, res) => {
    const { doctorId } = req.params;
    
    try {
        const deletedDoctor = await adminService.deleteDoctor(doctorId);
        
        res.status(200).json({
            success: true,
            data: deletedDoctor,
            message: 'Doctor deleted successfully'
        });
    } catch (error) {
        if (error.message === 'Doctor not found') {
            res.status(404).json({ error: 'Doctor not found' });
        } else {
            res.status(500).json({ error: 'Unable to delete doctor. Please try again later' });
        }
    }
};

// ===== PATIENT MANAGEMENT =====

/**
 * Activates a patient account
 * @param {Object} req - Express request object
 * @param {string} req.params.patientId - Patient's MongoDB ID
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with activated patient data
 * @example
 * PUT /api/admin/patients/:patientId/activate
 * // Returns: { success: true, data: {...}, message: "Patient activated successfully" }
 */
const activatePatient = async (req, res) => {
    const { patientId } = req.params;
    
    try {
        const activatedPatient = await adminService.activatePatient(patientId);
        
        if (!activatedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        res.status(200).json({
            success: true,
            data: activatedPatient,
            message: 'Patient activated successfully'
        });
    } catch (error) {
        if (error.message === 'Patient not found') {
            res.status(404).json({ error: 'Patient not found' });
        } else {
            res.status(500).json({ error: 'Unable to activate patient. Please try again later' });
        }
    }
};

/**
 * Deactivates a patient account
 * @param {Object} req - Express request object
 * @param {string} req.params.patientId - Patient's MongoDB ID
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with deactivated patient data
 * @example
 * PUT /api/admin/patients/:patientId/deactivate
 * // Returns: { success: true, data: {...}, message: "Patient deactivated successfully" }
 */
const deactivatePatient = async (req, res) => {
    const { patientId } = req.params;
    
    try {
        const deactivatedPatient = await adminService.deactivatePatient(patientId);
        
        if (!deactivatedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        res.status(200).json({
            success: true,
            data: deactivatedPatient,
            message: 'Patient deactivated successfully'
        });
    } catch (error) {
        if (error.message === 'Patient not found') {
            res.status(404).json({ error: 'Patient not found' });
        } else {
            res.status(500).json({ error: 'Unable to deactivate patient. Please try again later' });
        }
    }
};

/**
 * Updates patient information
 * @param {Object} req - Express request object
 * @param {string} req.params.patientId - Patient's MongoDB ID
 * @param {Object} req.body - Data to update
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with updated patient data
 * @example
 * PUT /api/admin/patients/:patientId
 * // Body: { phone: "123456789" }
 * // Returns: { success: true, data: {...}, message: "Patient updated successfully" }
 */
const updatePatient = async (req, res) => {
    const { patientId } = req.params;
    const updateData = req.body;
    
    try {
        const updatedPatient = await adminService.updatePatient(patientId, updateData);
        
        res.status(200).json({
            success: true,
            data: updatedPatient,
            message: 'Patient updated successfully'
        });
    } catch (error) {
        if (error.message === 'Patient not found') {
            res.status(404).json({ error: 'Patient not found' });
        } else if (error.message === 'Update data is required' || error.message === 'No valid fields to update') {
            res.status(400).json({ error: 'Invalid update data provided' });
        } else {
            res.status(500).json({ error: 'Unable to update patient. Please try again later' });
        }
    }
};

/**
 * Deletes a patient completely from the database
 * @param {Object} req - Express request object
 * @param {string} req.params.patientId - Patient's MongoDB ID
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with deleted patient data
 * @example
 * DELETE /api/admin/patients/:patientId
 * // Returns: { success: true, data: {...}, message: "Patient deleted successfully" }
 */
const deletePatient = async (req, res) => {
    const { patientId } = req.params;
    
    try {
        const deletedPatient = await adminService.deletePatient(patientId);
        
        res.status(200).json({
            success: true,
            data: deletedPatient,
            message: 'Patient deleted successfully'
        });
    } catch (error) {
        if (error.message === 'Patient not found') {
            res.status(404).json({ error: 'Patient not found' });
        } else {
            res.status(500).json({ error: 'Unable to delete patient. Please try again later' });
        }
    }
};

export {
    // Admin Management
    getAllAdmins,
    
    // Doctor Management
    activateDoctor,
    deactivateDoctor,
    updateDoctor,
    deleteDoctor,
    
    // Patient Management
    activatePatient,
    deactivatePatient,
    updatePatient,
    deletePatient
};
