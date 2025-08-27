import mongoose from 'mongoose';
import patientModel from '../../../src/models/patient.model.js';

describe('Patient Model Test', () => {
  // Conectar a base de datos de test antes de los tests
  beforeAll(async () => {
    const mongoUri = global.testSetup.mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  // Limpiar base de datos después de cada test
  afterEach(async () => {
    await patientModel.deleteMany({});
  });

  // Desconectar después de todos los tests
  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('Validaciones del modelo', () => {
    test('debería crear un paciente válido', async () => {
      const validPatient = {
        name: 'Juan',
        lastname: 'Pérez',
        email: 'juan.perez@test.com',
        personalId: '12345678',
        password: 'TestPass123',
        dateOfBirth: '1990-01-01',
        phone: '+54 11 1234-5678',
        role: 'patient'
      };

      const patient = new patientModel(validPatient);
      const savedPatient = await patient.save();

      expect(savedPatient._id).toBeDefined();
      expect(savedPatient.name).toBe(validPatient.name);
      expect(savedPatient.email).toBe(validPatient.email);
      expect(savedPatient.role).toBe('patient');
    });

    test('debería fallar sin email', async () => {
      const invalidPatient = {
        name: 'Juan',
        personalId: '12345678',
        password: 'TestPass123',
        role: 'patient'
      };

      const patient = new patientModel(invalidPatient);
      let error;

      try {
        await patient.save();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    test('debería fallar con password débil', async () => {
      const invalidPatient = {
        name: 'Juan',
        email: 'juan@test.com',
        personalId: '12345678',
        password: '123', // Password muy corto
        role: 'patient'
      };

      const patient = new patientModel(invalidPatient);
      let error;

      try {
        await patient.save();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    test('debería fallar con personalId inválido', async () => {
      const invalidPatient = {
        name: 'Juan',
        email: 'juan@test.com',
        personalId: 'ABC123', // Solo letras y números
        password: 'TestPass123',
        role: 'patient'
      };

      const patient = new patientModel(invalidPatient);
      let error;

      try {
        await patient.save();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.personalId).toBeDefined();
    });

    test('debería fallar con teléfono inválido', async () => {
      const invalidPatient = {
        name: 'Juan',
        email: 'juan@test.com',
        personalId: '12345678',
        password: 'TestPass123',
        phone: 'invalid-phone', // Teléfono inválido
        role: 'patient'
      };

      const patient = new patientModel(invalidPatient);
      let error;

      try {
        await patient.save();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.phone).toBeDefined();
    });
  });

  describe('Campos por defecto', () => {
    test('debería establecer isActive como true por defecto', async () => {
      const patient = new patientModel({
        name: 'Juan',
        email: 'juan@test.com',
        personalId: '12345678',
        password: 'TestPass123',
        role: 'patient'
      });

      const savedPatient = await patient.save();
      expect(savedPatient.isActive).toBe(true);
    });

    test('debería establecer role como patient por defecto', async () => {
      const patient = new patientModel({
        name: 'Juan',
        email: 'juan@test.com',
        personalId: '12345678',
        password: 'TestPass123'
        // Sin especificar role
      });

      const savedPatient = await patient.save();
      expect(savedPatient.role).toBe('patient');
    });
  });
});
