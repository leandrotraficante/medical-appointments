// Configuración de entorno para tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-medical-appointments';
process.env.PORT = '8081';

// Configuraciones adicionales para tests
process.env.RATE_LIMIT_WINDOW_MS = '900000'; // 15 minutos
process.env.RATE_LIMIT_MAX_REQUESTS = '100';
process.env.AUTH_RATE_LIMIT_MAX_REQUESTS = '5';
process.env.AUTH_RATE_LIMIT_WINDOW_MS = '900000'; // 15 minutos

console.log('🔧 Variables de entorno de test configuradas');
console.log(`📊 NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`🔑 JWT_SECRET: ${process.env.JWT_SECRET ? 'Configurado' : 'No configurado'}`);
console.log(`🌐 PORT: ${process.env.PORT}`);
