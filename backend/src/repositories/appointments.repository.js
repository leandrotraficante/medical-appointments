import appointmentsModel from '../models/appointment.model.js';

/**
 * Repository class for handling appointment-related database operations
 * Manages CRUD operations, searching, and business logic for medical appointments
 */
export default class AppointmentsRepository {

    /**
     * Creates a new appointment in the database
     * @param {Object} appointmentData - Appointment data object
     * @param {string} appointmentData.patient - Patient's MongoDB ID
     * @param {string} appointmentData.doctor - Doctor's MongoDB ID
     * @param {string|Date} appointmentData.date - Appointment date and time
     * @param {string} [appointmentData.status] - Appointment status (defaults to 'pending')
     * @param {string} [appointmentData.notes] - Additional notes about the appointment
     * @returns {Promise<Object>} - Created appointment object
     * @example
     * const appointmentData = {
     *   patient: '507f1f77bcf86cd799439011',
     *   doctor: '507f1f77bcf86cd799439012',
     *   date: '2024-01-15T10:00:00.000Z',
     *   notes: 'Follow-up consultation'
     * };
     * const newAppointment = await createAppointment(appointmentData);
     */
    createAppointment = async (appointmentData) => {
        const newAppointment = await appointmentsModel.create(appointmentData);
        return newAppointment;
    }

    /**
     * Retrieves all appointments with optional filtering and population
     * @param {Object} [filters={}] - Filter criteria for appointments
     * @param {string} [filters.status] - Filter by appointment status
     * @param {string} [filters.doctor] - Filter by doctor ID
     * @param {string} [filters.patient] - Filter by patient ID
     * @returns {Promise<Array>} - Array of appointment objects with populated patient and doctor data
     * @example
     * const allAppointments = await findAllAppointments();
     * const pendingAppointments = await findAllAppointments({ status: 'pending' });
     * const doctorAppointments = await findAllAppointments({ doctor: '507f1f77bcf86cd799439012' });
     */
    findAllAppointments = async (filters = {}, page = null, limit = null) => {
        if (page && limit) {
            // Con paginación
            const skip = (page - 1) * limit;
            const [appointments, total] = await Promise.all([
                appointmentsModel.find(filters)
                    .populate('patient', 'name lastname personalId isActive')
                    .populate('doctor', 'name lastname license specialties email isActive')
                    .sort({ date: 1 })
                    .skip(skip)
                    .limit(limit),
                appointmentsModel.countDocuments(filters)
            ]);
            return { appointments, total, pagination: true };
        } else {
            // Sin paginación (comportamiento original)
            const allApp = await appointmentsModel.find(filters)
                .populate('patient', 'name lastname personalId isActive')
                .populate('doctor', 'name lastname license specialties email isActive')
                .sort({ date: 1 });
            return allApp;
        }
    }



    /**
     * Finds an appointment by its unique ID with populated references
     * @param {string} appointmentId - Appointment's MongoDB ID
     * @returns {Promise<Object|null>} - Appointment object with populated patient and doctor data, or null if not found
     * @example
     * const appointment = await findAppointmentById('507f1f77bcf86cd799439011');
     */
    findAppointmentById = async (appointmentId) => {
        const appById = await appointmentsModel.findById(appointmentId)
            .populate('patient', 'name lastname personalId isActive')
            .populate('doctor', 'name lastname license specialties email isActive');
        return appById;
    }

    /**
     * Finds all appointments for a specific doctor with optional filtering
     * @param {string} doctorId - Doctor's MongoDB ID
     * @param {Object} [filters={}] - Additional filter criteria
     * @returns {Promise<Array>} - Array of appointment objects for the doctor
     * @example
     * const doctorAppointments = await findAppointmentsByDoctor('507f1f77bcf86cd799439012');
     * const pendingDoctorAppointments = await findAppointmentsByDoctor('507f1f77bcf86cd799439012', { status: 'pending' });
     */
    findAppointmentsByDoctor = async (doctorId, filters = {}) => {
        const query = { doctor: doctorId, ...filters };
        const appointments = await appointmentsModel.find(query)
            .populate('patient', 'name lastname personalId isActive')
            .populate('doctor', 'name lastname license specialties email isActive')
            .sort({ date: 1 });
        return appointments;
    }

    /**
     * Finds all appointments for a specific patient with optional filtering
     * @param {string} patientId - Patient's MongoDB ID
     * @param {Object} [filters={}] - Additional filter criteria
     * @returns {Promise<Array>} - Array of appointment objects for the patient
     * @example
     * const patientAppointments = await findAppointmentsByPatient('507f1f77bcf86cd799439011');
     * const confirmedPatientAppointments = await findAppointmentsByPatient('507f1f77bcf86cd799439011', { status: 'confirmed' });
     */
    findAppointmentsByPatient = async (patientId, filters = {}) => {
        const query = { patient: patientId, ...filters };
        const appointments = await appointmentsModel.find(query)
            .populate('doctor', 'name lastname license specialties email isActive')
            .sort({ date: 1 });
        return appointments;
    }

    /**
     * Finds appointments within a specific date range with optional filtering
     * @param {string|Date} startDate - Start date of the range
     * @param {string|Date} endDate - End date of the range
     * @param {Object} [filters={}] - Additional filter criteria (excluding date range)
     * @returns {Promise<Array>} - Array of appointment objects within the date range
     * @example
     * const weekAppointments = await findAppointmentsByDateRange('2024-01-01', '2024-01-07');
     * const monthAppointments = await findAppointmentsByDateRange('2024-01-01', '2024-01-31', { status: 'confirmed' });
     */
    findAppointmentsByDateRange = async (startDate, endDate, filters = {}) => {
        // Convertir a objetos Date si vienen como strings
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        // Ajustar endDate para incluir todo el día
        endDateObj.setHours(23, 59, 59, 999);

        // Limpiar filters - excluir startDate y endDate que no son campos de la BD
        const { startDate: _, endDate: __, ...cleanFilters } = filters;

        const query = {
            date: { $gte: startDateObj, $lte: endDateObj },
            ...cleanFilters
        };

        const appointments = await appointmentsModel.find(query)
            .populate('patient', 'name lastname personalId isActive')
            .populate('doctor', 'name lastname license specialties email isActive')
            .sort({ date: 1 });

        return appointments;
    }

    /**
     * Finds appointments by their current status with optional filtering
     * @param {string} status - Appointment status to search for
     * @param {Object} [filters={}] - Additional filter criteria
     * @returns {Promise<Array>} - Array of appointment objects with the specified status
     * @example
     * const pendingAppointments = await findAppointmentsByStatus('pending');
     * const confirmedAppointments = await findAppointmentsByStatus('confirmed', { doctor: '507f1f77bcf86cd799439012' });
     */
    findAppointmentsByStatus = async (status, filters = {}) => {
        const query = { status, ...filters };
        const appointments = await appointmentsModel.find(query)
            .populate('patient', 'name lastname personalId isActive')
            .populate('doctor', 'name lastname license specialties email isActive')
            .sort({ date: 1 });
        return appointments;
    }

    /**
     * Finds available time slots for a doctor on a specific date
     * Generates 30-minute slots between 9:00 AM and 5:00 PM, excluding occupied times
     * @param {string} doctorId - Doctor's MongoDB ID
     * @param {string|Date} date - Date to check for available slots
     * @returns {Promise<Array>} - Array of available time slot objects
     * @example
     * const availableSlots = await findAvailableSlots('507f1f77bcf86cd799439012', '2024-01-15');
     * // Returns: [{ time: "2024-01-15T09:00:00.000Z", formatted: "09:00" }, ...]
     */
    findAvailableSlots = async (doctorId, date) => {
        // Obtener la fecha de inicio y fin del día
        // Asegurar que la fecha se interprete en la zona horaria local
        const dateObj = new Date(date + 'T00:00:00');
        const startOfDay = new Date(dateObj);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(dateObj);
        endOfDay.setHours(23, 59, 59, 999);

        // Verificar que no sea fin de semana (0 = Domingo, 6 = Sábado)
        const dayOfWeek = startOfDay.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return []; // No hay slots disponibles en fines de semana
        }

        // Buscar turnos existentes del doctor en esa fecha
        // Excluir citas canceladas, pero incluir pending y confirmed como ocupadas
        const existingAppointments = await appointmentsModel.find({
            doctor: doctorId,
            date: { $gte: startOfDay, $lt: endOfDay },
            status: { $nin: ['cancelled'] }
        }).sort({ date: 1 });



        // Generar slots disponibles (cada 30 minutos de 9:00 a 17:00)
        const availableSlots = [];
        const startHour = 9; // 9:00 AM
        const endHour = 17;  // 5:00 PM

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                // Crear la fecha usando la hora local para evitar problemas de zona horaria
                const slotTime = new Date(date + `T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);

                // Verificar si el slot está disponible
                const isOccupied = existingAppointments.some(app => {
                    const appTime = new Date(app.date);

                    // Comparar solo la hora y minuto, ignorando segundos y milisegundos
                    const slotHour = slotTime.getHours();
                    const slotMinute = slotTime.getMinutes();
                    const appHour = appTime.getHours();
                    const appMinute = appTime.getMinutes();

                    // Un slot está ocupado si la cita está en la misma hora y minuto
                    const isOccupiedResult = (slotHour === appHour && slotMinute === appMinute);

                    // Debug log para cada slot
                    if (isOccupiedResult) {

                    }

                    return isOccupiedResult;
                });

                if (!isOccupied) {
                    availableSlots.push({
                        time: slotTime,
                        formatted: slotTime.toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    });
                }
            }
        }
        return availableSlots;
    }

    /**
     * Updates the status of an existing appointment
     * @param {string} appointmentId - Appointment's MongoDB ID
     * @param {string} newStatus - New status for the appointment
     * @returns {Promise<Object|null>} - Updated appointment object with populated references, or null if not found
     * @example
     * const updatedAppointment = await updateAppointmentStatus('507f1f77bcf86cd799439011', 'confirmed');
     * // Valid statuses: 'pending', 'confirmed', 'cancelled', 'completed'
     */
    updateAppointmentStatus = async (appointmentId, newStatus) => {
        const updatedApp = await appointmentsModel.findByIdAndUpdate(
            appointmentId,
            { status: newStatus },
            { new: true }
        ).populate('patient', 'name lastname personalId isActive')
            .populate('doctor', 'name lastname license specialties email isActive');
        return updatedApp;
    }

    /**
     * Updates the date and time of an existing appointment
     * Checks for scheduling conflicts before updating
     * @param {string} appointmentId - Appointment's MongoDB ID
     * @param {string|Date} newDateTime - New date and time for the appointment
     * @returns {Promise<Object|null>} - Updated appointment object with populated references
     * @throws {Error} - If appointment not found or time slot unavailable
     * @example
     * const updatedAppointment = await updateAppointmentDateTime('507f1f77bcf86cd799439011', '2024-01-16T14:00:00.000Z');
     */
    updateAppointmentDateTime = async (appointmentId, newDateTime) => {
        // Primero obtener el turno actual para verificar el doctor
        const currentAppointment = await appointmentsModel.findById(appointmentId);
        if (!currentAppointment) {
            throw new Error('Appointment not found');
        }

        // Verificar que no haya solapamiento con la nueva fecha
        const existingAppointment = await appointmentsModel.findOne({
            doctor: currentAppointment.doctor,
            date: newDateTime,
            status: { $nin: ['cancelled'] },
            _id: { $ne: appointmentId }
        });

        const updatedApp = await appointmentsModel.findByIdAndUpdate(
            appointmentId,
            { date: newDateTime },
            { new: true }
        ).populate('patient', 'name lastname personalId isActive')
            .populate('doctor', 'name lastname license specialties email isActive');
        return updatedApp;
    }

    /**
     * Deletes (cancels) an existing appointment by setting status to 'cancelled'
     * @param {string} appointmentId - Appointment's MongoDB ID
     * @returns {Promise<Object|null>} - Cancelled appointment object, or null if not found
     * @example
     * const cancelledAppointment = await deleteAppointment('507f1f77bcf86cd799439011');
     * // Note: This doesn't actually delete the record, just marks it as cancelled
     */
    deleteAppointment = async (appointmentId) => {
        const deletedApp = await appointmentsModel.findByIdAndUpdate(
            appointmentId,
            { status: 'cancelled' },
            { new: true }
        );
        return deletedApp;
    }

    /**
     * Cancels all appointments for a doctor within a specified week
     * @param {string} doctorId - Doctor's MongoDB ID
     * @param {string|Date} startDate - Start date of the week
     * @param {string|Date} endDate - End date of the week
     * @param {string} [reason='Cancelación masiva por el doctor'] - Reason for cancellation
     * @returns {Promise<Object>} - MongoDB update result with count of modified documents
     * @example
     * const result = await cancelAllDoctorAppointmentsInWeek('507f1f77bcf86cd799439012', '2024-01-15', '2024-01-21', 'Doctor on vacation');
     */
    cancelAllDoctorAppointmentsInWeek = async (doctorId, startDate, endDate, reason = 'Cancelación masiva por el doctor') => {
        const result = await appointmentsModel.updateMany(
            {
                doctor: doctorId,
                date: { $gte: startDate, $lte: endDate },
                status: { $nin: ['cancelled', 'completed'] }
            },
            {
                status: 'cancelled',
                cancellationReason: reason,
                cancelledAt: new Date()
            }
        );
        return result;
    }
}