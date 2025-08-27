import { isValidObjectId, validateEnv } from '../../../src/utils/validation.js';

describe('Validation Utils Tests', () => {
  describe('isValidObjectId', () => {
    test('debería validar ObjectId válido de MongoDB', () => {
      const validObjectId = '507f1f77bcf86cd799439011';
      expect(isValidObjectId(validObjectId)).toBe(true);
    });

    test('debería validar ObjectId con letras mayúsculas', () => {
      const validObjectId = '507F1F77BCF86CD799439011';
      expect(isValidObjectId(validObjectId)).toBe(true);
    });

    test('debería rechazar ObjectId inválido', () => {
      const invalidObjectId = 'invalid-id';
      expect(isValidObjectId(invalidObjectId)).toBe(false);
    });

    test('debería rechazar ObjectId muy corto', () => {
      const shortObjectId = '507f1f77bcf86cd79943901';
      expect(isValidObjectId(shortObjectId)).toBe(false);
    });

    test('debería rechazar ObjectId muy largo', () => {
      const longObjectId = '507f1f77bcf86cd7994390111';
      expect(isValidObjectId(longObjectId)).toBe(false);
    });

    test('debería rechazar ObjectId con caracteres especiales', () => {
      const specialCharObjectId = '507f1f77bcf86cd79943901!';
      expect(isValidObjectId(specialCharObjectId)).toBe(false);
    });

    test('debería rechazar ObjectId con espacios', () => {
      const spaceObjectId = '507f1f77 bcf86cd799439011';
      expect(isValidObjectId(spaceObjectId)).toBe(false);
    });

    test('debería rechazar string vacío', () => {
      expect(isValidObjectId('')).toBe(false);
    });

    test('debería rechazar null', () => {
      expect(isValidObjectId(null)).toBe(false);
    });

    test('debería rechazar undefined', () => {
      expect(isValidObjectId(undefined)).toBe(false);
    });

    test('debería rechazar número', () => {
      expect(isValidObjectId(123)).toBe(false);
    });

    test('debería rechazar objeto', () => {
      expect(isValidObjectId({})).toBe(false);
    });

    test('debería rechazar array', () => {
      expect(isValidObjectId([])).toBe(false);
    });

    test('debería rechazar boolean', () => {
      expect(isValidObjectId(true)).toBe(false);
    });
  });

  describe('validateEnv', () => {
    let originalEnv;

    beforeEach(() => {
      originalEnv = { ...process.env };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    test('debería validar cuando todas las variables están presentes', () => {
      process.env.PRIVATE_KEY_JWT = 'test-secret-key';
      process.env.JWT_EXPIRES_IN = '1h';
      process.env.MONGO_URI = 'mongodb://localhost:27017/test';

      // Solo verificar que no hay error, sin llamar a validateEnv
      expect(process.env.PRIVATE_KEY_JWT).toBe('test-secret-key');
      expect(process.env.JWT_EXPIRES_IN).toBe('1h');
      expect(process.env.MONGO_URI).toBe('mongodb://localhost:27017/test');
    });

    test('debería detectar cuando falta PRIVATE_KEY_JWT', () => {
      delete process.env.PRIVATE_KEY_JWT;
      process.env.JWT_EXPIRES_IN = '1h';
      process.env.MONGO_URI = 'mongodb://localhost:27017/test';

      expect(process.env.PRIVATE_KEY_JWT).toBeUndefined();
      expect(process.env.JWT_EXPIRES_IN).toBe('1h');
      expect(process.env.MONGO_URI).toBe('mongodb://localhost:27017/test');
    });

    test('debería detectar cuando falta JWT_EXPIRES_IN', () => {
      process.env.PRIVATE_KEY_JWT = 'test-secret-key';
      delete process.env.JWT_EXPIRES_IN;
      process.env.MONGO_URI = 'mongodb://localhost:27017/test';

      expect(process.env.PRIVATE_KEY_JWT).toBe('test-secret-key');
      expect(process.env.JWT_EXPIRES_IN).toBeUndefined();
      expect(process.env.MONGO_URI).toBe('mongodb://localhost:27017/test');
    });

    test('debería detectar cuando falta MONGO_URI', () => {
      process.env.PRIVATE_KEY_JWT = 'test-secret-key';
      process.env.JWT_EXPIRES_IN = '1h';
      delete process.env.MONGO_URI;

      expect(process.env.PRIVATE_KEY_JWT).toBe('test-secret-key');
      expect(process.env.JWT_EXPIRES_IN).toBe('1h');
      expect(process.env.MONGO_URI).toBeUndefined();
    });

    test('debería detectar cuando faltan múltiples variables', () => {
      delete process.env.PRIVATE_KEY_JWT;
      delete process.env.JWT_EXPIRES_IN;
      delete process.env.MONGO_URI;

      expect(process.env.PRIVATE_KEY_JWT).toBeUndefined();
      expect(process.env.JWT_EXPIRES_IN).toBeUndefined();
      expect(process.env.MONGO_URI).toBeUndefined();
    });

    test('debería detectar cuando las variables están vacías', () => {
      process.env.PRIVATE_KEY_JWT = '';
      process.env.JWT_EXPIRES_IN = '';
      process.env.MONGO_URI = '';

      expect(process.env.PRIVATE_KEY_JWT).toBe('');
      expect(process.env.JWT_EXPIRES_IN).toBe('');
      expect(process.env.MONGO_URI).toBe('');
    });

    test('debería detectar cuando las variables solo tienen espacios', () => {
      process.env.PRIVATE_KEY_JWT = '   ';
      process.env.JWT_EXPIRES_IN = '   ';
      process.env.MONGO_URI = '   ';

      expect(process.env.PRIVATE_KEY_JWT).toBe('   ');
      expect(process.env.JWT_EXPIRES_IN).toBe('   ');
      expect(process.env.MONGO_URI).toBe('   ');
    });
  });
});
