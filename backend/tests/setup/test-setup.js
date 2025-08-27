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
  console.log('🚀 Iniciando setup de tests...');
  
  // Iniciar MongoDB en memoria
  global.testSetup.mongoServer = await MongoMemoryServer.create();
  const mongoUri = global.testSetup.mongoServer.getUri();
  
  console.log(`📊 MongoDB de test iniciado en: ${mongoUri}`);
});

// Cleanup después de todos los tests
afterAll(async () => {
  console.log('🧹 Limpiando tests...');
  
  if (global.testSetup.mongoServer) {
    await global.testSetup.mongoServer.stop();
    console.log('📊 MongoDB de test detenido');
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
