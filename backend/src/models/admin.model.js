import mongoose from 'mongoose';

const adminCollection = 'admins';

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Lastname must be at least 2 characters long'],
        maxlength: [50, 'Lastname cannot exceed 50 characters']
    },
    personalId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, 'Personal ID must be at least 3 characters long']
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: [8, 'Phone must be at least 8 characters long']
    },
    role: {
        type: String,
        default: 'admin',
        required: true,
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

adminSchema.index({ email: 1, role: 1 }, { unique: true });

const adminModel = mongoose.model(adminCollection, adminSchema);

export default adminModel;