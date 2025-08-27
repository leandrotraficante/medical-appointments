import jwt from 'jsonwebtoken';
import configs from '../../src/config/configs.js';

/**
 * Genera un token JWT válido para tests
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.id - ID del usuario
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.role - Rol del usuario
 * @returns {string} - Token JWT
 */
export const generateTestToken = (userData) => {
  const payload = {
    userId: userData.id,
    email: userData.email,
    role: userData.role,
    name: userData.name || 'Test User'
  };
  
  return jwt.sign(payload, configs.jwtSecret, { expiresIn: '1h' });
};

/**
 * Crea datos de prueba para un paciente
 * @returns {Object} - Datos de paciente de prueba
 */
export const createTestPatientData = () => ({
  name: 'Test Patient',
  lastname: 'Test Lastname',
  email: 'test.patient@test.com',
  personalId: '12345678',
  password: 'TestPass123',
  dateOfBirth: '1990-01-01',
  phone: '+54 11 1234-5678',
  role: 'patient'
});

/**
 * Crea datos de prueba para un doctor
 * @returns {Object} - Datos de doctor de prueba
 */
export const createTestDoctorData = () => ({
  name: 'Test Doctor',
  lastname: 'Test Lastname',
  email: 'test.doctor@test.com',
  personalId: '87654321',
  password: 'TestPass123',
  license: 'MD12345',
  specialties: ['Cardiology'],
  phone: '+54 11 8765-4321',
  role: 'doctor'
});

/**
 * Crea datos de prueba para un admin
 * @returns {Object} - Datos de admin de prueba
 */
export const createTestAdminData = () => ({
  name: 'Test Admin',
  lastname: 'Test Lastname',
  email: 'test.admin@test.com',
  personalId: '11223344',
  password: 'TestPass123',
  phone: '+54 11 1122-3344',
  role: 'admin'
});

/**
 * Limpia la base de datos de test
 * @param {Object} models - Objetos de modelo a limpiar
 */
export const cleanTestDatabase = async (models) => {
  for (const model of Object.values(models)) {
    await model.deleteMany({});
  }
};

/**
 * Espera un tiempo específico (útil para tests asíncronos)
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} - Promise que se resuelve después del tiempo especificado
 */
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
