import AppointmentsRepository from "../repositories/appointments.repository.js";
import UserRepository from "../repositories/user.repository.js";

const appointmentsRepository = new AppointmentsRepository();
const userRepository = new UserRepository();

/**
 * Creates a new appointment in the system
 * @param {Object} appointmentData - Appointment data object
 * @param {string} appointmentData.patient - Patient's MongoDB ID
 * @param {string} appointmentData.doctor - Doctor's MongoDB ID
 * @param {string|Date} appointmentData.date - Appointment date and time
 * @returns {Promise<Object>} - Created appointment object
 * @throws {Error} - If required fields are missing, patient not found, doctor not found, or date is invalid
 * @example
 * const appointmentData = {
 *   patient: '507f1f77bcf86cd799439011',
 *   doctor: '507f1f77bcf86cd799439012',
 *   date: '2024-01-15T10:00:00.000Z'
 * };
 * const newAppointment = await createAppointmentService(appointmentData);
 */
const createAppointmentService = async (appointmentData) => {
    const { patient, doctor, date } = appointmentData;
    
    const doctorExists = await userRepository.findDoctorById(doctor);
    if (!doctorExists) {
        throw new Error('Doctor not found');
    }

    // Validar que el doctor esté activo
    if (!doctorExists.isActive) {
        throw new Error('Cannot create appointment with inactive doctor');
    }

    const patientExists = await userRepository.findPatientById(patient);
    if (!patientExists) {
        throw new Error('Patient not found');
    }

    const newAppointment = await appointmentsRepository.createAppointment(appointmentData);
    return newAppointment;
};

/**
 * Retrieves all appointments with optional filtering
 * @param {Object} [filters={}] - Filter criteria for appointments
 * @param {string} [filters.status] - Filter by appointment status
 * @param {string} [filters.doctor] - Filter by doctor ID
 * @param {string} [filters.patient] - Filter by patient ID
 * @returns {Promise<Array>} - Array of appointment objects
 * @example
 * const allAppointments = await findAllAppointments();
 * const pendingAppointments = await findAllAppointments({ status: 'pending' });
 * const doctorAppointments = await findAllAppointments({ doctor: '507f1f77bcf86cd799439012' });
 */
const findAllAppointments = async (filters = {}, page = null, limit = null) => {
    const result = await appointmentsRepository.findAllAppointments(filters, page, limit);
    return result;
};



/**
 * Finds an appointment by its unique ID
 * @param {string} appointmentId - Appointment's MongoDB ID
 * @returns {Promise<Object>} - Appointment object with populated patient and doctor data
 * @throws {Error} - If appointment is not found
 * @example
 * const appointment = await findAppointmentById('507f1f77bcf86cd799439011');
 */
const findAppointmentById = async (appointmentId) => {
    const appointmentById = await appointmentsRepository.findAppointmentById(appointmentId);
    if (!appointmentById) {
        throw new Error('Appointment not found');
    }
    return appointmentById;
};

/**
 * Finds all appointments for a specific doctor
 * @param {string} doctorId - Doctor's MongoDB ID
 * @param {Object} [filters={}] - Additional filter criteria
 * @returns {Promise<Array>} - Array of appointment objects for the doctor
 * @throws {Error} - If doctor is not found
 * @example
 * const doctorAppointments = await findAppointmentsByDoctor('507f1f77bcf86cd799439012');
 * const pendingDoctorAppointments = await findAppointmentsByDoctor('507f1f77bcf86cd799439012', { status: 'pending' });
 */
const findAppointmentsByDoctor = async (doctorId, filters = {}) => {
    const doctor = await userRepository.findDoctorById(doctorId);
    if (!doctor) {
        throw new Error('Doctor not found');
    }

    const appointments = await appointmentsRepository.findAppointmentsByDoctor(doctorId, filters);
    return appointments;
};

/**
 * Finds all appointments for a specific patient
 * @param {string} patientId - Patient's MongoDB ID
 * @param {Object} [filters={}] - Additional filter criteria
 * @returns {Promise<Array>} - Array of appointment objects for the patient
 * @throws {Error} - If patient is not found
 * @example
 * const patientAppointments = await findAppointmentsByPatient('507f1f77bcf86cd799439011');
 * const confirmedPatientAppointments = await findAppointmentsByPatient('507f1f77bcf86cd799439011', { status: 'confirmed' });
 */
const findAppointmentsByPatient = async (patientId, filters = {}) => {
    const patient = await userRepository.findPatientById(patientId);
    if (!patient) {
        throw new Error('Patient not found');
    }

    const appointments = await appointmentsRepository.findAppointmentsByPatient(patientId, filters);
    return appointments;
};

/**
 * Finds appointments within a specific date range
 * @param {string|Date} startDate - Start date of the range
 * @param {string|Date} endDate - End date of the range
 * @param {Object} [filters={}] - Additional filter criteria
 * @returns {Promise<Array>} - Array of appointment objects within the date range
 * @throws {Error} - If start date or end date is missing
 * @example
 * const weekAppointments = await findAppointmentsByDateRange('2024-01-01', '2024-01-07');
 * const monthAppointments = await findAppointmentsByDateRange('2024-01-01', '2024-01-31', { status: 'confirmed' });
 */
const findAppointmentsByDateRange = async (startDate, endDate, filters = {}) => {
    if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
    }

    const appointments = await appointmentsRepository.findAppointmentsByDateRange(startDate, endDate, filters);
    return appointments;
};

/**
 * Finds appointments by their current status
 * @param {string} status - Appointment status to search for
 * @param {Object} [filters={}] - Additional filter criteria
 * @returns {Promise<Array>} - Array of appointment objects with the specified status
 * @throws {Error} - If status parameter is missing
 * @example
 * const pendingAppointments = await findAppointmentsByStatus('pending');
 * const confirmedAppointments = await findAppointmentsByStatus('confirmed', { doctor: '507f1f77bcf86cd799439012' });
 */
const findAppointmentsByStatus = async (status, filters = {}) => {
    if (!status) {
        throw new Error('Status is required');
    }

    const appointments = await appointmentsRepository.findAppointmentsByStatus(status, filters);
    return appointments;
};

/**
 * Finds available time slots for a doctor on a specific date
 * @param {string} doctorId - Doctor's MongoDB ID
 * @param {string|Date} date - Date to check for available slots
 * @returns {Promise<Array>} - Array of available time slot objects
 * @throws {Error} - If date is missing or doctor is not found
 * @example
 * const availableSlots = await findAvailableSlots('507f1f77bcf86cd799439012', '2024-01-15');
 * // Returns: [{ time: "2024-01-15T09:00:00.000Z", formatted: "09:00" }, ...]
 */
const findAvailableSlots = async (doctorId, date) => {
    const doctor = await userRepository.findDoctorById(doctorId);
    if (!doctor) {
        throw new Error('Doctor not found');
    }

    const availableSlots = await appointmentsRepository.findAvailableSlots(doctorId, date);
    return availableSlots;
};

/**
 * Updates the status of an existing appointment
 * @param {string} appointmentId - Appointment's MongoDB ID
 * @param {string} newStatus - New status for the appointment
 * @returns {Promise<Object>} - Updated appointment object
 * @throws {Error} - If status is missing, invalid, or appointment is cancelled
 * @example
 * const updatedAppointment = await updateAppointmentStatus('507f1f77bcf86cd799439011', 'confirmed');
 * // Valid statuses: 'pending', 'confirmed', 'cancelled', 'completed'
 */
const updateAppointmentStatus = async (appointmentId, newStatus) => {
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

    // Verificar que el doctor de la cita esté activo (excepto para cancelar)
    if (newStatus !== 'cancelled' && existingAppointment.doctor && !existingAppointment.doctor.isActive) {
        throw new Error('Cannot modify appointment with inactive doctor');
    }

    const appointmentToUpdate = await appointmentsRepository.updateAppointmentStatus(appointmentId, newStatus);
    if (!appointmentToUpdate) {
        throw new Error('Appointment not found');
    }

    return appointmentToUpdate;
};

/**
 * Updates the date and time of an existing appointment
 * @param {string} appointmentId - Appointment's MongoDB ID
 * @param {string|Date} newDateTime - New date and time for the appointment
 * @returns {Promise<Object>} - Updated appointment object
 * @throws {Error} - If new date is missing, not in future, or time slot unavailable
 * @example
 * const updatedAppointment = await updateAppointmentDateTime('507f1f77bcf86cd799439011', '2024-01-16T14:00:00.000Z');
 */
const updateAppointmentDateTime = async (appointmentId, newDateTime) => {
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

    // Verificar que el doctor de la cita esté activo
    if (existingAppointment.doctor && !existingAppointment.doctor.isActive) {
        throw new Error('Cannot modify appointment with inactive doctor');
    }

    const appointmentToUpdate = await appointmentsRepository.updateAppointmentDateTime(appointmentId, newDateTime);
    if (!appointmentToUpdate) {
        throw new Error('Appointment not found');
    }

    return appointmentToUpdate;
};

/**
 * Deletes (cancels) an existing appointment
 * @param {string} appointmentId - Appointment's MongoDB ID
 * @returns {Promise<Object>} - Deleted appointment object
 * @throws {Error} - If appointment is not found
 * @example
 * const deletedAppointment = await deleteAppointment('507f1f77bcf86cd799439011');
 */
const deleteAppointment = async (appointmentId) => {
    const deletedAppointment = await appointmentsRepository.deleteAppointment(appointmentId);
    if (!deletedAppointment) {
        throw new Error('Appointment not found');
    }

    return deletedAppointment;
};

/**
 * Cancels all appointments for a doctor within a specified week
 * @param {string} doctorId - Doctor's MongoDB ID
 * @param {string|Date} startDate - Start date of the week
 * @param {string|Date} endDate - End date of the week
 * @param {string} [reason] - Reason for cancellation (optional)
 * @returns {Promise<Object>} - Result object with count of cancelled appointments
 * @throws {Error} - If start date or end date is missing, or doctor is not found
 * @example
 * const result = await cancelAllDoctorAppointmentsInWeek('507f1f77bcf86cd799439012', '2024-01-15', '2024-01-21', 'Doctor on vacation');
 * // Returns: { modifiedCount: 5, acknowledged: true }
 */
const cancelAllDoctorAppointmentsInWeek = async (doctorId, startDate, endDate, reason) => {
    if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
    }

    const doctor = await userRepository.findDoctorById(doctorId);
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