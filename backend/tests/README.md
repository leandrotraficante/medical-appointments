# 🧪 Tests - Medical Appointments API

## 📁 Estructura de Tests

```
tests/
├── unit/                    # Tests unitarios
│   ├── controllers/         # Tests de controladores
│   ├── services/           # Tests de servicios
│   ├── models/             # Tests de modelos
│   └── middleware/         # Tests de middleware
├── integration/            # Tests de integración
│   └── routes/             # Tests de rutas
├── setup/                  # Configuración de tests
└── utils/                  # Utilidades para tests
```

## 🚀 Comandos de Test

### **Ejecutar todos los tests:**
```bash
npm test
```

### **Ejecutar tests en modo watch (desarrollo):**
```bash
npm run test:watch
```

### **Ejecutar tests con cobertura:**
```bash
npm run test:coverage
```

### **Ejecutar tests con output verbose:**
```bash
npm run test:verbose
```

## 🎯 Tipos de Tests

### **Unit Tests:**
- **Controllers**: Lógica de controladores individuales
- **Services**: Lógica de negocio
- **Models**: Validaciones de Mongoose
- **Middleware**: Funciones de middleware

### **Integration Tests:**
- **Routes**: Endpoints completos de la API
- **Database**: Operaciones con base de datos

## 🛠️ Configuración

### **Base de Datos:**
- **MongoDB en memoria** para tests
- **Datos aislados** entre tests
- **Cleanup automático** después de cada test

### **Mocks:**
- **Servicios externos** mockeados
- **Base de datos** aislada
- **Datos de prueba** consistentes

## 📝 Escribir Nuevos Tests

### **1. Test Unitario Básico:**
```javascript
import { functionToTest } from '../../../src/path/to/file.js';

describe('Function Name', () => {
  test('debería hacer algo específico', () => {
    const result = functionToTest(input);
    expect(result).toBe(expectedOutput);
  });
});
```

### **2. Test de Integración:**
```javascript
import request from 'supertest';
import app from '../../../src/app.js';

describe('API Endpoint', () => {
  test('debería responder correctamente', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);
    
    expect(response.body).toBeDefined();
  });
});
```

## 🔧 Troubleshooting

### **Tests fallan con MongoDB:**
- Verificar que `mongodb-memory-server` esté instalado
- Revisar conexión en `test-setup.js`

### **Tests fallan con imports:**
- Verificar rutas de import
- Asegurar que archivos existan

### **Tests lentos:**
- Usar `npm run test:watch` para desarrollo
- Revisar `beforeAll` y `afterAll` hooks

## 📊 Cobertura de Código

Los tests generan reportes de cobertura en:
- `coverage/` - Carpeta con reportes HTML
- `coverage/lcov-report/` - Reporte detallado
- `coverage/coverage-summary.json` - Resumen JSON

## 🎉 ¡Listo para Testear!

Tu API ahora tiene una base sólida de tests. ¡Ejecuta `npm test` para empezar!
