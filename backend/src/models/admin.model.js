import mongoose from 'mongoose';

const adminCollection = 'admins';

const adminSchema = new mongoose.Schema({
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
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    personalId: {
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
        default: 'admin',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    permissions: {
        manageDoctors: { type: Boolean, default: true },
        managePatients: { type: Boolean, default: true },
        manageAppointments: { type: Boolean, default: true },
        viewReports: { type: Boolean, default: true },
        systemAdmin: { type: Boolean, default: false }
    },
    last_connection: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound unique index for email + role
adminSchema.index({ email: 1, role: 1 }, { unique: true });

const adminModel = mongoose.model(adminCollection, adminSchema);

export default adminModel;