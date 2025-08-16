import mongoose from 'mongoose';

const patientsCollection = 'patients';

const patientsSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: false,
        lowercase: true,
        trim: true
    }
}, {
    timestamps: true
});

const patientsModel = mongoose.model(patientsCollection, patientsSchema);

export default patientsModel;