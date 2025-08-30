# 🏥 Medical Appointments System

Sistema completo de citas médicas con arquitectura en capas, autenticación JWT y gestión de usuarios por roles.

## 📋 Tabla de Contenidos

- [🏗️ Descripción del Sistema](#️-descripción-del-sistema)
- [🔄 Arquitectura](#-arquitectura)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🎮 Controllers](#-controllers)
- [⚙️ Services](#️-services)
- [🗄️ Repositories](#️-repositories)
- [📊 Models](#-models)
- [🛣️ Routes](#️-routes)
- [🔧 Utils & Middleware](#️-utils--middleware)
- [⚙️ Configuración](#️-configuración)
- [🚀 Instalación y Uso](#-instalación-y-uso)
- [📋 Guía de Endpoints](#-guía-de-endpoints)
- [🔐 Autenticación](#-autenticación)
- [🔒 Seguridad](#-seguridad)
- [📚 Documentación](#-documentación)

---

## 🏗️ Descripción del Sistema

**Medical Appointments System** es una API REST completa para gestionar citas médicas entre pacientes y doctores. El sistema implementa:

- **Autenticación JWT** con roles diferenciados (Admin, Doctor, Patient)
- **Arquitectura en capas** (Controller → Service → Repository → Model)
- **Gestión de usuarios** con activación/desactivación
- **Sistema de citas** con validaciones de negocio
- **Búsqueda inteligente** de usuarios y especialidades
- **Paginación unificada** en todas las consultas
- **Validaciones robustas** en múltiples niveles

---

## 🔄 Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │───▶│     Services     │───▶│   Repositories   │
│                 │    │                 │    │                 │
│ • HTTP Requests │    │ • Business Logic│    │ • Data Access   │
│ • Validation    │    │ • Validation    │    │ • Queries       │
│ • Response      │    │ • Coordination  │    │ • Transactions  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │                       │
                               ▼                       ▼
                      ┌─────────────────┐    ┌─────────────────┐
                      │     Models      │    │   Middleware    │
                      │                 │    │                 │
                      │ • Data Schema   │    │ • Auth          │
                      │ • Validation    │    │ • Role Control  │
                      │ • Indexes       │    │ • Rate Limiting │
                      └─────────────────┘    └─────────────────┘
```

---

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/          # Controladores HTTP
│   │   ├── admin.controller.js
│   │   ├── appointments.controller.js
│   │   ├── auth.controller.js
│   │   └── users.controller.js
│   ├── services/             # Lógica de negocio
│   │   ├── admin.service.js
│   │   ├── appointments.service.js
│   │   ├── auth.service.js
│   │   └── user.service.js
│   ├── repositories/         # Acceso a datos
│   │   ├── admin.repository.js
│   │   ├── appointments.repository.js
│   │   ├── auth.repository.js
│   │   └── user.repository.js
│   ├── models/               # Esquemas MongoDB
│   │   ├── admin.model.js
│   │   ├── appointment.model.js
│   │   ├── doctor.model.js
│   │   └── patient.model.js
│   ├── routes/               # Definición de rutas
│   │   ├── admin.route.js
│   │   ├── appointments.route.js
│   │   ├── auth.route.js
│   │   └── users.route.js
│   ├── middleware/           # Middleware personalizado
│   │   └── auth.middleware.js
│   ├── utils/                # Utilidades
│   │   ├── custom.exceptions.js
│   │   ├── utils.js
│   │   └── validation.js
│   ├── config/               # Configuración
│   │   └── configs.js
│   └── app.js                # Aplicación principal
├── public/                   # Frontend estático
│   ├── css/                  # Estilos CSS
│   ├── js/                   # JavaScript frontend
│   └── *.html                # Páginas HTML
├── package.json
└── jest.config.js
```

---

## 🎮 Controllers

### Admin Controller
Gestiona usuarios del sistema (doctores y pacientes).

| Método | Descripción | Endpoint |
|--------|-------------|----------|
| `getAllAdmins` | Lista todos los administradores | `GET /api/admin/admins` |
| `activateDoctor` | Activa cuenta de doctor | `PUT /api/admin/doctors/:id/activate` |
| `deactivateDoctor` | Desactiva cuenta de doctor | `PUT /api/admin/doctors/:id/deactivate` |
| `updateDoctor` | Actualiza información de doctor | `PUT /api/admin/doctors/:id` |
| `deleteDoctor` | Desactiva doctor (soft delete) | `DELETE /api/admin/doctors/:id` |
| `activatePatient` | Activa cuenta de paciente | `PUT /api/admin/patients/:id/activate` |
| `deactivatePatient` | Desactiva cuenta de paciente | `PUT /api/admin/patients/:id/deactivate` |
| `updatePatient` | Actualiza información de paciente | `PUT /api/admin/patients/:id` |
| `deletePatient` | Desactiva paciente (soft delete) | `DELETE /api/admin/patients/:id` |

### Appointments Controller
Gestiona citas médicas del sistema.

| Método | Descripción | Endpoint |
|--------|-------------|----------|
| `createAppointment` | Crea nueva cita | `POST /api/appointments` |
| `getAllAppointments` | Lista citas con filtros | `GET /api/appointments` |
| `getAppointmentById` | Obtiene cita por ID | `GET /api/appointments/:id` |
| `getAppointmentByDoctor` | Lista citas de un doctor | `GET /api/appointments/doctor/:id` |
| `getAppointmentByPatient` | Lista citas de un paciente | `GET /api/appointments/patient/:id` |
| `findAppointmentsByDateRange` | Busca citas por rango de fechas | `GET /api/appointments/date-range` |
| `findAppointmentsByStatus` | Busca citas por estado | `GET /api/appointments/status` |
| `getAvailableSlots` | Obtiene horarios disponibles | `GET /api/appointments/available-slots/:doctorId` |
| `updateAppointmentStatus` | Actualiza estado de cita | `PUT /api/appointments/:id/status` |
| `updateAppointmentDate` | Actualiza fecha/hora de cita | `PUT /api/appointments/:id/date` |
| `deleteAppointment` | Cancela cita | `DELETE /api/appointments/:id` |
| `cancelAllDoctorAppointmentsInWeek` | Cancela todas las citas de un doctor en una semana | `POST /api/appointments/doctor/:id/cancel-week` |

### Auth Controller
Maneja autenticación y registro de usuarios.

| Método | Descripción | Endpoint |
|--------|-------------|----------|
| `register` | Registra nuevo usuario | `POST /api/auth/register` |
| `login` | Autentica usuario | `POST /api/auth/login` |
| `logout` | Cierra sesión | `GET /api/auth/logout` |

### Users Controller
Gestión y búsqueda de usuarios del sistema.

| Método | Descripción | Endpoint |
|--------|-------------|----------|
| `getAllDoctors` | Lista todos los doctores con paginación | `GET /api/users/doctors` |
| `getAllPatients` | Lista todos los pacientes con paginación | `GET /api/users/patients` |
| `findActiveDoctors` | Lista doctores activos con paginación | `GET /api/users/active-doctors` |
| `findActivePatients` | Lista pacientes activos con paginación | `GET /api/users/active-patients` |
| `findInactiveDoctors` | Lista doctores inactivos | `GET /api/users/inactive-doctors` |
| `findInactivePatients` | Lista pacientes inactivos con paginación | `GET /api/users/inactive-patients` |
| `searchUsers` | Búsqueda unificada inteligente | `GET /api/users/search?q=query` |
| `getDoctorById` | Obtiene doctor por ID | `GET /api/users/doctors/:id` |
| `getPatientById` | Obtiene paciente por ID | `GET /api/users/patients/:id` |
| `getMyProfile` | Obtiene perfil del usuario autenticado | `GET /api/users/profile` |

---

## ⚙️ Services

### Admin Service
Lógica de negocio para gestión administrativa.

- **`getAllAdmins()`** - Obtiene todos los administradores
- **`activateDoctor(doctorId)`** - Activa cuenta de doctor
- **`deactivateDoctor(doctorId)`** - Desactiva cuenta de doctor
- **`updateDoctor(doctorId, updateData)`** - Actualiza información de doctor con validación de campos
- **`deleteDoctor(doctorId)`** - Elimina doctor del sistema
- **`activatePatient(patientId)`** - Activa cuenta de paciente
- **`deactivatePatient(patientId)`** - Desactiva cuenta de paciente
- **`updatePatient(patientId, updateData)`** - Actualiza información de paciente con validación de campos
- **`deletePatient(patientId)`** - Elimina paciente del sistema

### Appointments Service
Lógica de negocio para citas médicas.

- **`createAppointmentService(appointmentData)`** - Crea nueva cita con validación de doctor activo
- **`findAllAppointments(filters, page, limit)`** - Lista citas con filtros y paginación
- **`findAppointmentById(appointmentId)`** - Obtiene cita por ID con población de datos
- **`findAppointmentsByDoctor(doctorId, filters)`** - Lista citas de un doctor específico
- **`findAppointmentsByPatient(patientId, filters)`** - Lista citas de un paciente específico
- **`findAppointmentsByDateRange(startDate, endDate, filters)`** - Busca citas por rango de fechas
- **`findAppointmentsByStatus(status, filters)`** - Busca citas por estado específico
- **`findAvailableSlots(doctorId, date)`** - Obtiene horarios disponibles excluyendo ocupados
- **`updateAppointmentStatus(appointmentId, newStatus)`** - Actualiza estado con validaciones
- **`updateAppointmentDateTime(appointmentId, newDateTime)`** - Actualiza fecha/hora con validación de conflictos
- **`deleteAppointment(appointmentId)`** - Cancela cita (soft delete)
- **`cancelAllDoctorAppointmentsInWeek(doctorId, startDate, endDate, reason)`** - Cancela múltiples citas

### Auth Service
Lógica de autenticación y registro con validaciones.

- **`register(userData, role)`** - Registra nuevo usuario con validación de email único
- **`login(email, password)`** - Autentica usuario con validación de cuenta activa
- **`logout(userId)`** - Maneja cierre de sesión

### User Service
Lógica para gestión de usuarios con paginación.

- **`getAllDoctors(page, limit)`** - Lista todos los doctores con paginación opcional
- **`getAllPatients(page, limit)`** - Lista todos los pacientes con paginación opcional
- **`findActiveDoctors(page, limit)`** - Lista doctores activos con paginación
- **`findActivePatients(page, limit)`** - Lista pacientes activos con paginación
- **`findInactiveDoctors(page, limit)`** - Lista doctores inactivos con paginación
- **`findInactivePatients(page, limit)`** - Lista pacientes inactivos con paginación
- **`searchUsers(query)`** - Búsqueda unificada inteligente en todos los campos
- **`findDoctorById(doctorId)`** - Busca doctor por ID
- **`findPatientById(patientId)`** - Busca paciente por ID
- **`getMyProfile(userId, userRole)`** - Obtiene perfil del usuario autenticado

---

## 🗄️ Repositories

### Admin Repository
Acceso a datos para gestión administrativa.

- **`getAllAdmins()`** - Obtiene todos los administradores
- **`activateDoctor(doctorId)`** - Activa cuenta de doctor
- **`deactivateDoctor(doctorId)`** - Desactiva cuenta de doctor
- **`updateDoctor(doctorId, updateData)`** - Actualiza información de doctor
- **`deleteDoctor(doctorId)`** - Elimina doctor del sistema (hard delete)
- **`activatePatient(patientId)`** - Activa cuenta de paciente
- **`deactivatePatient(patientId)`** - Desactiva cuenta de paciente
- **`updatePatient(patientId, updateData)`** - Actualiza información de paciente
- **`deletePatient(patientId)`** - Elimina paciente del sistema (hard delete)

### Appointments Repository
Acceso a datos para citas médicas con validaciones.

- **`createAppointment(appointmentData)`** - Crea nueva cita
- **`findAllAppointments(filters, page, limit)`** - Lista citas con filtros y paginación
- **`findAppointmentById(appointmentId)`** - Obtiene cita por ID con población
- **`findAppointmentsByDoctor(doctorId, filters)`** - Lista citas de un doctor
- **`findAppointmentsByPatient(patientId, filters)`** - Lista citas de un paciente
- **`findAppointmentsByDateRange(startDate, endDate, filters)`** - Busca citas por rango de fechas
- **`findAppointmentsByStatus(status, filters)`** - Busca citas por estado
- **`findAvailableSlots(doctorId, date)`** - Genera slots disponibles (9:00-17:00, 30min)
- **`updateAppointmentStatus(appointmentId, newStatus)`** - Actualiza estado de cita
- **`updateAppointmentDateTime(appointmentId, newDateTime)`** - Actualiza fecha/hora con validación de conflictos
- **`deleteAppointment(appointmentId)`** - Cancela cita (soft delete)
- **`cancelAllDoctorAppointmentsInWeek(doctorId, startDate, endDate, reason)`** - Cancela múltiples citas

### Auth Repository
Acceso a datos para autenticación y registro.

- **`createAdmin(adminData)`** - Crea nuevo administrador
- **`createDoctor(doctorData)`** - Crea nuevo doctor
- **`createPatient(patientData)`** - Crea nuevo paciente
- **`checkEmailExists(email)`** - Verifica si email ya existe en cualquier rol

### User Repository
Acceso a datos para gestión de usuarios con paginación.

- **`getAllDoctors(page, limit)`** - Lista todos los doctores con paginación opcional
- **`getAllPatients(page, limit)`** - Lista todos los pacientes con paginación opcional
- **`findActiveDoctors(page, limit)`** - Lista doctores activos con paginación
- **`findActivePatients(page, limit)`** - Lista pacientes activos con paginación
- **`findInactiveDoctors()`** - Lista doctores inactivos
- **`findInactivePatients(page, limit)`** - Lista pacientes inactivos con paginación
- **`findAdminById(adminId)`** - Busca administrador por ID
- **`findDoctorById(doctorId)`** - Busca doctor por ID
- **`findPatientById(patientId)`** - Busca paciente por ID
- **`searchUsers(query)`** - Búsqueda unificada inteligente en todos los campos (nombre, email, DNI, licencia, especialidades)

---

## 📊 Models

### Admin Model
```javascript
{
  email: String,           // Email único (required)
  password: String,        // Contraseña hasheada (required)
  name: String,            // Nombre (required)
  lastname: String,        // Apellido (optional)
  personalId: String,      // DNI único (required)
  phone: String,           // Teléfono (optional)
  dateOfBirth: Date,       // Fecha de nacimiento (optional)
  isActive: Boolean,       // Estado activo/inactivo (default: true)
  timestamps: true         // createdAt, updatedAt
}
```

### Doctor Model
```javascript
{
  email: String,           // Email único (required)
  password: String,        // Contraseña hasheada (required)
  personalId: String,      // DNI único (required)
  name: String,            // Nombre (required)
  lastname: String,        // Apellido (optional)
  specialties: [String],   // Array de especialidades (required)
  license: String,         // Número de licencia único (required)
  phone: String,           // Teléfono (optional)
  dateOfBirth: Date,       // Fecha de nacimiento (optional)
  isActive: Boolean,       // Estado activo/inactivo (default: true)
  timestamps: true         // createdAt, updatedAt
}
```

### Patient Model
```javascript
{
  email: String,           // Email único (required)
  password: String,        // Contraseña hasheada (required)
  personalId: String,      // DNI único (required)
  name: String,            // Nombre (required)
  lastname: String,        // Apellido (optional)
  dateOfBirth: Date,       // Fecha de nacimiento (optional)
  phone: String,           // Teléfono (optional)
  isActive: Boolean,       // Estado activo/inactivo (default: true)
  timestamps: true         // createdAt, updatedAt
}
```

### Appointment Model
```javascript
{
  patient: ObjectId,       // Referencia a Patient
  doctor: ObjectId,        // Referencia a Doctor
  date: Date,              // Fecha y hora de la cita
  status: String,          // 'pending', 'confirmed', 'cancelled', 'completed'
  timestamps: true         // createdAt, updatedAt
}
```

---

## 🛣️ Routes

### Admin Routes (`/api/admin`)
- **`GET /admins`** - Lista todos los administradores
- **`PUT /doctors/:id/activate`** - Activa doctor
- **`PUT /doctors/:id/deactivate`** - Desactiva doctor
- **`PUT /doctors/:id`** - Actualiza doctor
- **`DELETE /doctors/:id`** - Desactiva doctor
- **`PUT /patients/:id/activate`** - Activa paciente
- **`PUT /patients/:id/deactivate`** - Desactiva paciente
- **`PUT /patients/:id`** - Actualiza paciente
- **`DELETE /patients/:id`** - Desactiva paciente

### Appointments Routes (`/api/appointments`)
- **`GET /`** - Lista citas con filtros
- **`GET /date-range`** - Busca citas por rango de fechas
- **`GET /status`** - Busca citas por estado
- **`GET /available-slots/:doctorId`** - Obtiene horarios disponibles
- **`GET /doctor/:id`** - Lista citas de un doctor
- **`GET /patient/:id`** - Lista citas de un paciente
- **`GET /:id`** - Obtiene cita por ID
- **`POST /`** - Crea nueva cita
- **`PUT /:id/status`** - Actualiza estado de cita
- **`PUT /:id/date`** - Actualiza fecha/hora de cita
- **`DELETE /:id`** - Cancela cita
- **`POST /doctor/:id/cancel-week`** - Cancela todas las citas de un doctor en una semana

### Auth Routes (`/api/auth`)
- **`POST /register`** - Registra nuevo usuario
- **`POST /login`** - Autentica usuario
- **`GET /logout`** - Cierra sesión

### Profile Routes (`/api/profile`)
- **`GET /`** - Obtiene perfil del usuario logueado
- **`PUT /`** - Actualiza perfil del usuario

### Public Routes (`/api/public`)
- **`GET /doctors`** - Lista doctores activos (público)
- **`GET /specialties`** - Lista todas las especialidades
- **`GET /doctors/search`** - Busca doctores por especialidad
- **`GET /doctors/:id/schedule`** - Obtiene información de doctor

### Users Routes (`/api/users`)
- **`GET /doctors`** - Lista todos los doctores
- **`GET /patients`** - Lista todos los pacientes
- **`GET /active-doctors`** - Lista doctores activos
- **`GET /active-patients`** - Lista pacientes activos
- **`GET /inactive-doctors`** - Lista doctores inactivos
- **`GET /inactive-patients`** - Lista pacientes inactivos
- **`GET /search`** - Búsqueda unificada inteligente
- **`GET /doctors/license/:license`** - Busca doctor por licencia




- **`GET /doctors-by-name`** - Busca doctores por nombre
- **`GET /patients-by-name`** - Busca pacientes por nombre

---

## 🔧 Utils & Middleware

### Authentication Middleware
- **`authenticateToken`** - Verifica JWT token y agrega `req.user`
- **`requireRole(allowedRoles)`** - Verifica que usuario tenga rol permitido

### Utility Functions
- **`createHash(password)`** - Hashea contraseña con bcrypt
- **`isValidPassword(plainPassword, hashedPassword)`** - Valida contraseña
- **`generateToken(user)`** - Genera JWT token
- **`verifyToken(token)`** - Verifica y decodifica JWT token
- **`isValidObjectId(id)`** - Valida formato de MongoDB ObjectId
- **`validateEnv()`** - Valida variables de entorno requeridas

### Custom Exceptions
- **`UserAlreadyExists`** - Usuario ya existe en el sistema
- **`InvalidCredentials`** - Credenciales inválidas

---

## ⚙️ Configuración

### Variables de Entorno (.env)
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/medical_appointments
PRIVATE_KEY_JWT=tu_clave_secreta_jwt
JWT_EXPIRES_IN=24h
```

### ROLE_CONFIG
```javascript
{
  validRoles: ['admin', 'doctor', 'patient'],
  handlers: {
    admin: 'createAdmin',
    doctor: 'createDoctor',
    patient: 'createPatient'
  }
}
```

---

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- MongoDB 6+
- npm o yarn

### Instalación
```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env con:
PRIVATE_KEY_JWT=your_secret_key_here
JWT_EXPIRES_IN=24h
MONGO_URI=mongodb://localhost:27017/medical_appointments
PORT=8080
NODE_ENV=development

# Iniciar servidor de desarrollo
npm run dev

# Iniciar servidor de producción
npm start
```

### Scripts Disponibles
```json
{
  "start": "node src/app.js",
  "dev": "nodemon src/app.js",
  "test": "node --experimental-vm-modules ./node_modules/jest/bin/jest.js"
}
```

### Acceso a la Aplicación
- **Frontend**: `http://localhost:8080`
- **API**: `http://localhost:8080/api`
- **Login**: `http://localhost:8080/index.html`

---

## 📋 Guía de Endpoints

### Endpoints Públicos (Sin Autenticación)
- **`GET /api/public/doctors`** - Lista doctores activos
- **`GET /api/public/specialties`** - Lista especialidades
- **`GET /api/public/doctors/search?specialty=Cardiology`** - Busca doctores por especialidad
- **`GET /api/public/doctors/:id/schedule`** - Información de doctor

### Endpoints de Autenticación
- **`POST /api/auth/register`** - Registro de usuarios
- **`POST /api/auth/login`** - Login de usuarios

### Endpoints Protegidos por Rol

#### Admin Only
- **`GET /api/admin/*`** - Gestión de usuarios del sistema
- **`GET /api/users/*`** - Búsqueda y gestión de usuarios

#### Admin + Doctor
- **`PUT /api/appointments/:id/status`** - Actualizar estado de citas
- **`PUT /api/appointments/:id/date`** - Reprogramar citas

#### Admin + Doctor + Patient
- **`GET /api/profile`** - Ver perfil personal
- **`PUT /api/profile`** - Actualizar perfil personal

#### Patient + Admin
- **`POST /api/appointments`** - Crear citas
- **`GET /api/appointments/patient/:id`** - Ver citas propias

---

## 🔐 Autenticación

### Registro de Usuario
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Dr. John Smith",
  "email": "john.smith@hospital.com",
  "password": "secure123",
  "personalId": "87654321",
  "role": "doctor",
  "license": "MD12345",
  "specialties": ["Cardiology", "Internal Medicine"],
  "phone": "+54 9 11 9876-5432"
}
```

### Login de Usuario
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.smith@hospital.com",
  "password": "secure123"
}
```

### Uso del Token
```bash
GET /api/profile
Authorization: Bearer <JWT_TOKEN>
```

### Roles y Permisos
- **Admin**: Acceso completo al sistema
- **Doctor**: Gestión de citas propias, ver pacientes
- **Patient**: Crear/ver citas propias, buscar doctores

---

## 🧪 Testing

### Testing Manual con Postman/Insomnia

#### 1. Crear Usuario Admin
```bash
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@hospital.com",
  "password": "admin123",
  "personalId": "12345678",
  "role": "admin",
  "phone": "+54 9 11 1234-5678"
}
```

#### 2. Crear Doctor
```bash
POST /api/auth/register
{
  "name": "Dr. Jane Doe",
  "email": "jane.doe@hospital.com",
  "password": "doctor123",
  "personalId": "87654321",
  "role": "doctor",
  "license": "MD87654",
  "specialties": ["Pediatrics"],
  "phone": "+54 9 11 8765-4321"
}
```

#### 3. Crear Paciente
```bash
POST /api/auth/register
{
  "name": "John Patient",
  "email": "john.patient@email.com",
  "password": "patient123",
  "personalId": "11223344",
  "role": "patient",
  "phone": "+54 9 11 1122-3344"
}
```

#### 4. Login y Obtener Token
```bash
POST /api/auth/login
{
  "email": "admin@hospital.com",
  "password": "admin123"
}
```

#### 5. Usar Token para Operaciones
```bash
GET /api/admin/admins
Authorization: Bearer <TOKEN_OBTENIDO>
```

### Testing de Endpoints Públicos
```bash
# Listar doctores activos
GET /api/public/doctors

# Buscar por especialidad
GET /api/public/doctors/search?specialty=Cardiology

# Ver especialidades disponibles
GET /api/public/specialties
```

---

## 🔒 Seguridad

### Autenticación y Autorización
- **JWT Tokens** con cookies HttpOnly para prevenir XSS
- **Role-based Access Control** (RBAC) con middleware
- **Password hashing** con bcrypt y salt rounds
- **Token expiration** configurable
- **Account deactivation** para suspender usuarios

### Rate Limiting
- **Global rate limiting**: 100 requests/15min por IP
- **Auth rate limiting**: 5 intentos de login/15min por IP
- **Protection against brute force** attacks

### Validaciones de Entrada
- **MongoDB ObjectId validation** en parámetros
- **Input sanitization** en búsquedas
- **Date validation** para citas futuras
- **Business rules validation** en múltiples capas

### Protección de Datos
- **Password exclusion** en todas las consultas (`.select('-password')`)
- **Sensitive data filtering** en responses
- **Error message sanitization** para no exponer información del sistema

### Recomendaciones de Producción
```javascript
// Variables de entorno requeridas
PRIVATE_KEY_JWT=your_secret_key_here
JWT_EXPIRES_IN=24h
MONGO_URI=mongodb://localhost:27017/medical_appointments
NODE_ENV=production
```

---

## 📚 Documentación

### JSDoc
Todo el código está documentado con JSDoc para:
- **Funciones y métodos** con parámetros y tipos
- **Clases y modelos** con descripción y ejemplos
- **Validaciones** y reglas de negocio
- **Ejemplos de uso** para cada función

### Generar Documentación
```bash
# Instalar Documentation.js
npm install --save-dev documentation

# Generar HTML
npx documentation build src/**/*.js -f html -o docs

# Generar Markdown
npx documentation build src/**/*.js -f md -o docs
```

---

## 🤝 Contribución

### Estándares de Código
- **JSDoc** obligatorio para todas las funciones públicas
- **Single quotes** para strings
- **Arrow functions** para métodos de clase
- **Async/await** para operaciones asíncronas
- **Error handling** consistente en todas las capas

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
refactor: refactorización de código
test: agregar o modificar tests
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 📞 Soporte

Para soporte técnico o preguntas:
- **Email**: soporte@medicalappointments.com
- **Issues**: [GitHub Issues](https://github.com/username/medical-appointments/issues)
- **Documentación**: [Wiki del Proyecto](https://github.com/username/medical-appointments/wiki)

---

**¡Gracias por usar Medical Appointments System!** 🏥✨
