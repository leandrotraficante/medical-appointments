import mongoose from 'mongoose';

/**
 * Doctor user model for medical appointments system
 * Represents medical professionals with specialties and license information
 * 
 * @class DoctorModel
 * @extends mongoose.Model
 * @description Schema for medical doctors with specialties and professional credentials
 * 
 * @example
 * // Create a new doctor
 * const doctor = new DoctorModel({
 *   name: 'Dr. John Smith',
 *   email: 'john.smith@hospital.com',
 *   password: 'hashedPassword123',
 *   personalId: '87654321',
 *   license: 'MD12345',
 *   specialties: ['Cardiology', 'Internal Medicine'],
 *   phone: '+54 9 11 9876-5432'
 * });
 * 
 * @example
 * // Find doctors by specialty
 * const cardiologists = await DoctorModel.find({ 
 *   specialties: { $in: ['Cardiology'] },
 *   isActive: true 
 * });
 * console.log(`Found ${cardiologists.length} active cardiologists`);
 */
const doctorsCollection = 'doctors';

/**
 * Doctor user schema definition
 * @type {mongoose.Schema}
 * @description Defines the structure and validation rules for medical doctors
 */
const doctorsSchema = new mongoose.Schema({
    /**
     * Doctor's email address (unique identifier)
     * @type {String}
     * @required
     * @unique
     * @example 'john.smith@hospital.com'
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
     * Doctor's hashed password
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
     * Doctor's personal identification number (DNI)
     * @type {String}
     * @required
     * @unique
     * @minlength 7
     * @maxlength 8
     * @example '87654321'
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
     * Doctor's first name
     * @type {String}
     * @required
     * @minlength 2
     * @maxlength 50
     * @example 'John'
     */
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    /**
     * Doctor's last name
     * @type {String}
     * @required
     * @minlength 2
     * @maxlength 50
     * @example 'Smith'
     */
    lastname: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Lastname must be at least 2 characters long'],
        maxlength: [50, 'Lastname cannot exceed 50 characters']
    },
    /**
     * Doctor's medical specialties
     * @type {Array<String>}
     * @description Array of medical specialties the doctor practices
     * @example ['Cardiology', 'Internal Medicine']
     */
    specialties: [{
        type: String,
        trim: true,
        minlength: [2, 'Specialty must be at least 2 characters long'],
        maxlength: [50, 'Specialty cannot exceed 50 characters'],
        validate: {
            validator: function(specialty) {
                // Letras (incluyendo tildes), espacios y guiones
                const specialtyRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/;
                return specialtyRegex.test(specialty);
            },
            message: 'Specialty must contain only letters (including accents), spaces, and hyphens'
        }
    }],
    /**
     * Doctor's medical license number
     * @type {String}
     * @required
     * @unique
     * @minlength 5
     * @maxlength 15
     * @example 'MD12345'
     */
    license: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [5, 'License must be at least 5 characters long'],
        maxlength: [15, 'License cannot exceed 15 characters'],
        validate: {
            validator: function(license) {
                // Formato: letras + números (MD12345, DR2024, etc.)
                const licenseRegex = /^[A-Z]{2,4}\d{3,10}$/;
                return licenseRegex.test(license);
            },
            message: 'License must be in format: 2-4 letters followed by 3-10 numbers (e.g., MD12345)'
        }
    },
    /**
     * Doctor's phone number
     * @type {String}
     * @required
     * @minlength 10
     * @maxlength 20
     * @example '+54 9 11 9876-5432'
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
     * Doctor's role in the system (always 'doctor')
     * @type {String}
     * @default 'doctor'
     * @required
     * @example 'doctor'
     */
    role: {
        type: String,
        default: 'doctor',
        required: true,
    },
    /**
     * Whether the doctor account is active
     * @type {Boolean}
     * @default true
     * @example true
     */
    isActive: {
        type: Boolean,
        default: true
    },
    /**
     * Last time the doctor connected to the system
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
doctorsSchema.index({ email: 1, role: 1 }, { unique: true });

/**
 * Mongoose model for medical doctors
 * @type {mongoose.Model}
 * @description Exported model for database operations on doctor users
 */
const doctorsModel = mongoose.model(doctorsCollection, doctorsSchema);

export default doctorsModel;