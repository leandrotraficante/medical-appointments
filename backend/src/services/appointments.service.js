import AppointmentsRepository from "../repositories/appointments.repository.js";
import UserRepository from "../repositories/user.repository.js";
import mongoose from 'mongoose';

const appointmentsRepository = new AppointmentsRepository();
const userRepository = new UserRepository();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createAppointmentService = async (appointmentData) => {
    const { patient, doctor, date } = appointmentData;
    
    if (!patient || !doctor || !date) {
        throw new Error('Patient, doctor and date are required');
    }

    const doctorExists = await userRepository.findUserByIdAndType(doctor, 'doctor');
    if (!doctorExists) {
        throw new Error('Doctor not found');
    }

    const patientExists = await userRepository.findUserByIdAndType(patient, 'patient');
    if (!patientExists) {
        throw new Error('Patient not found');
    }

    const newAppointment = await appointmentsRepository.createAppointment(appointmentData);
    return newAppointment;
};

const findAllAppointments = async (filters = {}) => {
    const appointments = await appointmentsRepository.findAllAppointments(filters);
    return appointments;
};

const findAppointmentById = async (appointmentId) => {
    if (!isValidObjectId(appointmentId)) {
        throw new Error('Invalid appointment ID format');
    }

    const appointmentById = await appointmentsRepository.findAppointmentById(appointmentId);
    if (!appointmentById) {
        throw new Error('Appointment not found');
    }
    return appointmentById;
};

const findAppointmentsByDoctor = async (doctorId, filters = {}) => {
    if (!isValidObjectId(doctorId)) {
        throw new Error('Invalid doctor ID format');
    }

    const doctor = await userRepository.findUserByIdAndType(doctorId, 'doctor');
    if (!doctor) {
        throw new Error('Doctor not found');
    }

    const appointments = await appointmentsRepository.findAppointmentsByDoctor(doctorId, filters);
    return appointments;
};

const findAppointmentsByPatient = async (patientId, filters = {}) => {
    if (!isValidObjectId(patientId)) {
        throw new Error('Invalid patient ID format');
    }

    const patient = await userRepository.findUserByIdAndType(patientId, 'patient');
    if (!patient) {
        throw new Error('Patient not found');
    }

    const appointments = await appointmentsRepository.findAppointmentsByPatient(patientId, filters);
    return appointments;
};

const findAppointmentsByDateRange = async (startDate, endDate, filters = {}) => {
    if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
    }

    const appointments = await appointmentsRepository.findAppointmentsByDateRange(startDate, endDate, filters);
    return appointments;
};

const findAppointmentsByStatus = async (status, filters = {}) => {
    if (!status) {
        throw new Error('Status is required');
    }

    const appointments = await appointmentsRepository.findAppointmentsByStatus(status, filters);
    return appointments;
};

const findAvailableSlots = async (doctorId, date) => {
    if (!isValidObjectId(doctorId)) {
        throw new Error('Invalid doctor ID format');
    }

    if (!date) {
        throw new Error('Date is required');
    }

    const doctor = await userRepository.findUserByIdAndType(doctorId, 'doctor');
    if (!doctor) {
        throw new Error('Doctor not found');
    }

    const availableSlots = await appointmentsRepository.findAvailableSlots(doctorId, date);
    return availableSlots;
};

const updateAppointmentStatus = async (appointmentId, newStatus) => {
    if (!isValidObjectId(appointmentId)) {
        throw new Error('Invalid appointment ID format');
    }

    if (!newStatus) {
        throw new Error('Status is required');
    }

    // Validar que el estado sea uno de los permitidos
    const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!allowedStatuses.includes(newStatus)) {
        throw new Error(`Invalid status. Allowed values: ${allowedStatuses.join(', ')}`);
    }

    // Verificar que el turno no esté cancelado antes de modificarlo
    const existingAppointment = await appointmentsRepository.findAppointmentById(appointmentId);
    if (!existingAppointment) {
        throw new Error('Appointment not found');
    }

    if (existingAppointment.status === 'cancelled') {
        throw new Error('Cannot modify cancelled appointment');
    }

    const appointmentToUpdate = await appointmentsRepository.updateAppointmentStatus(appointmentId, newStatus);
    if (!appointmentToUpdate) {
        throw new Error('Appointment not found');
    }

    return appointmentToUpdate;
};

const updateAppointmentDateTime = async (appointmentId, newDateTime) => {
    if (!isValidObjectId(appointmentId)) {
        throw new Error('Invalid appointment ID format');
    }

    if (!newDateTime) {
        throw new Error('New date and time is required');
    }

    // Validar que la nueva fecha sea futura
    if (newDateTime <= new Date()) {
        throw new Error('New appointment date must be in the future');
    }

    // Verificar que el turno no esté cancelado antes de modificarlo
    const existingAppointment = await appointmentsRepository.findAppointmentById(appointmentId);
    if (!existingAppointment) {
        throw new Error('Appointment not found');
    }

    if (existingAppointment.status === 'cancelled') {
        throw new Error('Cannot modify cancelled appointment');
    }

    const appointmentToUpdate = await appointmentsRepository.updateAppointmentDateTime(appointmentId, newDateTime);
    if (!appointmentToUpdate) {
        throw new Error('Appointment not found');
    }

    return appointmentToUpdate;
};

const deleteAppointment = async (appointmentId) => {
    if (!isValidObjectId(appointmentId)) {
        throw new Error('Invalid appointment ID format');
    }

    const deletedAppointment = await appointmentsRepository.deleteAppointment(appointmentId);
    if (!deletedAppointment) {
        throw new Error('Appointment not found');
    }

    return deletedAppointment;
};

const cancelAllDoctorAppointmentsInWeek = async (doctorId, startDate, endDate, reason) => {
    if (!isValidObjectId(doctorId)) {
        throw new Error('Invalid doctor ID format');
    }

    if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
    }

    const doctor = await userRepository.findUserByIdAndType(doctorId, 'doctor');
    if (!doctor) {
        throw new Error('Doctor not found');
    }

    const result = await appointmentsRepository.cancelAllDoctorAppointmentsInWeek(doctorId, startDate, endDate, reason);
    return result;
};

export default {
    createAppointmentService,
    findAllAppointments,
    findAppointmentById,
    findAppointmentsByDoctor,
    findAppointmentsByPatient,
    findAppointmentsByDateRange,
    findAppointmentsByStatus,
    findAvailableSlots,
    updateAppointmentStatus,
    updateAppointmentDateTime,
    deleteAppointment,
    cancelAllDoctorAppointmentsInWeek
};