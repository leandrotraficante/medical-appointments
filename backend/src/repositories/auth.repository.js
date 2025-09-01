import adminModel from '../models/admin.model.js';
import doctorModel from '../models/doctor.model.js';
import patientModel from '../models/patient.model.js';

/**
 * Repository class for handling authentication-related database operations
 * Manages user creation and email existence checks across different user roles
 */
class AuthRepository {
    /**
     * Creates a new admin user in the database
     * @param {Object} adminData - Admin user data
     * @param {string} adminData.name - Admin's full name
     * @param {string} adminData.email - Admin's email address
     * @param {string} adminData.personalId - Admin's personal ID/DNI
     * @param {string} adminData.password - Admin's hashed password
     * @param {string} [adminData.lastname] - Admin's last name (optional)
     * @param {string} [adminData.dateOfBirth] - Admin's date of birth (optional)
     * @param {string} [adminData.phone] - Admin's phone number (optional)
     * @returns {Promise<Object>} - Created admin user object
     * @example
     * const adminData = {
     *   name: 'Admin User',
     *   email: 'admin@hospital.com',
     *   personalId: '12345678',
     *   password: 'hashedPassword123'
     * };
     * const newAdmin = await createAdmin(adminData);
     */
    async createAdmin(adminData) {
        return await adminModel.create(adminData);
    }

    /**
     * Creates a new doctor user in the database
     * @param {Object} doctorData - Doctor user data
     * @param {string} doctorData.name - Doctor's full name
     * @param {string} doctorData.email - Doctor's email address
     * @param {string} doctorData.personalId - Doctor's personal ID/DNI
     * @param {string} doctorData.password - Doctor's hashed password
     * @param {string} doctorData.license - Doctor's medical license number
     * @param {Array<string>} doctorData.specialties - Doctor's medical specialties
     * @param {string} [doctorData.lastname] - Doctor's last name (optional)
     * @param {string} [doctorData.dateOfBirth] - Doctor's date of birth (optional)
     * @param {string} [doctorData.phone] - Doctor's phone number (optional)
     * @returns {Promise<Object>} - Created doctor user object
     * @example
     * const doctorData = {
     *   name: 'Dr. John Doe',
     *   email: 'john.doe@hospital.com',
     *   personalId: '87654321',
     *   password: 'hashedPassword123',
     *   license: 'MD12345',
     *   specialties: ['Cardiology', 'Internal Medicine']
     * };
     * const newDoctor = await createDoctor(doctorData);
     */
    async createDoctor(doctorData) {
        return await doctorModel.create(doctorData);
    }

    /**
     * Creates a new patient user in the database
     * @param {Object} patientData - Patient user data
     * @param {string} patientData.name - Patient's full name
     * @param {string} patientData.email - Patient's email address
     * @param {string} patientData.personalId - Patient's personal ID/DNI
     * @param {string} patientData.password - Patient's hashed password
     * @param {string} [patientData.lastname] - Patient's last name (optional)
     * @param {string} [patientData.dateOfBirth] - Patient's date of birth (optional)
     * @param {string} [patientData.phone] - Patient's phone number (optional)
     * @returns {Promise<Object>} - Created patient user object
     * @example
     * const patientData = {
     *   name: 'Jane Smith',
     *   email: 'jane.smith@email.com',
     *   personalId: '11223344',
     *   password: 'hashedPassword123',
     *   dateOfBirth: '1990-05-15',
     *   phone: '+54 9 11 1234-5678'
     * };
     * const newPatient = await createPatient(patientData);
     */
    async createPatient(patientData) {
        return await patientModel.create(patientData);
    }

    /**
     * Checks if an email already exists across all user types (admin, doctor, patient)
     * @param {string} email - Email address to check
     * @returns {Promise<Object|null>} - User object if email exists, null otherwise
     * @example
     * const existingUser = await checkEmailExists('john.doe@hospital.com');
     */
    async checkEmailExists(email) {
        const admin = await adminModel.findOne({ email });
        if (admin) return admin;

        const doctor = await doctorModel.findOne({ email });
        if (doctor) return doctor;

        const patient = await patientModel.findOne({ email });
        if (patient) return patient;

        return null;
    }
}

export default AuthRepository;

