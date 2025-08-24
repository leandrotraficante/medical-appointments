import appointmentsService from "../services/appointments.service.js";
import { isValidObjectId } from "../utils/validation.js";

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
        } else if (error?.message === 'Appointment date must be in the future') {
            res.status(400).json({ error: 'Appointment date must be in the future' });
        } else if (error?.message === 'The doctor already has an appointment at this date and time') {
            res.status(400).json({ error: 'The doctor is not available at this time. Please choose another time slot' });
        } else {
            res.status(500).json({ error: 'Unable to create appointment. Please try again later' });
        }
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const filters = req.query;
        const appointments = await appointmentsService.findAllAppointments(filters)
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        if (error?.message === 'Invalid filter format') {
            res.status(400).json({ error: 'Invalid filter format. Please check your search parameters' });
        } else {
            res.status(500).json({ error: 'Unable to fetch appointments. Please try again later' });
        }
    }
};

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
        } else if (error?.message === 'Cannot modify cancelled appointment') {
            res.status(400).json({ error: 'Cannot modify a cancelled appointment' });
        } else {
            res.status(500).json({ error: 'Unable to update appointment status. Please try again later' });
        }
    }
};

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
        } else if (error?.message === 'The doctor already has an appointment at this date and time') {
            res.status(400).json({ error: 'The doctor is not available at this time. Please choose another time slot' });
        } else {
            res.status(500).json({ error: 'Unable to update appointment date. Please try again later' });
        }
    }
};

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