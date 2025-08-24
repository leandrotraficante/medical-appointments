import UserRepository from "../repositories/user.repository.js";

const userRepository = new UserRepository();

const getAllDoctors = async () => {
    const doctors = await userRepository.getAllDoctors();
    return doctors;
};

const getAllPatients = async () => {
    const patients = await userRepository.getAllPatients();
    return patients;
};

const findActiveDoctors = async () => {
    const activeDoctors = await userRepository.findActiveDoctors();
    return activeDoctors;
};

const findActivePatients = async () => {
    const activePatients = await userRepository.findActivePatients();
    return activePatients;
};

const findInactiveDoctors = async () => {
    const inactiveDoctors = await userRepository.findInactiveDoctors();
    return inactiveDoctors;
};

const findInactivePatients = async () => {
    const inactivePatients = await userRepository.findInactivePatients();
    return inactivePatients;
};

const findUserByIdAndRole = async (userId, role) => {
    if (!userId || !role) {
        throw new Error('User ID and role are required');
    }
    
    const user = await userRepository.findUserByIdAndRole(userId, role);
    if (!user) {
        throw new Error('User not found');
    }
    
    if (!user.isActive) {
        throw new Error('User account is deactivated');
    }
    
    return user;
};

const findDoctorByLicense = async (license) => {
    if (!license) {
        throw new Error('License is required');
    }
    
    const doctor = await userRepository.findDoctorByLicense(license);
    if (!doctor) {
        throw new Error('Doctor not found');
    }
    
    return doctor;
};

const findDoctorByPersonalId = async (personalId) => {
    if (!personalId) {
        throw new Error('Personal ID is required');
    }
    
    const doctor = await userRepository.findDoctorByPersonalId(personalId);
    if (!doctor) {
        throw new Error('Doctor not found');
    }
    
    return doctor;
};

const findDoctorByEmail = async (email) => {
    if (!email) {
        throw new Error('Email is required');
    }
    
    const doctor = await userRepository.findDoctorByEmail(email);
    if (!doctor) {
        throw new Error('Doctor not found');
    }
    
    return doctor;
};

const findPatientByPersonalId = async (personalId) => {
    if (!personalId) {
        throw new Error('Personal ID is required');
    }
    
    const patient = await userRepository.findPatientByPersonalId(personalId);
    if (!patient) {
        throw new Error('Patient not found');
    }
    
    return patient;
};

const findPatientByEmail = async (email) => {
    if (!email) {
        throw new Error('Email is required');
    }
    
    const patient = await userRepository.findPatientByEmail(email);
    if (!patient) {
        throw new Error('Patient not found');
    }
    
    return patient;
};

const searchDoctorsByName = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
        throw new Error('Search term is required');
    }
    
    const doctors = await userRepository.searchDoctorsByName(searchTerm);
    return doctors;
};

const searchPatientsByName = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
        throw new Error('Search term is required');
    }
    
    const patients = await userRepository.searchPatientsByName(searchTerm);
    return patients;
};

export default {
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