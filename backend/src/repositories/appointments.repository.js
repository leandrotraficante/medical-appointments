import appointmentsModel from '../models/appointment.model.js';

export default class AppointmentsRepository {

    createAppointment = async (appointmentData) => {
        const newAppointment = await appointmentsModel.create(appointmentData);
        return newAppointment;
    }

    findAllAppointments = async (filters = {}) => {
        const allApp = await appointmentsModel.find(filters)
            .populate('patient', 'name lastname personalId')
            .populate('doctor', 'name lastname license specialties')
            .sort({ date: 1 });
        return allApp;
    }

    findAppointmentById = async (appointmentId) => {
        const appById = await appointmentsModel.findById(appointmentId)
            .populate('patient', 'name lastname personalId')
            .populate('doctor', 'name lastname license specialties');
        return appById;
    }

    findAppointmentsByDoctor = async (doctorId, filters = {}) => {
        const query = { doctor: doctorId, ...filters };
        const appointments = await appointmentsModel.find(query)
            .populate('patient', 'name lastname personalId')
            .sort({ date: 1 });
        return appointments;
    }

    findAppointmentsByPatient = async (patientId, filters = {}) => {
        const query = { patient: patientId, ...filters };
        const appointments = await appointmentsModel.find(query)
            .populate('doctor', 'name lastname license specialties')
            .sort({ date: 1 });
        return appointments;
    }

    findAppointmentsByDateRange = async (startDate, endDate, filters = {}) => {
        const query = {
            date: { $gte: startDate, $lte: endDate },
            ...filters
        };
        const appointments = await appointmentsModel.find(query)
            .populate('patient', 'name lastname personalId')
            .populate('doctor', 'name lastname license specialties')
            .sort({ date: 1 });
        return appointments;
    }

    findAppointmentsByStatus = async (status, filters = {}) => {
        const query = { status, ...filters };
        const appointments = await appointmentsModel.find(query)
            .populate('patient', 'name lastname personalId')
            .populate('doctor', 'name lastname license specialties')
            .sort({ date: 1 });
        return appointments;
    }

    findAvailableSlots = async (doctorId, date) => {
        // Obtener la fecha de inicio y fin del día
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Buscar turnos existentes del doctor en esa fecha
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
                const slotTime = new Date(date);
                slotTime.setHours(hour, minute, 0, 0);

                // Verificar si el slot está disponible
                const isOccupied = existingAppointments.some(app => {
                    const appTime = new Date(app.date);
                    return Math.abs(appTime.getTime() - slotTime.getTime()) < 30 * 60 * 1000; // 30 minutos
                });

                if (!isOccupied) {
                    availableSlots.push(slotTime);
                }
            }
        }

        return availableSlots;
    }

    updateAppointmentStatus = async (appointmentId, newStatus) => {
        const updatedApp = await appointmentsModel.findByIdAndUpdate(
            appointmentId,
            { status: newStatus },
            { new: true }
        ).populate('patient', 'name lastname personalId')
            .populate('doctor', 'name lastname license specialties');
        return updatedApp;
    }

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
        
        if (existingAppointment) {
            throw new Error('The doctor already has an appointment at this date and time');
        }

        const updatedApp = await appointmentsModel.findByIdAndUpdate(
            appointmentId,
            { date: newDateTime },
            { new: true }
        ).populate('patient', 'name lastname personalId')
            .populate('doctor', 'name lastname license specialties');
        return updatedApp;
    }

    deleteAppointment = async (appointmentId) => {
        const deletedApp = await appointmentsModel.findByIdAndUpdate(
            appointmentId,
            { status: 'cancelled' },
            { new: true }
        );
        return deletedApp;
    }

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