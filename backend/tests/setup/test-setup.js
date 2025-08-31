import { MongoMemoryServer } from 'mongodb-memory-server';
import './test-env.js';

// Configuración global para tests
global.testSetup = {
  // Base de datos en memoria para tests
  mongoServer: null,
  
  // Configuración de test
  testConfig: {
    port: process.env.PORT || 8081,
    database: 'test-medical-appointments'
  }
};

// Setup antes de todos los tests
beforeAll(async () => {
  
  // Iniciar MongoDB en memoria
  global.testSetup.mongoServer = await MongoMemoryServer.create();
  const mongoUri = global.testSetup.mongoServer.getUri();
  
});

// Cleanup después de todos los tests
afterAll(async () => {
  
  if (global.testSetup.mongoServer) {
    await global.testSetup.mongoServer.stop();
  }
  
  console.log('✅ Tests finalizados');
});

// Setup antes de cada test
beforeEach(() => {
  // Limpiar mocks y estado entre tests
  // Jest está disponible globalmente en este contexto
  if (typeof jest !== 'undefined') {
    jest.clearAllMocks();
  }
});

// Cleanup después de cada test
afterEach(() => {
  // Limpiar después de cada test individual
});

// Configuración global para Express apps de test
global.createTestApp = (middleware = []) => {
  const express = require('express');
  const cookieParser = require('cookie-parser');
  
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  
  // Aplicar middleware adicional si se proporciona
  if (Array.isArray(middleware)) {
    middleware.forEach(m => app.use(m));
  }
  
  return app;
};
