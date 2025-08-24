import mongoose from 'mongoose';

const doctorsCollection = 'doctors';

const doctorsSchema = new mongoose.Schema({
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
    personalId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, 'Personal ID must be at least 3 characters long']
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
    specialties: [{
        type: String,
        trim: true,
        minlength: [2, 'Specialty must be at least 2 characters long']
    }],
    license: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, 'License must be at least 3 characters long']
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: [8, 'Phone must be at least 8 characters long']
    },
    role: {
        type: String,
        default: 'doctor',
        required: true,
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

doctorsSchema.index({ email: 1, role: 1 }, { unique: true });

const doctorsModel = mongoose.model(doctorsCollection, doctorsSchema);

export default doctorsModel;