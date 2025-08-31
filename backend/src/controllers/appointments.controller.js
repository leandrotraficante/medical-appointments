import appointmentsService from "../services/appointments.service.js";
import { isValidObjectId } from "../utils/validation.js";

/**
 * Creates a new appointment in the system
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing appointment data
 * @param {string} req.body.patient - Patient's MongoDB ID (required)
 * @param {string} req.body.doctor - Doctor's MongoDB ID (required)
 * @param {string} req.body.date - Appointment date and time (required)
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with created appointment data
 * @throws {Error} - If patient/doctor not found, invalid date, or time slot unavailable
 * @example
 * POST /api/appointments
 * Body: {
 *   "patient": "507f1f77bcf86cd799439011",
 *   "doctor": "507f1f77bcf86cd799439012",
 *   "date": "2024-01-15T10:00:00.000Z"
 * }
 */
const createAppointment = async (req, res) => {
    try {
        const { patient, doctor, date } = req.body;
        if (!patient || !doctor || !date) {
            return res.status(400).json({ error: 'Patient, doctor and date are required' });
        }

        if (isNaN(new Date(date).getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        const appointmentData = { patient, doctor, date };
        const newAppointment = await appointmentsService.createAppointmentService(appointmentData);
        res.status(201).json({ success: true, data: newAppointment });
    } catch (error) {
        
        if (error?.message === 'Patient not found') {
            res.status(404).json({ error: 'The specified patient was not found' });
        } else if (error?.message === 'Doctor not found') {
            res.status(404).json({ error: 'The specified doctor was not found' });
        } else if (error?.message === 'Cannot create appointment with inactive doctor') {
            res.status(400).json({ error: 'Cannot create appointment with inactive doctor. Please select an active doctor.' });
        } else if (error?.message === 'Appointment date must be in the future') {
            res.status(400).json({ error: 'Appointment date must be in the future' });
        } else if (error?.message === 'The doctor already has an appointment at this date and time') {
            res.status(400).json({ error: 'The doctor is not available at this time. Please choose another time slot' });
        } else {
            res.status(500).json({ error: 'Unable to create appointment. Please try again later' });
        }
    }
};

/**
 * Retrieves all appointments with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters for filtering
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with filtered appointments
 * @example
 * GET /api/appointments?status=pending&doctor=507f1f77bcf86cd799439012
 * // Returns: { success: true, data: [appointment1, appointment2, ...] }
 */
const getAllAppointments = async (req, res) => {
    try {
        const filters = req.query;
        
        // Extraer parámetros de paginación
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Remover parámetros de paginación de los filtros
        const { page: _, limit: __, ...cleanFilters } = filters;
        
        const result = await appointmentsService.findAllAppointments(cleanFilters, page, limit);
        res.status(200).json({ 
            success: true, 
            data: result.appointments,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(result.total / limit),
                totalItems: result.total,
                itemsPerPage: limit,
                hasNextPage: page < Math.ceil(result.total / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        if (error?.message === 'Invalid filter format') {
            res.status(400).json({ error: 'Invalid filter format. Please check your search parameters' });
        } else {
            res.status(500).json({ error: 'Unable to fetch appointments. Please try again later' });
        }
    }
};

/**
 * Retrieves appointments for the currently logged-in user
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters for filtering
 * @param {Object} req.user - User object from authentication middleware
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with user's appointments
 * @example
 * GET /api/appointments/my-appointments?status=pending
 * // Returns: { success: true, data: [user's appointments] }
 */
const getMyAppointments = async (req, res) => {
    try {
        const filters = req.query;
        const { id: userId, role: userRole } = req.user;
        
        // Extraer parámetros de paginación
        const page = parseInt(req.query.page) || null;
        const limit = parseInt(req.query.limit) || null;
        
        // Remover parámetros de paginación de los filtros
        const { page: _, limit: __, ...cleanFilters } = filters;
        
        // Filtrar según el rol del usuario
        if (userRole === 'patient') {
            cleanFilters.patient = userId;
        } else if (userRole === 'doctor') {
            cleanFilters.doctor = userId;
        }
        // Admin ve todas las citas (no se filtra)
        
        const result = await appointmentsService.findAllAppointments(cleanFilters, page, limit);
        
        // Si hay paginación, devolver con metadata
        if (page && limit && result.pagination) {
            res.status(200).json({ 
                success: true, 
                data: result.appointments,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(result.total / limit),
                    totalItems: result.total,
                    itemsPerPage: limit,
                    hasNextPage: page < Math.ceil(result.total / limit),
                    hasPrevPage: page > 1
                }
            });
        } else {
            // Sin paginación (comportamiento original)
            res.status(200).json({ success: true, data: result });
        }
    } catch (error) {
        if (error?.message === 'Invalid filter format') {
            res.status(400).json({ error: 'Invalid filter format. Please check your search parameters' });
        } else {
            res.status(500).json({ error: 'Unable to fetch your appointments. Please try again later' });
        }
    }
};

/**
 * Retrieves a specific appointment by its ID
 * @param {Object} req - Express request object
 * @param {string} req.params.appointmentId - Appointment's MongoDB ID
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with appointment data
 * @throws {Error} - If appointment ID format is invalid or appointment not found
 * @example
 * GET /api/appointments/507f1f77bcf86cd799439011
 * // Returns: { success: true, data: { appointment details } }
 */
const getAppointmentById = async (req, res) => {
    const { appointmentId } = req.params;
    
    if (!isValidObjectId(appointmentId)) {
        return res.status(400).json({ error: 'Invalid appointment ID format' });
    }
    
    try {
        const appointmentById = await appointmentsService.findAppointmentById(appointmentId);
        res.status(200).json({ success: true, data: appointmentById });
    } catch (error) {
        if (error?.message === 'Appointment not found') {
            res.status(404).json({ error: 'Appointment not found' });
        } else {
            res.status(500).json({ error: 'Unable to fetch appointment. Please try again later' });
        }
    }
};

/**
 * Retrieves all appointments for a specific doctor
 * @param {Object} req - Express request object
 * @param {string} req.params.doctorId - Doctor's MongoDB ID
 * @param {Object} req.query - Query parameters for filtering
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with doctor's appointments
 * @throws {Error} - If doctor ID format is invalid or doctor not found
 * @example
 * GET /api/appointments/doctor/507f1f77bcf86cd799439012?status=pending
 * // Returns: { success: true, data: [appointment1, appointment2, ...] }
 */
const getAppointmentByDoctor = async (req, res) => {
    const { doctorId } = req.params;
    const filters = req.query;

    if (!doctorId) {
        return res.status(400).json({ error: 'Doctor ID is required' });
    }

    if (!isValidObjectId(doctorId)) {
        return res.status(400).json({ error: 'Invalid doctor ID format' });
    }

    try {
        const appointmentByDoctor = await appointmentsService.findAppointmentsByDoctor(doctorId, filters);
        res.status(200).json({ success: true, data: appointmentByDoctor });
    } catch (error) {
        if (error?.message === 'Doctor not found') {
            res.status(404).json({ error: 'The specified doctor was not found' });
        } else {
            res.status(500).json({ error: 'Unable to fetch doctor appointments. Please try again later' });
        }
    }
};

/**
 * Retrieves all appointments for a specific patient
 * @param {Object} req - Express request object
 * @param {string} req.params.patientId - Patient's MongoDB ID
 * @param {Object} req.query - Query parameters for filtering
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with patient's appointments
 * @throws {Error} - If patient ID format is invalid or patient not found
 * @example
 * GET /api/appointments/patient/507f1f77bcf86cd799439011?status=confirmed
 * // Returns: { success: true, data: [appointment1, appointment2, ...] }
 */
const getAppointmentByPatient = async (req, res) => {
    const { patientId } = req.params;
    const filters = req.query;

    if (!patientId) {
        return res.status(400).json({ error: 'Patient ID is required' });
    }

    if (!isValidObjectId(patientId)) {
        return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    try {
        const appointmentByPatient = await appointmentsService.findAppointmentsByPatient(patientId, filters);
        res.status(200).json({ success: true, data: appointmentByPatient });
    } catch (error) {
        if (error?.message === 'Patient not found') {
            res.status(404).json({ error: 'The specified patient was not found' });
        } else {
            res.status(500).json({ error: 'Unable to fetch patient appointments. Please try again later' });
        }
    }
};

/**
 * Searches appointments within a specific date range
 * @param {Object} req - Express request object
 * @param {string} req.query.startDate - Start date for search range (required)
 * @param {string} req.query.endDate - End date for search range (required)
 * @param {Object} req.query - Additional query parameters for filtering
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with appointments in date range
 * @throws {Error} - If date range is invalid or dates are malformed
 * @example
 * GET /api/appointments/date-range?startDate=2024-01-01&endDate=2024-01-31&status=pending
 * // Returns: { success: true, data: [appointment1, appointment2, ...] }
 */
const findAppointmentsByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;
    const filters = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
    }

    if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
    }

    try {
        const appointments = await appointmentsService.findAppointmentsByDateRange(startDate, endDate, filters);
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        if (error?.message === 'Invalid date range') {
            res.status(400).json({ error: 'Invalid date range. Please check your start and end dates' });
        } else {
            res.status(500).json({ error: 'Unable to search appointments by date range. Please try again later' });
        }
    }
};

/**
 * Searches appointments by their current status
 * @param {Object} req - Express request object
 * @param {string} req.query.status - Appointment status to search for (required)
 * @param {Object} req.query - Additional query parameters for filtering
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with appointments matching the status
 * @throws {Error} - If status parameter is missing or invalid
 * @example
 * GET /api/appointments/status?status=pending&doctor=507f1f77bcf86cd799439012
 * // Returns: { success: true, data: [pending appointment1, pending appointment2, ...] }
 */
const findAppointmentsByStatus = async (req, res) => {
    const { status } = req.query;
    const filters = req.query;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    try {
        const appointments = await appointmentsService.findAppointmentsByStatus(status, filters);
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        if (error?.message === 'Invalid status format') {
            res.status(400).json({ error: 'Invalid status format. Please check your status parameter' });
        } else {
            res.status(500).json({ error: 'Unable to search appointments by status. Please try again later' });
        }
    }
};

/**
 * Gets available time slots for a doctor on a specific date
 * @param {Object} req - Express request object
 * @param {string} req.params.doctorId - Doctor's MongoDB ID
 * @param {string} req.query.date - Date to check for available slots (required)
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with available time slots
 * @throws {Error} - If doctor ID format is invalid, doctor not found, or date is missing
 * @example
 * GET /api/appointments/available-slots/507f1f77bcf86cd799439012?date=2024-01-15
 * // Returns: { success: true, data: [{ time: "2024-01-15T09:00:00.000Z", formatted: "09:00" }, ...] }
 */
const getAvailableSlots = async (req, res) => {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!doctorId) {
        return res.status(400).json({ error: 'Doctor ID is required' });
    }

    if (!isValidObjectId(doctorId)) {
        return res.status(400).json({ error: 'Invalid doctor ID format' });
    }
    
    if (!date) {
        return res.status(400).json({ error: 'Date is required' });
    }
    
    if (isNaN(new Date(date).getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
    }
    
    try {
        const availableSlots = await appointmentsService.findAvailableSlots(doctorId, date);
        res.status(200).json({ success: true, data: availableSlots });
    } catch (error) {
        if (error?.message === 'Doctor not found') {
            res.status(404).json({ error: 'The specified doctor was not found' });
        } else {
            res.status(500).json({ error: 'Unable to fetch available time slots. Please try again later' });
        }
    }
};

/**
 * Updates the status of an existing appointment
 * @param {Object} req - Express request object
 * @param {string} req.params.appointmentId - Appointment's MongoDB ID
 * @param {string} req.body.status - New status for the appointment (required)
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with updated appointment data
 * @throws {Error} - If appointment ID format is invalid, status is invalid, or appointment not found
 * @example
 * PUT /api/appointments/507f1f77bcf86cd799439011/status
 * Body: { "status": "confirmed" }
 * // Returns: { success: true, data: { updated appointment } }
 */
const updateAppointmentStatus = async (req, res) => {
    const { appointmentId } = req.params;
    const newStatus = req.body.status;
    
    if (!isValidObjectId(appointmentId)) {
        return res.status(400).json({ error: 'Invalid appointment ID format' });
    }
    
    if (!newStatus) {
        return res.status(400).json({ error: 'Status is required' });
    }
    
    const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!allowedStatuses.includes(newStatus)) {
        return res.status(400).json({ 
            error: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` 
        });
    }
    
    try {
        const updatedAppointment = await appointmentsService.updateAppointmentStatus(appointmentId, newStatus);
        res.status(200).json({ success: true, data: updatedAppointment });
    } catch (error) {
        if (error?.message === 'Appointment not found') {
            res.status(404).json({ error: 'Appointment not found' });
        } else if (error?.message === 'Cannot modify appointment with inactive doctor') {
            res.status(400).json({ error: 'Cannot modify appointment with inactive doctor. Please activate the doctor first or assign a new one.' });
        } else if (error?.message === 'Cannot modify cancelled appointment') {
            res.status(400).json({ error: 'Cannot modify a cancelled appointment' });
        } else {
            res.status(500).json({ error: 'Unable to update appointment status. Please try again later' });
        }
    }
};

/**
 * Updates the date and time of an existing appointment
 * @param {Object} req - Express request object
 * @param {string} req.params.appointmentId - Appointment's MongoDB ID
 * @param {string} req.body.date - New date and time for the appointment (required)
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with updated appointment data
 * @throws {Error} - If appointment ID format is invalid, date is invalid, or time slot unavailable
 * @example
 * PUT /api/appointments/507f1f77bcf86cd799439011/date
 * Body: { "date": "2024-01-16T14:00:00.000Z" }
 * // Returns: { success: true, data: { updated appointment } }
 */
const updateAppointmentDate = async (req, res) => {
    const { appointmentId } = req.params;
    const newDate = req.body.date;
    
    if (!isValidObjectId(appointmentId)) {
        return res.status(400).json({ error: 'Invalid appointment ID format' });
    }
    
    if (!newDate) {
        return res.status(400).json({ error: 'Date is required' });
    }
    
    if (isNaN(new Date(newDate).getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
    }
    
    if (new Date(newDate) <= new Date()) {
        return res.status(400).json({ error: 'New appointment date must be in the future' });
    }
    
    try {
        const updatedAppointment = await appointmentsService.updateAppointmentDateTime(appointmentId, newDate);
        res.status(200).json({ success: true, data: updatedAppointment });
    } catch (error) {
        if (error?.message === 'Appointment not found') {
            res.status(404).json({ error: 'Appointment not found' });
        } else if (error?.message === 'Cannot modify appointment with inactive doctor') {
            res.status(400).json({ error: 'Cannot modify appointment with inactive doctor. Please activate the doctor first or assign a new one.' });
        } else if (error?.message === 'The doctor already has an appointment at this date and time') {
            res.status(400).json({ error: 'The doctor is not available at this time. Please choose another time slot' });
        } else {
            res.status(500).json({ error: 'Unable to update appointment date. Please try again later' });
        }
    }
};

/**
 * Deletes (cancels) an existing appointment
 * @param {Object} req - Express request object
 * @param {string} req.params.appointmentId - Appointment's MongoDB ID
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with deleted appointment data
 * @throws {Error} - If appointment ID format is invalid or appointment not found
 * @example
 * DELETE /api/appointments/507f1f77bcf86cd799439011
 * // Returns: { success: true, data: { deleted appointment }, message: "Appointment deleted successfully" }
 */
const deleteAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    
    if (!isValidObjectId(appointmentId)) {
        return res.status(400).json({ error: 'Invalid appointment ID format' });
    }
    
    try {
        const deletedAppointment = await appointmentsService.deleteAppointment(appointmentId);
        res.status(200).json({ success: true, data: deletedAppointment, message: 'Appointment deleted successfully' });
    } catch (error) {
        if (error?.message === 'Appointment not found') {
            res.status(404).json({ error: 'Appointment not found' });
        } else {
            res.status(500).json({ error: 'Unable to delete appointment. Please try again later' });
        }
    }
};

/**
 * Cancels all appointments for a doctor within a specified week
 * @param {Object} req - Express request object
 * @param {string} req.params.doctorId - Doctor's MongoDB ID
 * @param {string} req.body.startDate - Start date of the week (required)
 * @param {string} req.body.endDate - End date of the week (required)
 * @param {string} req.body.reason - Reason for cancellation (optional)
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with cancellation results
 * @throws {Error} - If doctor ID format is invalid, dates are missing, or doctor not found
 * @example
 * POST /api/appointments/doctor/507f1f77bcf86cd799439012/cancel-week
 * Body: {
 *   "startDate": "2024-01-15",
 *   "endDate": "2024-01-21",
 *   "reason": "Doctor on vacation"
 * }
 * // Returns: { success: true, data: { modifiedCount: 5 }, message: "Successfully cancelled 5 appointments" }
 */
const cancelAllDoctorAppointmentsInWeek = async (req, res) => {
    const { doctorId } = req.params;
    const { startDate, endDate, reason } = req.body;

    if (!isValidObjectId(doctorId)) {
        return res.status(400).json({ error: 'Invalid doctor ID format' });
    }

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
    }

    if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
    }

    try {
        const result = await appointmentsService.cancelAllDoctorAppointmentsInWeek(doctorId, startDate, endDate, reason);
        res.status(200).json({ 
            success: true, 
            data: result, 
            message: `Successfully cancelled ${result.modifiedCount} appointments` 
        });
    } catch (error) {
        if (error?.message === 'Doctor not found') {
            res.status(404).json({ error: 'The specified doctor was not found' });
        } else {
            res.status(500).json({ error: 'Unable to cancel appointments. Please try again later' });
        }
    }
};

export {
    createAppointment,
    getAllAppointments,
    getMyAppointments,
    getAppointmentById,
    getAppointmentByDoctor,
    getAppointmentByPatient,
    findAppointmentsByDateRange,
    findAppointmentsByStatus,
    getAvailableSlots,
    updateAppointmentStatus,
    updateAppointmentDate,
    deleteAppointment,
    cancelAllDoctorAppointmentsInWeek
};