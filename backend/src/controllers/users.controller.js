import userService from "../services/user.service.js";
import { isValidObjectId } from "../utils/validation.js";
import configs, { ROLE_CONFIG } from '../config/configs.js';

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await userService.getAllDoctors()
        res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        if (error?.message === 'No doctors found') {
            res.status(404).json({ error: 'No doctors found' });
        } else {
            res.status(500).json({ error: 'Unable to get doctors. Please try again later' });
        }
    }
}

const getAllPatients = async (req, res) => {
    try {
        const patients = await userService.getAllPatients()
        res.status(200).json({ success: true, data: patients });
    } catch (error) {
        if (error?.message === 'No patients found') {
            res.status(404).json({ error: 'No patients found' });
        } else {
            res.status(500).json({ error: 'Unable to get patients. Please try again later' });
        }
    }
}

const findActiveDoctors = async (req, res) => {
    try {
        const activeDoctors = await userService.findActiveDoctors();
        res.status(200).json({ success: true, data: activeDoctors });
    } catch (error) {
        if (error?.message === 'No active doctors found') {
            res.status(404).json({ error: 'No active doctors found' });
        } else {
            res.status(500).json({ error: 'Unable to get active doctors. Please try again later' });
        }
    }
}

const findActivePatients = async (req, res) => {
    try {
        const activePatients = await userService.findActivePatients();
        res.status(200).json({ success: true, data: activePatients });
    } catch (error) {
        if (error?.message === 'No active patients found') {
            res.status(404).json({ error: 'No active patients found' });
        } else {
            res.status(500).json({ error: 'Unable to get active patients. Please try again later' });
        }
    }
}


const findInactiveDoctors = async (req, res) => {
    try {
        const inactiveDoctors = await userService.findInactiveDoctors();
        res.status(200).json({ success: true, data: inactiveDoctors });
    } catch (error) {
        if (error?.message === 'No inactive doctors found') {
            res.status(404).json({ error: 'No inactive doctors found' });
        } else {
            res.status(500).json({ error: 'Unable to get inactive doctors. Please try again later' });
        }
    }
}

const findInactivePatients = async (req, res) => {
    try {
        const inactivePatients = await userService.findInactivePatients();
        res.status(200).json({ success: true, data: inactivePatients });
    } catch (error) {
        if (error?.message === 'No inactive patients found') {
            res.status(404).json({ error: 'No inactive patients found' });
        } else {
            res.status(500).json({ error: 'Unable to get inactive patients. Please try again later' });
        }
    }
}

const findUserByIdAndRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    if (!role) {
        return res.status(400).json({ error: 'Role is required' });
    }


    if (!isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (!ROLE_CONFIG.validRoles.includes(role)) {
        return res.status(400).json({ 
            error: `Invalid role. Allowed values: ${ROLE_CONFIG.validRoles.join(', ')}` 
        });
    }

    try {
        const userByIdAndRole = await userService.findUserByIdAndRole(userId, role);
        res.status(200).json({ success: true, data: userByIdAndRole });
    } catch (error) {
        res.status(500).json({ error: 'Unable to get user. Please try again later' });
    }
}

const findDoctorByLicense = async (req, res) => {
    const { license } = req.params;
    
    if (!license) {
        return res.status(400).json({ error: 'License is required' });
    }
    
    try {
        const doctor = await userService.findDoctorByLicense(license);
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        if (error?.message === 'Doctor not found') {
            res.status(404).json({ error: 'Doctor not found' });
        } else {
            res.status(500).json({ error: 'Unable to get doctor. Please try again later' });
        }
    }
}

const findDoctorByPersonalId = async (req, res) => {
    const { personalId } = req.params;
    
    if (!personalId) {
        return res.status(400).json({ error: 'Personal ID is required' });
    }
    
    try {
        const doctor = await userService.findDoctorByPersonalId(personalId);
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        if (error?.message === 'Doctor not found') {
            res.status(404).json({ error: 'Doctor not found' });
        } else {
            res.status(500).json({ error: 'Unable to get doctor. Please try again later' });
        }
    }
}

const findDoctorByEmail = async (req, res) => {
    const { email } = req.params;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    try {
        const doctor = await userService.findDoctorByEmail(email);
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        if (error?.message === 'Doctor not found') {
            res.status(404).json({ error: 'Doctor not found' });
        } else {
            res.status(500).json({ error: 'Unable to get doctor. Please try again later' });
        }
    }
}

const findPatientByPersonalId = async (req, res) => {
    const { personalId } = req.params;
    
    if (!personalId) {
        return res.status(400).json({ error: 'Personal ID is required' });
    }
    
    try {
        const patient = await userService.findPatientByPersonalId(personalId);
        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        if (error?.message === 'Patient not found') {
            res.status(404).json({ error: 'Patient not found' });
        } else {
            res.status(500).json({ error: 'Unable to get patient. Please try again later' });
        }
    }
}

const findPatientByEmail = async (req, res) => {
    const { email } = req.params;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    try {
        const patient = await userService.findPatientByEmail(email);
        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        if (error?.message === 'Patient not found') {
            res.status(404).json({ error: 'Patient not found' });
        } else {
            res.status(500).json({ error: 'Unable to get patient. Please try again later' });
        }
    }
}

const searchDoctorsByName = async (req, res) => {
    const { searchTerm } = req.query;
    
    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ error: 'Search term is required' });
    }
    
    try {
        const doctors = await userService.searchDoctorsByName(searchTerm);
        res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        if (error?.message === 'No doctors found with that name') {
            res.status(404).json({ error: 'No doctors found with that name' });
        } else {
            res.status(500).json({ error: 'Unable to search doctors. Please try again later' });
        }
    }
}

const searchPatientsByName = async (req, res) => {
    const { searchTerm } = req.query;
    
    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ error: 'Search term is required' });
    }
    
    try {
        const patients = await userService.searchPatientsByName(searchTerm);
        res.status(200).json({ success: true, data: patients });
    } catch (error) {
        if (error?.message === 'No patients found with that name') {
            res.status(404).json({ error: 'No patients found with that name' });
        } else {
            res.status(500).json({ error: 'Unable to search patients. Please try again later' });
        }
    }
}

export {
    getAllDoctors,
    getAllPatients,
    findActiveDoctors,
    findActivePatients,
    findInactiveDoctors,
    findInactivePatients,
    findUserByIdAndRole,
    findDoctorByLicense,
    findDoctorByPersonalId,
    findDoctorByEmail,
    findPatientByPersonalId,
    findPatientByEmail,
    searchDoctorsByName,
    searchPatientsByName
};