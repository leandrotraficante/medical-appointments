import request from 'supertest';
import express from 'express';
import authRoutes from '../../../src/routes/auth.route.js';

// Crear app de test simple
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    test('debería fallar con datos inválidos', async () => {
      const invalidData = {
        name: 'Test',
        // Falta email
        password: '123', // Password muy corto
        role: 'patient'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    test('debería fallar sin email', async () => {
      const invalidData = {
        name: 'Test User',
        password: 'TestPass123',
        role: 'patient'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    test('debería fallar sin email', async () => {
      const credentials = {
        password: 'TestPass123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    test('debería fallar sin password', async () => {
      const credentials = {
        email: 'test@test.com'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });
});
