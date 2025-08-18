import mongoose from 'mongoose';

const patientsCollection = 'patients';

const patientsSchema = new mongoose.Schema({
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
    dateOfBirth: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'patient',
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
patientsSchema.index({ email: 1, role: 1 }, { unique: true });

const patientsModel = mongoose.model(patientsCollection, patientsSchema);

export default patientsModel;