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
    phone: {
        type: String,
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
    }
}, {
    timestamps: true
});

const adminModel = mongoose.model(adminCollection, adminSchema);

export default adminModel;