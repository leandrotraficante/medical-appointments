import appointmentsService from "../services/appointments.service.js";

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
        res.status(500).json({ error: error.message });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const filters = req.query;
        const appointments = await appointmentsService.findAllAppointments(filters)
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAppointmentById = async (req, res) => {
    const { appointmentId } = req.params;
    try {
        const appointmentById = await appointmentsService.findAppointmentById(appointmentId);
        res.status(200).json({ success: true, data: appointmentById });
    } catch (error) {
        if (error?.message === 'Invalid appointment ID format') {
            res.status(400).json({ error: error.message });
        } else if (error?.message === 'Appointment not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

const getAppointmentByDoctor = async (req, res) => {
    const { doctorId } = req.params;
    const filters = req.query;

    if (!doctorId) {
        return res.status(400).json({ error: 'Doctor ID is required' });
    }

    try {
        const appointmentByDoctor = await appointmentsService.findAppointmentsByDoctor(doctorId, filters);
        res.status(200).json({ success: true, data: appointmentByDoctor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAppointmentByPatient = async (req, res) => {
    const { patientId } = req.params;
    const filters = req.query;

    if (!patientId) {
        return res.status(400).json({ error: 'Patient ID is required' });
    }

    try {
        const appointmentByPatient = await appointmentsService.findAppointmentsByPatient(patientId, filters);
        res.status(200).json({ success: true, data: appointmentByPatient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
        res.status(500).json({ error: error.message });
    }
};

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
        res.status(500).json({ error: error.message });
    }
};

const getAvailableSlots = async (req, res) => {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!doctorId) {
        return res.status(400).json({ error: 'Doctor ID is required' });
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
        res.status(500).json({ error: error.message });
    }
};

const updateAppointmentStatus = async (req, res) => {
    const { appointmentId } = req.params;
    const newStatus = req.body.status;
    
    if (!newStatus) {
        return res.status(400).json({ error: 'Status is required' });
    }
    
    // Validar que el estado sea uno de los permitidos
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
        if (error?.message === 'Invalid appointment ID format') {
            res.status(400).json({ error: error.message });
        } else if (error?.message === 'Appointment not found') {
            res.status(404).json({ error: error.message });
        } else if (error?.message === 'Cannot modify cancelled appointment') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

const updateAppointmentDate = async (req, res) => {
    const { appointmentId } = req.params;
    const newDate = req.body.date;
    
    if (!newDate) {
        return res.status(400).json({ error: 'Date is required' });
    }
    
    if (isNaN(new Date(newDate).getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
    }
    
    // Validar que la nueva fecha sea futura
    if (new Date(newDate) <= new Date()) {
        return res.status(400).json({ error: 'New appointment date must be in the future' });
    }
    
    try {
        const updatedAppointment = await appointmentsService.updateAppointmentDateTime(appointmentId, newDate);
        res.status(200).json({ success: true, data: updatedAppointment });
    } catch (error) {
        if (error?.message === 'Invalid appointment ID format') {
            res.status(400).json({ error: error.message });
        } else if (error?.message === 'Appointment not found') {
            res.status(404).json({ error: error.message });
        } else if (error?.message === 'Cannot modify cancelled appointment') {
            res.status(400).json({ error: error.message });
        } else if (error?.message === 'The doctor already has an appointment at this date and time') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

const deleteAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    
    try {
        const deletedAppointment = await appointmentsService.deleteAppointment(appointmentId);
        res.status(200).json({ success: true, data: deletedAppointment, message: 'Appointment deleted successfully' });
    } catch (error) {
        if (error?.message === 'Invalid appointment ID format') {
            res.status(400).json({ error: error.message });
        } else if (error?.message === 'Appointment not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

const cancelAllDoctorAppointmentsInWeek = async (req, res) => {
    const { doctorId } = req.params;
    const { startDate, endDate, reason } = req.body;

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
        if (error?.message === 'Invalid doctor ID format') {
            res.status(400).json({ error: error.message });
        } else if (error?.message === 'Doctor not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

export {
    createAppointment,
    getAllAppointments,
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