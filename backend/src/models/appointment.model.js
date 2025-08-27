import mongoose from 'mongoose';

/**
 * Appointment model for medical appointments system
 * Represents scheduled appointments between patients and doctors
 * 
 * @class AppointmentModel
 * @extends mongoose.Model
 * @description Schema for medical appointments with validation and business logic
 * 
 * @example
 * // Create a new appointment
 * const appointment = new AppointmentModel({
 *   patient: '507f1f77bcf86cd799439011',
 *   doctor: '507f1f77bcf86cd799439012',
 *   date: '2024-01-20T10:00:00.000Z',
 *   status: 'pending'
 * });
 * 
 * @example
 * // Find confirmed appointments for a doctor
 * const confirmedAppointments = await AppointmentModel.find({
 *   doctor: '507f1f77bcf86cd799439012',
 *   status: 'confirmed'
 * }).populate('patient', 'name lastname');
 * console.log(`Found ${confirmedAppointments.length} confirmed appointments`);
 */
const appointmentsCollection = 'appointments';

/**
 * Appointment schema definition
 * @type {mongoose.Schema}
 * @description Defines the structure and validation rules for medical appointments
 */
const appointmentsSchema = new mongoose.Schema({
    /**
     * Reference to the patient user
     * @type {mongoose.Schema.Types.ObjectId}
     * @required
     * @ref 'patients'
     * @description MongoDB ObjectId reference to the patient model
     * @example '507f1f77bcf86cd799439011'
     */
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patients',
        required: true
    },
    /**
     * Reference to the doctor user
     * @type {mongoose.Schema.Types.ObjectId}
     * @required
     * @ref 'doctors'
     * @description MongoDB ObjectId reference to the doctor model
     * @example '507f1f77bcf86cd799439012'
     */
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors',
        required: true
    },
    /**
     * Scheduled date and time for the appointment
     * @type {Date}
     * @required
     * @description Must be in the future when creating/updating
     * @example '2024-01-20T10:00:00.000Z'
     */
    date: {
        type: Date,
        required: true
    },
    /**
     * Current status of the appointment
     * @type {String}
     * @enum ['pending', 'confirmed', 'cancelled', 'completed']
     * @default 'pending'
     * @description Tracks the lifecycle of the appointment
     * @example 'confirmed'
     */
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

/**
 * Pre-save middleware for appointment validation
 * Validates appointment date and prevents scheduling conflicts
 * 
 * @function
 * @async
 * @param {Function} next - Mongoose middleware next function
 * @description Runs before saving appointment to validate business rules
 * 
 * @example
 * // This middleware runs automatically when saving appointments
 * const appointment = new AppointmentModel({...});
 * await appointment.save(); // Triggers validation middleware
 */
appointmentsSchema.pre('save', async function(next) {
    // Validate that appointment date is in the future
    if (this.date <= new Date()) {
        return next(new Error('Appointment date must be in the future'));
    }
    
    // Check for scheduling conflicts only on new appointments or date/doctor changes
    if (this.isNew || this.isModified('date') || this.isModified('doctor')) {
        const existingAppointment = await this.constructor.findOne({
            doctor: this.doctor,
            date: this.date,
            status: { $nin: ['cancelled'] }, // Exclude cancelled appointments
            _id: { $ne: this._id } // Exclude current appointment when updating
        });
        
        if (existingAppointment) {
            return next(new Error('The doctor already has an appointment at this date and time'));
        }
    }
    next();
});

/**
 * Mongoose model for medical appointments
 * @type {mongoose.Model}
 * @description Exported model for database operations on appointments
 */
const appointmentsModel = mongoose.model(appointmentsCollection, appointmentsSchema);

export default appointmentsModel;