import mongoose from 'mongoose';

const appointmentsCollection = 'appointments';

const appointmentsSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patients',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Validación de solapamiento antes de guardar
appointmentsSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('date') || this.isModified('doctor')) {
        const existingAppointment = await this.constructor.findOne({
            doctor: this.doctor,
            date: this.date,
            status: { $nin: ['cancelled'] },
            _id: { $ne: this._id }
        });
        
        if (existingAppointment) {
            return next(new Error('El médico ya tiene un turno en esta fecha y hora'));
        }
    }
    next();
});

const appointmentsModel = mongoose.model(appointmentsCollection, appointmentsSchema);

export default appointmentsModel;