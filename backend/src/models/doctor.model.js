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
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const doctorsModel = mongoose.model(doctorsCollection, doctorsSchema);

export default doctorsModel;