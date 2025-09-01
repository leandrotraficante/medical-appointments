import mongoose from 'mongoose';

/**
 * Admin user model for medical appointments system
 * Represents administrative users with system management permissions
 * 
 * @class AdminModel
 * @extends mongoose.Model
 * @description Schema for administrative users with role-based permissions
 * 
 * @example
 * // Create a new admin
 * const admin = new AdminModel({
 *   name: 'John Admin',
 *   email: 'admin@hospital.com',
 *   password: 'hashedPassword123',
 *   personalId: '12345678',
 *   phone: '+54 9 11 1234-5678'
 * });
 * 
 * @example
 * // Find active admins
 * const activeAdmins = await AdminModel.find({ isActive: true });
 */
const adminCollection = 'admins';

/**
 * Admin user schema definition
 * @type {mongoose.Schema}
 * @description Defines the structure and validation rules for admin users
 */
const adminSchema = new mongoose.Schema({
    /**
     * Admin's email address (unique identifier)
     * @type {String}
     * @required
     * @unique
     * @example 'admin@hospital.com'
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
     * Admin's hashed password
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
     * Admin's first name
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
     * Admin's last name
     * @type {String}
     * @required
     * @minlength 2
     * @maxlength 50
     * @example 'Admin'
     */
    lastname: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Lastname must be at least 2 characters long'],
        maxlength: [50, 'Lastname cannot exceed 50 characters']
    },
    /**
     * Admin's personal identification number (DNI)
     * @type {String}
     * @required
     * @unique
     * @minlength 7
     * @maxlength 8
     * @example '12345678'
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
     * Admin's phone number
     * @type {String}
     * @required
     * @minlength 10
     * @maxlength 20
     * @example '+54 9 11 1234-5678'
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
     * Admin's date of birth
     * @type {Date}
     * @description Admin's birth date for age calculation and records
     * @example '1980-05-20'
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
     * Admin's role in the system (always 'admin')
     * @type {String}
     * @default 'admin'
     * @required
     * @example 'admin'
     */
    role: {
        type: String,
        default: 'admin',
        required: true,
    },
    /**
     * Whether the admin account is active
     * @type {Boolean}
     * @default true
     * @example true
     */
    isActive: {
        type: Boolean,
        default: true
    },
    /**
     * Admin's system permissions
     * @type {Object}
     * @description Defines what actions the admin can perform
     */
    permissions: {
        /**
         * Permission to manage doctor accounts
         * @type {Boolean}
         * @default true
         */
        manageDoctors: { type: Boolean, default: true },
        /**
         * Permission to manage patient accounts
         * @type {Boolean}
         * @default true
         */
        managePatients: { type: Boolean, default: true },
        /**
         * Permission to manage appointments
         * @type {Boolean}
         * @default true
         */
        manageAppointments: { type: Boolean, default: true },
        /**
         * Permission to view system reports
         * @type {Boolean}
         * @default true
         */
        viewReports: { type: Boolean, default: true },
        /**
         * Full system administration permissions
         * @type {Boolean}
         * @default false
         */
        systemAdmin: { type: Boolean, default: false }
    },
    /**
     * Last time the admin connected to the system
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
adminSchema.index({ email: 1, role: 1 }, { unique: true });

/**
 * Mongoose model for admin users
 * @type {mongoose.Model}
 * @description Exported model for database operations on admin users
 */
const adminModel = mongoose.model(adminCollection, adminSchema);

export default adminModel;