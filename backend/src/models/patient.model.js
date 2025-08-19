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
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    phone: {
        type: String
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

patientsSchema.index({ email: 1, role: 1 }, { unique: true });

const patientsModel = mongoose.model(patientsCollection, patientsSchema);

export default patientsModel;