export default {
  // Entorno de test
  testEnvironment: 'node',
  
  // Archivos de setup
  setupFilesAfterEnv: ['<rootDir>/tests/setup/test-setup.js'],
  
  // Cobertura de código
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Archivos a incluir en cobertura
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/app.js'
  ],
  
  // Timeout para tests
  testTimeout: 30000,
  
  // Transformaciones
  transform: {}
};
