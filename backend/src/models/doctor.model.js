import mongoose from 'mongoose';

const doctorsCollection = 'doctors';

const doctorsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    personalId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    specialties: [{
        type: String
    }],
    license: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'doctor',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    last_connection: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound unique index for email + role
doctorsSchema.index({ email: 1, role: 1 }, { unique: true });

const doctorsModel = mongoose.model(doctorsCollection, doctorsSchema);

export default doctorsModel;