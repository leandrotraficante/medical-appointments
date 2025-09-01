import mongoose from 'mongoose';

/**
 * Patient user model for medical appointments system
 * Represents patients who can book appointments with doctors
 * 
 * @class PatientModel
 * @extends mongoose.Model
 * @description Schema for patient users with personal and medical information
 * 
 * @example
 * // Create a new patient
 * const patient = new PatientModel({
 *   name: 'Jane Doe',
 *   email: 'jane.doe@email.com',
 *   password: 'hashedPassword123',
 *   personalId: '11223344',
 *   dateOfBirth: '1990-05-15',
 *   phone: '+54 9 11 5555-6666'
 * });
 * 
 * @example
 * // Find active patients
 * const activePatients = await PatientModel.find({ isActive: true });
 */
const patientsCollection = 'patients';

/**
 * Patient user schema definition
 * @type {mongoose.Schema}
 * @description Defines the structure and validation rules for patient users
 */
const patientsSchema = new mongoose.Schema({
    /**
     * Patient's email address (unique identifier)
     * @type {String}
     * @required
     * @unique
     * @example 'jane.doe@email.com'
     */
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    /**
     * Patient's hashed password
     * @type {String}
     * @required
     * @minlength 8
     * @example 'hashedPassword123'
     */
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function(password) {
                // Al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
                return passwordRegex.test(password);
            },
            message: 'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number'
        }
    },
    /**
     * Patient's personal identification number (DNI)
     * @type {String}
     * @required
     * @unique
     * @minlength 7
     * @maxlength 8
     * @example '11223344'
     */
    personalId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [7, 'Personal ID must be at least 7 characters long'],
        maxlength: [8, 'Personal ID cannot exceed 8 characters'],
        validate: {
            validator: function(dni) {
                // Solo números, entre 7 y 8 dígitos
                const dniRegex = /^\d{7,8}$/;
                return dniRegex.test(dni);
            },
            message: 'Personal ID must contain only numbers between 7 and 8 digits'
        }
    },
    /**
     * Patient's first name
     * @type {String}
     * @required
     * @minlength 2
     * @maxlength 50
     * @example 'Jane'
     */
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    /**
     * Patient's last name
     * @type {String}
     * @minlength 2
     * @maxlength 50
     * @example 'Doe'
     */
    lastname: {
        type: String,
        trim: true,
        minlength: [2, 'Lastname must be at least 2 characters long'],
        maxlength: [50, 'Lastname cannot exceed 50 characters']
    },
    /**
     * Patient's date of birth
     * @type {Date}
     * @description Must be in the past and reasonable age
     * @example '1990-05-15'
     */
    dateOfBirth: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                if (!value) return false; // Campo obligatorio
                const today = new Date();
                return value < today; // Solo verificar que sea en el pasado
            },
            message: 'Date of birth is required and must be in the past'
        }
    },
    /**
     * Patient's phone number
     * @type {String}
     * @minlength 10
     * @maxlength 20
     * @example '+54 9 11 5555-6666'
     */
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Phone must be at least 10 characters long'],
        maxlength: [20, 'Phone cannot exceed 20 characters'],
        validate: {
            validator: function(phone) {
                // Validación simple: solo números, espacios, guiones y +
                const phoneRegex = /^[\d\s\-\+]+$/;
                return phoneRegex.test(phone);
            },
            message: 'Phone must contain only numbers, spaces, hyphens, and + symbol'
        }
    },
    /**
     * Patient's role in the system (always 'patient')
     * @type {String}
     * @default 'patient'
     * @required
     * @example 'patient'
     */
    role: {
        type: String,
        default: 'patient',
        required: true,
    },
    /**
     * Whether the patient account is active
     * @type {Boolean}
     * @default true
     * @example true
     */
    isActive: {
        type: Boolean,
        default: true
    },
    /**
     * Last time the patient connected to the system
     * @type {Date}
     * @default Date.now
     * @example '2024-01-15T10:30:00.000Z'
     */
    last_connection: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Compound index for email + role to ensure uniqueness across user types
patientsSchema.index({ email: 1, role: 1 }, { unique: true });

/**
 * Mongoose model for patient users
 * @type {mongoose.Model}
 * @description Exported model for database operations on patient users
 */
const patientsModel = mongoose.model(patientsCollection, patientsSchema);

export default patientsModel;