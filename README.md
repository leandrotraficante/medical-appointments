# 🏥 Medical Appointments System

Sistema completo de citas médicas con arquitectura en capas, autenticación JWT y gestión de usuarios por roles.

## 📋 Tabla de Contenidos

- [🏗️ Descripción del Sistema](#️-descripción-del-sistema)
- [🚀 Demo en Vivo](#-demo-en-vivo)
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
- [🧪 Testing](#-testing)
- [📚 Documentación](#-documentación)

---

## 🏗️ Descripción del Sistema

**Medical Appointments System** es una API REST completa para gestionar citas médicas entre pacientes y doctores. El sistema implementa:

- **Autenticación JWT** con roles diferenciados
- **Arquitectura en capas** (MVC + Repository Pattern)
- **Gestión de usuarios** por roles (Admin, Doctor, Patient)
- **Búsqueda inteligente** de doctores y especialidades
- **Gestión de citas** con estados y validaciones
- **Perfiles personales** editables
- **Endpoints públicos** para búsqueda sin autenticación

---

## 🚀 Demo en Vivo

### 🌐 Aplicación Desplegada
**URL de Producción:** [Enlace a Railway cuando esté desplegado]

### 👥 Usuarios de Prueba

**🔐 Admin (Gestión Completa):**
- **Email:** `admin@portfolio.com`
- **Password:** `Admin123!`
- **Funcionalidades:** 
  - Gestión completa de usuarios (activar/desactivar)
  - Gestión de citas médicas
  - Panel de administración completo
  - Estadísticas del sistema

**👨‍⚕️ Doctor (Gestión Médica):**
- **Email:** `doctor@portfolio.com`
- **Password:** `Doctor123!`
- **Funcionalidades:**
  - Ver citas asignadas
  - Actualizar estado de citas
  - Gestionar perfil médico
  - Ver historial de pacientes

**👤 Paciente (Gestión Personal):**
- **Email:** `paciente@portfolio.com`
- **Password:** `Paciente123!`
- **Funcionalidades:**
  - Reservar citas médicas
  - Ver historial de citas
  - Gestionar perfil personal
  - Buscar doctores disponibles

### 📱 Características del Demo
- **Frontend Responsivo** con HTML, CSS y JavaScript vanilla
- **Autenticación JWT** con cookies seguras
- **Gestión de roles** diferenciada por usuario
- **Validaciones en tiempo real** en formularios
- **Búsqueda inteligente** de doctores y especialidades
- **Sistema de citas** completo con estados

### ⚠️ Nota Importante
*Estos usuarios están configurados para demostración del portfolio. Los datos reales se configuran en producción.*

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
                       │ • Indexes       │    │ • Error Handling│
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
│   │   ├── profile.controller.js
│   │   ├── public.controller.js
│   │   └── users.controller.js
│   ├── services/             # Lógica de negocio
│   │   ├── admin.service.js
│   │   ├── appointments.service.js
│   │   ├── auth.service.js
│   │   ├── profile.service.js
│   │   ├── public.service.js
│   │   └── user.service.js
│   ├── repositories/         # Acceso a datos
│   │   ├── admin.repository.js
│   │   ├── appointments.repository.js
│   │   ├── auth.repository.js
│   │   ├── profile.repository.js
│   │   ├── public.repository.js
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
│   │   ├── profile.route.js
│   │   ├── public.route.js
│   │   └── users.route.js
│   ├── middleware/           # Middleware personalizado
│   │   └── auth.middleware.js
│   ├── utils/                # Utilidades del sistema
│   │   ├── custom.exceptions.js
│   │   ├── utils.js
│   │   └── validation.js
│   ├── config/               # Configuraciones
│   │   └── configs.js
│   └── app.js               # Punto de entrada
├── package.json
└── README.md
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

### Profile Controller
Gestiona perfiles personales de usuarios.

| Método | Descripción | Endpoint |
|--------|-------------|----------|
| `getMyProfile` | Obtiene perfil del usuario logueado | `GET /api/profile` |
| `updateMyProfile` | Actualiza perfil del usuario | `PUT /api/profile` |

### Public Controller
Endpoints públicos para búsqueda de doctores.

| Método | Descripción | Endpoint |
|--------|-------------|----------|
| `getActiveDoctors` | Lista doctores activos (público) | `GET /api/public/doctors` |
| `getAllSpecialties` | Lista todas las especialidades | `GET /api/public/specialties` |
| `searchDoctorsBySpecialty` | Busca doctores por especialidad | `GET /api/public/doctors/search` |
| `getDoctorSchedule` | Obtiene información de doctor | `GET /api/public/doctors/:id/schedule` |

### Users Controller
Gestión y búsqueda de usuarios del sistema.

| Método | Descripción | Endpoint |
|--------|-------------|----------|
| `getAllDoctors` | Lista todos los doctores | `GET /api/users/doctors` |
| `getAllPatients` | Lista todos los pacientes | `GET /api/users/patients` |
| `findActiveDoctors` | Lista doctores activos | `GET /api/users/active-doctors` |
| `findActivePatients` | Lista pacientes activos | `GET /api/users/active-patients` |
| `findInactiveDoctors` | Lista doctores inactivos | `GET /api/users/inactive-doctors` |
| `findInactivePatients` | Lista pacientes inactivos | `GET /api/users/inactive-patients` |
| `searchUsers` | Búsqueda unificada inteligente | `GET /api/users/search?q=query` |
| `findDoctorByLicense` | Busca doctor por licencia | `GET /api/users/doctors/license/:license` |
| `searchDoctorsByName` | Busca doctores por nombre | `GET /api/users/doctors-by-name?searchTerm=name` |
| `searchPatientsByName` | Busca pacientes por nombre | `GET /api/users/patients-by-name?searchTerm=name` |

---

## ⚙️ Services

### Admin Service
Lógica de negocio para gestión administrativa.

- **`getAllAdmins()`** - Obtiene todos los administradores
- **`activateDoctor(doctorId)`** - Activa cuenta de doctor
- **`deactivateDoctor(doctorId)`** - Desactiva cuenta de doctor
- **`updateDoctor(doctorId, updateData)`** - Actualiza información de doctor
- **`deleteDoctor(doctorId)`** - Desactiva doctor (soft delete)
- **`activatePatient(patientId)`** - Activa cuenta de paciente
- **`deactivatePatient(patientId)`** - Desactiva cuenta de paciente
- **`updatePatient(patientId, updateData)`** - Actualiza información de paciente
- **`deletePatient(patientId)`** - Desactiva paciente (soft delete)

### Appointments Service
Lógica de negocio para citas médicas.

- **`createAppointmentService(appointmentData)`** - Crea nueva cita
- **`findAllAppointments(filters)`** - Lista citas con filtros
- **`findAppointmentById(appointmentId)`** - Obtiene cita por ID
- **`findAppointmentsByDoctor(doctorId, filters)`** - Lista citas de un doctor
- **`findAppointmentsByPatient(patientId, filters)`** - Lista citas de un paciente
- **`findAvailableSlots(doctorId, date)`** - Obtiene horarios disponibles
- **`updateAppointmentDateTime(appointmentId, newDateTime)`** - Actualiza fecha/hora

### Auth Service
Lógica de autenticación y registro.

- **`register(userData, role)`** - Registra nuevo usuario
- **`login(email, password)`** - Autentica usuario

### Profile Service
Lógica para gestión de perfiles.

- **`getMyProfile(userId, role)`** - Obtiene perfil de usuario
- **`updateMyProfile(userId, role, updateData)`** - Actualiza perfil

### Public Service
Lógica para endpoints públicos.

- **`getActiveDoctors()`** - Lista doctores activos
- **`getAllSpecialties()`** - Lista todas las especialidades
- **`searchDoctorsBySpecialty(specialty)`** - Busca doctores por especialidad
- **`getDoctorSchedule(doctorId)`** - Obtiene información de doctor

### User Service
Lógica para gestión de usuarios.

- **`getAllDoctors()`** - Lista todos los doctores
- **`getAllPatients()`** - Lista todos los pacientes
- **`findActiveDoctors()`** - Lista doctores activos
- **`findActivePatients()`** - Lista pacientes activos
- **`findInactiveDoctors()`** - Lista doctores inactivos
- **`findInactivePatients()`** - Lista pacientes inactivos
- **`searchUsers(query)`** - Búsqueda unificada inteligente
- **`findDoctorByLicense(license)`** - Busca doctor por licencia
- **`searchDoctorsByName(searchTerm)`** - Busca doctores por nombre
- **`searchPatientsByName(searchTerm)`** - Busca pacientes por nombre

---

## 🗄️ Repositories

### Admin Repository
Acceso a datos para gestión administrativa.

- **`getAllAdmins()`** - Obtiene todos los administradores
- **`activateDoctor(doctorId)`** - Activa cuenta de doctor
- **`deactivateDoctor(doctorId)`** - Desactiva cuenta de doctor
- **`updateDoctor(doctorId, updateData)`** - Actualiza información de doctor
- **`deleteDoctor(doctorId)`** - Desactiva doctor (soft delete)
- **`activatePatient(patientId)`** - Activa cuenta de paciente
- **`deactivatePatient(patientId)`** - Desactiva cuenta de paciente
- **`updatePatient(patientId, updateData)`** - Actualiza información de paciente
- **`deletePatient(patientId)`** - Desactiva paciente (soft delete)

### Appointments Repository
Acceso a datos para citas médicas.

- **`createAppointment(appointmentData)`** - Crea nueva cita
- **`findAllAppointments(filters)`** - Lista citas con filtros
- **`findAppointmentById(appointmentId)`** - Obtiene cita por ID
- **`findAppointmentsByDoctor(doctorId, filters)`** - Lista citas de un doctor
- **`findAppointmentsByPatient(patientId, filters)`** - Lista citas de un paciente
- **`findAppointmentsByDateRange(startDate, endDate, filters)`** - Busca citas por rango de fechas
- **`findAppointmentsByStatus(status, filters)`** - Busca citas por estado
- **`findAvailableSlots(doctorId, date)`** - Obtiene horarios disponibles
- **`updateAppointmentStatus(appointmentId, newStatus)`** - Actualiza estado de cita
- **`updateAppointmentDateTime(appointmentId, newDateTime)`** - Actualiza fecha/hora
- **`deleteAppointment(appointmentId)`** - Cancela cita
- **`cancelAllDoctorAppointmentsInWeek(doctorId, startDate, endDate, reason)`** - Cancela todas las citas de un doctor en una semana

### Auth Repository
Acceso a datos para autenticación.

- **`createAdmin(adminData)`** - Crea nuevo administrador
- **`createDoctor(doctorData)`** - Crea nuevo doctor
- **`createPatient(patientData)`** - Crea nuevo paciente
- **`checkEmailExists(email)`** - Verifica si email ya existe

### Profile Repository
Acceso a datos para perfiles.

- **`findUserByIdAndRole(userId, role)`** - Busca usuario por ID y rol
- **`updateUserProfile(userId, role, updateData)`** - Actualiza perfil de usuario

### Public Repository
Acceso a datos para endpoints públicos.

- **`getActiveDoctors()`** - Lista doctores activos
- **`getAllSpecialties()`** - Lista todas las especialidades
- **`searchDoctorsBySpecialty(specialty)`** - Busca doctores por especialidad
- **`getDoctorSchedule(doctorId)`** - Obtiene información de doctor

### User Repository
Acceso a datos para gestión de usuarios.

- **`getAllDoctors()`** - Lista todos los doctores
- **`getAllPatients()`** - Lista todos los pacientes
- **`findActiveDoctors()`** - Lista doctores activos
- **`findActivePatients()`** - Lista pacientes activos
- **`findInactiveDoctors()`** - Lista doctores inactivos
- **`findInactivePatients()`** - Lista pacientes inactivos
- **`findAdminById(adminId)`** - Busca administrador por ID
- **`findDoctorById(doctorId)`** - Busca doctor por ID
- **`findPatientById(patientId)`** - Busca paciente por ID
- **`searchUsers(query)`** - Búsqueda unificada inteligente
- **`findDoctorByLicense(license)`** - Busca doctor por licencia
- **`findDoctorByPersonalId(personalId)`** - Busca doctor por DNI
- **`findDoctorByEmail(email)`** - Busca doctor por email
- **`findPatientByPersonalId(personalId)`** - Busca paciente por DNI
- **`findPatientByEmail(email)`** - Busca paciente por email
- **`searchDoctorsByName(searchTerm)`** - Busca doctores por nombre
- **`searchPatientsByName(searchTerm)`** - Busca pacientes por nombre

---

## 📊 Models

### Admin Model
```javascript
{
  email: String,           // Email único (username)
  password: String,        // Contraseña hasheada
  name: String,            // Nombre
  lastname: String,        // Apellido
  personalId: String,      // DNI único
  phone: String,           // Teléfono
  role: String,            // Siempre 'admin'
  isActive: Boolean,       // Estado activo/inactivo
  permissions: {           // Permisos del sistema
    manageDoctors: Boolean,
    managePatients: Boolean,
    manageAppointments: Boolean,
    viewReports: Boolean,
    systemAdmin: Boolean
  },
  last_connection: Date,   // Última conexión
  timestamps: true         // createdAt, updatedAt
}
```

### Doctor Model
```javascript
{
  email: String,           // Email único (username)
  password: String,        // Contraseña hasheada
  personalId: String,      // DNI único
  name: String,            // Nombre
  lastname: String,        // Apellido
  specialties: [String],   // Array de especialidades
  license: String,         // Número de licencia único
  phone: String,           // Teléfono
  role: String,            // Siempre 'doctor'
  isActive: Boolean,       // Estado activo/inactivo
  last_connection: Date,   // Última conexión
  timestamps: true         // createdAt, updatedAt
}
```

### Patient Model
```javascript
{
  email: String,           // Email único (username)
  password: String,        // Contraseña hasheada
  personalId: String,      // DNI único
  name: String,            // Nombre
  lastname: String,        // Apellido (opcional)
  dateOfBirth: Date,       // Fecha de nacimiento
  phone: String,           // Teléfono (opcional)
  role: String,            // Siempre 'patient'
  isActive: Boolean,       // Estado activo/inactivo
  last_connection: Date,   // Última conexión
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
- Node.js 16+
- MongoDB 5+
- npm o yarn

### Instalación
```bash
# Clonar repositorio
git clone <repository-url>
cd MedicalAppointments/backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar servidor
npm start

# Modo desarrollo
npm run dev
```

### Scripts Disponibles
```json
{
  "start": "node src/app.js",
  "dev": "nodemon src/app.js",
  "test": "jest"
}
```

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