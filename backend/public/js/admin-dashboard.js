// Dashboard del Administrador - SOLO "Mi Perfil" por ahora
class AdminDashboard {
    constructor() {
        this.baseURL = '/api';
        this.init();
    }

    async init() {
        await this.loadProfile();
    }

    async loadProfile() {
        try {
            const response = await fetch(`${this.baseURL}/users/my-profile`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                this.displayProfile(data.data);
            } else {
                this.showMessage('Error al cargar el perfil', 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    displayProfile(profile) {
        const profileContainer = document.getElementById('profile-data');
        if (profileContainer) {
            profileContainer.innerHTML = `
                <div>
                    <p><strong>Nombre:</strong> ${profile.name} ${profile.lastname}</p>
                    <p><strong>Email:</strong> ${profile.email}</p>
                    <p><strong>Teléfono:</strong> ${profile.phone}</p>
                    <p><strong>DNI:</strong> ${profile.personalId}</p>
                    <p><strong>Rol:</strong> ${profile.role}</p>
                    <p><strong>Estado:</strong> ${profile.isActive ? 'Activo' : 'Inactivo'}</p>
                </div>
            `;
        }
    }

    showView(viewId) {
        if (viewId === 'admin-info') {
            this.showProfileView();
        } else if (viewId === 'users-management') {
            this.showUsersManagementView();
        } else if (viewId === 'appointments-management') {
            this.showAppointmentsManagementView();
        } else if (viewId === 'system-stats') {
            this.showSystemStatsView();
        }
    }

    showProfileView() {
        // Ocultar todas las secciones
        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(section => section.style.display = 'none');

        // Mostrar solo la sección del perfil
        const profileSection = document.getElementById('admin-info');
        if (profileSection) {
            profileSection.style.display = 'block';
        }
    }

    showUsersManagementView() {
        // Ocultar todas las secciones
        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(section => section.style.display = 'none');

        // Mostrar solo la sección de gestión de usuarios
        const usersSection = document.getElementById('users-management');
        if (usersSection) {
            usersSection.style.display = 'block';
        }
    }

    showSystemStatsView() {
        // Ocultar todas las secciones
        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(section => section.style.display = 'none');

        // Mostrar solo la sección de estadísticas
        const statsSection = document.getElementById('system-stats');
        if (statsSection) {
            statsSection.style.display = 'block';
            this.loadSystemStats();
        }
    }

    showAppointmentsManagementView() {
        // Ocultar todas las secciones
        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(section => section.style.display = 'none');

        // Mostrar solo la sección de gestión de citas
        const appointmentsSection = document.getElementById('appointments-management');
        if (appointmentsSection) {
            appointmentsSection.style.display = 'block';
        }
    }

    showUsersTab(userType) {
        // Ocultar todos los sub-tabs
        document.querySelectorAll('.users-subtabs').forEach(subtab => {
            subtab.style.display = 'none';
        });

        if (userType === 'doctors') {
            document.getElementById('doctors-subtabs').style.display = 'block';
            this.loadDoctors('all'); // Cargar todos por defecto
        } else if (userType === 'patients') {
            document.getElementById('patients-subtabs').style.display = 'block';
            this.loadPatients('all'); // Cargar todos por defecto
        } else if (userType === 'admins') {
            this.loadAdmins();
        }
    }

    // ===== FUNCIONES PARA CREAR DOCTOR =====
    showCreateDoctorForm() {
        const modal = document.getElementById('create-doctor-modal');
        if (modal) {
            modal.style.display = 'block';
            this.setupCreateDoctorForm();
        }
    }

    closeCreateDoctorModal() {
        const modal = document.getElementById('create-doctor-modal');
        if (modal) {
            modal.style.display = 'none';
            this.resetCreateDoctorForm();
        }
    }

    setupCreateDoctorForm() {
        const form = document.getElementById('create-doctor-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleCreateDoctorSubmit(e));
        }
    }

    resetCreateDoctorForm() {
        const form = document.getElementById('create-doctor-form');
        if (form) {
            form.reset();
        }
    }

    async handleCreateDoctorSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        // Ajustar la fecha de nacimiento para evitar problemas de zona horaria
        let adjustedDateOfBirth = formData.get('dateOfBirth');
        if (adjustedDateOfBirth) {
            // Crear fecha en zona horaria local para evitar el desfase de un día
            const date = new Date(adjustedDateOfBirth + 'T12:00:00');
            adjustedDateOfBirth = date.toISOString().split('T')[0];
        }

        const doctorData = {
            name: formData.get('name'),
            lastname: formData.get('lastname'),
            email: formData.get('email'),
            password: formData.get('password'),
            personalId: formData.get('personalId'),
            license: formData.get('license'),
            phone: formData.get('phone'),
            dateOfBirth: adjustedDateOfBirth,
            role: 'doctor'
        };

        // Obtener especialidades
        const specialtyInputs = document.querySelectorAll('.specialty-input');
        const specialties = [];
        specialtyInputs.forEach(input => {
            if (input.value.trim()) {
                specialties.push(input.value.trim());
            }
        });

        if (specialties.length === 0) {
            this.showMessage('Debes agregar al menos una especialidad', 'error');
            return;
        }

        doctorData.specialties = specialties;

        try {
            const response = await fetch(`${this.baseURL}/auth/create-doctor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(doctorData)
            });

            if (response.ok) {
                const result = await response.json();
                this.showMessage('Doctor registrado exitosamente', 'success');
                this.closeCreateDoctorModal();
                this.loadDoctors('all');
            } else {
                const errorData = await response.json();
                this.showMessage(`Error: ${errorData.message || 'No se pudo registrar el doctor'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión al registrar el doctor', 'error');
        }
    }

    async loadDoctors(filter = 'all', page = 1, limit = 5) {
        try {
            // Guardar el filtro actual para la paginación
            this.currentDoctorsFilter = filter;

            let url = `${this.baseURL}/users/doctors`;

            if (filter === 'active') {
                url = `${this.baseURL}/users/active-doctors`;
            } else if (filter === 'inactive') {
                url = `${this.baseURL}/users/inactive-doctors`;
            }

            // Agregar paginación para todos los filtros
            url += `?page=${page}&limit=${limit}`;

            const response = await fetch(url, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();

                if (data.pagination) {
                    // Con paginación
                    const sortedDoctors = data.data.sort((a, b) => {
                        const lastNameA = (a.lastname || '').toLowerCase();
                        const lastNameB = (b.lastname || '').toLowerCase();
                        return lastNameA.localeCompare(lastNameB);
                    });
                    this.displayDoctors(sortedDoctors, filter, data.pagination);
                } else {
                    // Sin paginación
                    const sortedDoctors = data.data.sort((a, b) => {
                        const lastNameA = (a.lastname || '').toLowerCase();
                        const lastNameB = (b.lastname || '').toLowerCase();
                        return lastNameA.localeCompare(lastNameB);
                    });
                    this.displayDoctors(sortedDoctors, filter);
                }
            } else {
                this.showMessage('Error al cargar los doctores', 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    displayDoctors(doctors, filter = 'all', pagination = null) {

        const usersContent = document.getElementById('users-content');
        if (!usersContent) {
            return;
        }

        if (!doctors || doctors.length === 0) {
            let message = 'No hay doctores registrados en el sistema.';
            if (filter === 'active') message = 'No hay doctores activos en el sistema.';
            if (filter === 'inactive') message = 'No hay doctores inactivos en el sistema.';

            usersContent.innerHTML = `<p>${message}</p>`;
            return;
        }

        let filterText = 'Todos los Doctores';
        if (filter === 'active') filterText = 'Doctores Activos';
        if (filter === 'inactive') filterText = 'Doctores Inactivos';

        let doctorsHTML = `<h3>${filterText}</h3>`;

        // Agregar controles de paginación básica para todos los filtros
        if (pagination && pagination.totalPages > 1) {
            doctorsHTML += this.createPaginationControls(pagination, 'doctors');
        }

        doctorsHTML += '<div class="doctors-list">';

        doctors.forEach(doctor => {
            let actionButton = '';
            if (filter === 'active') {
                actionButton = `<button onclick="adminDashboard.deactivateDoctor('${doctor._id}')" class="deactivate-btn">Desactivar</button>`;
            } else if (filter === 'inactive') {
                actionButton = `
                        <button onclick="adminDashboard.activateDoctor('${doctor._id}')" class="activate-btn">Activar</button>
                        <button onclick="adminDashboard.deleteDoctor('${doctor._id}')" class="delete-btn">Delete Doctor</button>
                    `;
            }

            doctorsHTML += `
                    <div class="doctor-card">
                        <div class="doctor-header">
                            <h4>${doctor.name} ${doctor.lastname}</h4>
                            <div class="doctor-actions">
                                <button onclick="adminDashboard.viewDoctorProfile('${doctor._id}')" class="view-btn">Ver Perfil</button>
                                ${actionButton}
                            </div>
                        </div>
                        <p><strong>Email:</strong> ${doctor.email}</p>
                    </div>
                `;
        });

        doctorsHTML += '</div>';
        usersContent.innerHTML = doctorsHTML;
    }

    async loadPatients(filter = 'all', page = 1, limit = 5) {
        try {
            // Guardar el filtro actual para la paginación
            this.currentPatientsFilter = filter;

            let url = `${this.baseURL}/users/patients`;
            if (filter === 'active') {
                url = `${this.baseURL}/users/active-patients`;
            } else if (filter === 'inactive') {
                url = `${this.baseURL}/users/inactive-patients`;
            }

            // Agregar paginación para todos los filtros
            url += `?page=${page}&limit=${limit}`;

            const response = await fetch(url, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();

                if (data.pagination) {
                    // Con paginación
                    const sortedPatients = data.data.sort((a, b) => {
                        const lastNameA = (a.lastname || '').toLowerCase();
                        const lastNameB = (b.lastname || '').toLowerCase();
                        return lastNameA.localeCompare(lastNameB);
                    });
                    this.displayPatients(sortedPatients, filter, data.pagination);
                } else {
                    // Sin paginación
                    const sortedPatients = data.data.sort((a, b) => {
                        const lastNameA = (a.lastname || '').toLowerCase();
                        const lastNameB = (b.lastname || '').toLowerCase();
                        return lastNameA.localeCompare(lastNameB);
                    });

                    this.displayPatients(sortedPatients, filter);
                }
            } else {
                this.showMessage('Error al cargar los pacientes', 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    displayPatients(patients, filter = 'all', pagination = null) {

        const usersContent = document.getElementById('users-content');
        if (!usersContent) {
            return;
        }

        if (!patients || patients.length === 0) {
            let message = 'No hay pacientes registrados en el sistema.';
            if (filter === 'active') message = 'No hay pacientes activos en el sistema.';
            if (filter === 'inactive') message = 'No hay pacientes inactivos en el sistema.';
            usersContent.innerHTML = `<p>${message}</p>`;
            return;
        }

        let filterText = 'Todos los Pacientes';
        if (filter === 'active') filterText = 'Pacientes Activos';
        if (filter === 'inactive') filterText = 'Pacientes Inactivos';

        let patientsHTML = `<h3>${filterText}</h3>`;

        // Agregar controles de paginación básica solo si hay múltiples páginas
        if (pagination && pagination.totalPages > 1) {
            patientsHTML += this.createPaginationControls(pagination, 'patients');
        }

        patientsHTML += '<div class="patients-list">';

        patients.forEach(patient => {
            let actionButton = '';
            if (filter === 'active') {
                actionButton = `<button onclick="adminDashboard.deactivatePatient('${patient._id}')" class="deactivate-btn">Desactivar</button>`;
            } else if (filter === 'inactive') {
                actionButton = `
                    <button onclick="adminDashboard.activatePatient('${patient._id}')" class="activate-btn">Activar</button>
                    <button onclick="adminDashboard.deletePatient('${patient._id}')" class="delete-btn">Delete Patient</button>
                `;
            }

            patientsHTML += `
                <div class="patient-card">
                    <div class="patient-header">
                        <h4>${patient.name} ${patient.lastname}</h4>
                        <div class="patient-actions">
                            <button onclick="adminDashboard.viewPatientProfile('${patient._id}')" class="view-btn">Ver Perfil</button>
                            ${actionButton}
                        </div>
                    </div>
                    <p><strong>Email:</strong> ${patient.email}</p>
                </div>
            `;
        });

        patientsHTML += '</div>';
        usersContent.innerHTML = patientsHTML;
    }

    async loadAdmins(page = 1, limit = 5) {
        try {

            const url = `${this.baseURL}/admin/admins?page=${page}&limit=${limit}`;

            const response = await fetch(url, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();

                if (data.pagination) {
                }

                this.displayAdmins(data.data, data.pagination);
            } else {
                const errorData = await response.json();
                this.showMessage(`Error al cargar administradores: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    displayAdmins(admins, pagination = null) {

        const usersContent = document.getElementById('users-content');
        if (!usersContent) {
            return;
        }

        if (!admins || admins.length === 0) {
            usersContent.innerHTML = `<p>No hay administradores registrados en el sistema.</p>`;
            return;
        }

        let adminsHTML = '<h3>Administradores del Sistema</h3>';

        // Agregar controles de paginación si está disponible
        if (pagination && pagination.totalPages > 1) {
            adminsHTML += this.createPaginationControls(pagination, 'admins');
        }

        adminsHTML += '<div class="admins-list">';

        admins.forEach(admin => {
            adminsHTML += `
                <div class="admin-card">
                    <div class="admin-header">
                        <h4>${admin.name} ${admin.lastname}</h4>
                        <div class="admin-actions">
                            <button onclick="adminDashboard.viewAdminProfile('${admin._id}')" class="view-btn">Ver Perfil</button>
                        </div>
                    </div>
                    <p><strong>Email:</strong> ${admin.email}</p>
                    <p><strong>Estado:</strong> ${admin.isActive ? 'Activo' : 'Inactivo'}</p>
                </div>
            `;
        });

        adminsHTML += '</div>';
        usersContent.innerHTML = adminsHTML;
    }

    async loadSystemStats() {
        try {

            // Cargar estadísticas de usuarios
            const [doctorsResponse, patientsResponse, adminsResponse, appointmentsResponse] = await Promise.all([
                fetch(`${this.baseURL}/users/doctors`, { credentials: 'include' }),
                fetch(`${this.baseURL}/users/patients`, { credentials: 'include' }),
                fetch(`${this.baseURL}/admin/admins`, { credentials: 'include' }),
                // Para estadísticas, traer todas las citas sin paginación
                fetch(`${this.baseURL}/appointments?limit=1000`, { credentials: 'include' })
            ]);


            let stats = {
                doctors: { total: 0, active: 0, inactive: 0 },
                patients: { total: 0, active: 0, inactive: 0 },
                admins: { total: 0 },
                appointments: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
            };

            // Procesar doctores
            if (doctorsResponse.ok) {
                const doctorsData = await doctorsResponse.json();
                stats.doctors.total = doctorsData.data.length;
                stats.doctors.active = doctorsData.data.filter(d => d.isActive).length;
                stats.doctors.inactive = doctorsData.data.filter(d => !d.isActive).length;
            }
            // Procesar pacientes
            if (patientsResponse.ok) {
                const patientsData = await patientsResponse.json();
                stats.patients.total = patientsData.data.length;
                stats.patients.active = patientsData.data.filter(p => p.isActive).length;
                stats.patients.inactive = patientsData.data.filter(p => !p.isActive).length;
            }

            // Procesar administradores
            if (adminsResponse.ok) {
                const adminsData = await adminsResponse.json();
                stats.admins.total = adminsData.data.length;
            }

            // Procesar citas
            if (appointmentsResponse.ok) {
                const appointmentsData = await appointmentsResponse.json();

                // La respuesta tiene estructura: { success: true, data: [...], pagination: {...} }
                const appointments = appointmentsData.data || [];

                if (appointments && appointments.length > 0) {
                    stats.appointments.total = appointments.length;

                    // Contar por estado con más detalle
                    const pendingCount = appointments.filter(a => a.status === 'pending').length;
                    const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
                    const completedCount = appointments.filter(a => a.status === 'completed').length;
                    const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;

                    stats.appointments.pending = pendingCount;
                    stats.appointments.confirmed = confirmedCount;
                    stats.appointments.completed = completedCount;
                    stats.appointments.cancelled = cancelledCount;


                } else {
                    stats.appointments.total = 0;
                    stats.appointments.pending = 0;
                    stats.appointments.confirmed = 0;
                    stats.appointments.completed = 0;
                    stats.appointments.cancelled = 0;
                }
            }
            this.displaySystemStats(stats);
        } catch (error) {
            this.showMessage('Error al cargar las estadísticas', 'error');
        }
    }

    async loadAllAppointments(page = 1, limit = 5) {
        try {
            // Guardar la página actual
            this.currentAppointmentsPage = page;

            const url = `${this.baseURL}/appointments?page=${page}&limit=${limit}`;

            const response = await fetch(url, {
                credentials: 'include'
            });


            if (response.ok) {
                const data = await response.json();

                // La respuesta tiene estructura: { success: true, data: [...], pagination: {...} }
                const appointments = data.data || [];

                if (appointments && appointments.length > 0) {
                    if (data.pagination) {
                        // Con paginación
                        const sortedAppointments = appointments.sort((a, b) => {
                            return new Date(b.date) - new Date(a.date);
                        });
                        this.displayAppointments(sortedAppointments, data.pagination);
                    } else {
                        // Sin paginación (compatibilidad)
                        const sortedAppointments = appointments.sort((a, b) => {
                            return new Date(b.date) - new Date(a.date);
                        });
                        this.displayAppointments(sortedAppointments);
                    }
                } else {
                    this.displayAppointments([], data.pagination);
                }
            } else {
                const errorData = await response.json();
                this.showMessage(`Error al cargar las citas: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    displaySystemStats(stats) {

        const statsContent = document.getElementById('stats-content');
        if (!statsContent) {
            return;
        }

        const statsHTML = `
                <div class="stats-grid">
                    <div class="stats-section">
                        <h3>Usuarios</h3>
                        <div class="stat-item">
                            <span class="stat-label">Total Doctores:</span>
                            <span class="stat-value">${stats.doctors.total}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Doctores Activos:</span>
                            <span class="stat-value">${stats.doctors.active}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Pacientes:</span>
                            <span class="stat-value">${stats.patients.total}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Pacientes Activos:</span>
                            <span class="stat-value">${stats.patients.active}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Administradores:</span>
                            <span class="stat-value">${stats.admins.total}</span>
                        </div>
                    </div>
                    
                    <div class="stats-section">
                        <h3>Citas</h3>
                        <div class="stat-item">
                            <span class="stat-label">Total Citas:</span>
                            <span class="stat-value">${stats.appointments.total}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Pendientes:</span>
                            <span class="stat-value">${stats.appointments.pending}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Confirmadas:</span>
                            <span class="stat-value">${stats.appointments.confirmed}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Completadas:</span>
                            <span class="stat-value">${stats.appointments.completed}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Canceladas:</span>
                            <span class="stat-value">${stats.appointments.cancelled}</span>
                        </div>
                    </div>
                </div>
            `;
        statsContent.innerHTML = statsHTML;
    }

    displayAppointments(appointments, pagination = null) {

        const appointmentsContainer = document.getElementById('appointments-content');
        if (!appointmentsContainer) {
            return;
        }

        if (!appointments || appointments.length === 0) {
            appointmentsContainer.innerHTML = '<p>No hay citas para mostrar</p>';
            return;
        }

        const appointmentsHTML = appointments.map(appointment => {
            // Determinar el estado del doctor y aplicar estilos
            let doctorStatus = 'normal';
            let doctorMessage = '';
            let doctorActions = '';

            if (!appointment.doctor) {
                // Doctor eliminado de la base de datos
                doctorStatus = 'deleted';
                doctorMessage = 'Doctor eliminado del sistema';
                doctorActions = `
                    <div class="doctor-actions">
                        <button class="btn-secondary" onclick="adminDashboard.assignDoctor('${appointment._id}')">Asignar Doctor</button>
                        ${appointment.status !== 'cancelled' ? `<button class="btn-danger" onclick="adminDashboard.cancelAppointment('${appointment._id}')">Cancelar Cita</button>` : ''}
                    </div>
                `;
            } else if (!appointment.doctor.isActive && (appointment.status === 'pending' || appointment.status === 'confirmed')) {
                // Doctor inactivo
                doctorStatus = 'inactive';
                doctorMessage = 'Doctor inactivo';
                doctorActions = `
                    <div class="doctor-actions">
                        <button class="btn-secondary" onclick="adminDashboard.activateDoctor('${appointment.doctor._id}')">Activar Doctor</button>
                        <button class="btn-secondary" onclick="adminDashboard.assignDoctor('${appointment._id}')">Asignar uno nuevo</button>
                        ${appointment.status !== 'cancelled' ? `<button class="btn-danger" onclick="adminDashboard.cancelAppointment('${appointment._id}')">Cancelar Cita</button>` : ''}
                    </div>
                `;
            }


            // Determinar el estado del paciente y aplicar estilos
            let patientStatus = 'normal';
            let patientMessage = '';
            let patientActions = '';

            if (!appointment.patient) {
                // Paciente eliminado de la base de datos
                patientStatus = 'deleted';
                patientMessage = 'Paciente eliminado del sistema';
                patientActions = `
                        <div class="patient-actions">
                            <button class="btn-secondary" onclick="adminDashboard.assignPatient('${appointment._id}')">Asignar Paciente</button>
                            ${appointment.status !== 'cancelled' ? `<button class="btn-danger" onclick="adminDashboard.cancelAppointment('${appointment._id}')">Cancelar Cita</button>` : ''}
                        </div>
                    `;
            } else if (!appointment.patient.isActive && (appointment.status === 'pending' || appointment.status === 'confirmed')) {
                // Paciente inactivo
                patientStatus = 'inactive';
                patientMessage = 'Paciente inactivo';
                patientActions = `
                        <div class="patient-actions">
                            <button class="btn-secondary" onclick="adminDashboard.activatePatient('${appointment.patient._id}')">Activar Paciente</button>
                            <button class="btn-secondary" onclick="adminDashboard.assignPatient('${appointment._id}')">Asignar uno nuevo</button>
                            ${appointment.status !== 'cancelled' ? `<button class="btn-danger" onclick="adminDashboard.cancelAppointment('${appointment._id}')">Cancelar Cita</button>` : ''}
                        </div>
                    `;
            }

            // Botón de cancelar solo para citas pending y confirmed
            let cancelButton = '';
            if (appointment.status === 'pending' || appointment.status === 'confirmed') {
                cancelButton = `<button class="btn-danger" onclick="adminDashboard.cancelAppointment('${appointment._id}')">Cancelar Cita</button>`;
            }

            // Información de última modificación
            const lastModified = this.formatDateTime(appointment.updatedAt, true);

            // Determinar la clase CSS para la tarjeta
            let cardClass = 'appointment-card';
            if (doctorStatus !== 'normal') cardClass += ` doctor-${doctorStatus}`;
            if (patientStatus !== 'normal') cardClass += ` patient-${patientStatus}`;

            return `
                <div class="${cardClass}">
                        <div class="appointment-header">
                        <h4>Cita con ${appointment.doctor?.name || 'Doctor'} ${appointment.doctor?.lastname || ''}</h4>
                        <span class="status-badge ${appointment.status}">${this.getStatusText(appointment.status)}</span>
                        </div>
                    <div class="appointment-info">
                        <p><strong>Paciente:</strong> ${appointment.patient?.name || 'N/A'} ${appointment.patient?.lastname || ''}</p>
                        <p><strong>Fecha:</strong> ${this.formatDateTime(appointment.date, false)}</p>
                        <p><strong>Hora:</strong> ${new Date(appointment.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires' })}</p>
                        <p><strong>Estado:</strong> ${this.getStatusText(appointment.status)}</p>
                        <p><strong>Última Modificación:</strong> ${lastModified}</p>
                        ${doctorMessage ? `<p class="doctor-status ${doctorStatus}">${doctorMessage}</p>` : ''}
                        ${patientMessage ? `<p class="patient-status ${patientStatus}">${patientMessage}</p>` : ''}
                        </div>
                    <div class="appointment-actions">
                        ${doctorActions}
                        ${patientActions}
                        </div>
                    </div>
                `;
        }).join('');

        // Agregar paginación si está disponible
        let paginationHTML = '';
        if (pagination && pagination.totalPages > 1) {
            paginationHTML = this.createPaginationControls(pagination, 'appointments');
        }

        appointmentsContainer.innerHTML = appointmentsHTML + paginationHTML;
    }

    getStatusText(status) {

        const statusMap = {
            'pending': 'Pendiente',
            'confirmed': 'Confirmada',
            'completed': 'Completada',
            'cancelled': 'Cancelada'
        };

        const statusText = statusMap[status] || 'Desconocido';

        return statusText;
    }

    // Helper para formatear fechas de manera consistente
    formatDateTime(date, includeTime = true) {
        if (!date) return 'No disponible';

        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return 'Error de formato';

            const dateStr = dateObj.toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                timeZone: 'America/Argentina/Buenos_Aires'
            });

            if (!includeTime) return dateStr;

            const timeStr = dateObj.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Argentina/Buenos_Aires'
            });

            return `${dateStr} ${timeStr}`;
        } catch (error) {
            return 'Error de formato';
        }
    }

    async filterAppointmentsByStatus(status) {
        try {

            if (!status) {
                this.loadAllAppointments();
                return;
            }

            // Usar la ruta correcta para filtrar por estado
            const url = `${this.baseURL}/appointments/status?status=${status}`;

            const response = await fetch(url, {
                credentials: 'include'
            });


            if (response.ok) {
                const data = await response.json();

                // La respuesta tiene estructura: { success: true, data: [...], pagination: {...} }
                const appointments = data.data || [];

                if (data.pagination) {
                }

                this.displayAppointments(appointments, data.pagination);
            } else {
                const errorData = await response.json();
                this.showMessage(`Error al filtrar las citas por estado: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión al filtrar', 'error');
        }
    }

    async activateDoctor(doctorId) {
        try {

            const response = await fetch(`${this.baseURL}/admin/doctors/${doctorId}/activate`, {
                method: 'PUT',
                credentials: 'include'
            });


            if (response.ok) {
                this.showMessage('Doctor activado exitosamente', 'success');

                // Cerrar el modal automáticamente
                this.closePatientModal();

                this.loadDoctors('inactive');

                // También recargar las citas para actualizar el estado del doctor
                // Forzar recarga completa para obtener datos actualizados
                setTimeout(() => {
                    this.loadAllAppointments(this.currentAppointmentsPage || 1);
                }, 500);
            } else {
                const errorData = await response.json();
                this.showMessage(`Error al activar doctor: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    async deactivateDoctor(doctorId) {
        try {

            const response = await fetch(`${this.baseURL}/admin/doctors/${doctorId}/deactivate`, {
                method: 'PUT',
                credentials: 'include'
            });

            if (response.ok) {
                this.showMessage('Doctor desactivado exitosamente', 'success');

                // Cerrar el modal automáticamente
                this.closePatientModal();

                this.loadDoctors('active');

                // También recargar las citas para actualizar el estado del doctor
                // Forzar recarga completa para obtener datos actualizados
                setTimeout(() => {
                    this.loadAllAppointments(this.currentAppointmentsPage || 1);
                }, 500);
            } else {
                const errorData = await response.json();
                this.showMessage(`Error al desactivar doctor: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    async activatePatient(patientId) {
        try {

            const response = await fetch(`${this.baseURL}/admin/patients/${patientId}/activate`, {
                method: 'PUT',
                credentials: 'include'
            });


            if (response.ok) {
                this.showMessage('Paciente activado exitosamente', 'success');

                // Cerrar el modal automáticamente
                this.closePatientModal();

                // Recargar la lista de pacientes inactivos
                this.loadPatients('inactive');

                // También recargar las citas para actualizar el estado del paciente
                // Forzar recarga completa para obtener datos actualizados
                setTimeout(() => {
                    this.loadAllAppointments(this.currentAppointmentsPage || 1);
                }, 500);
            } else {
                const errorData = await response.json();
                this.showMessage(`Error al activar paciente: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    async deactivatePatient(patientId) {
        try {

            const response = await fetch(`${this.baseURL}/admin/patients/${patientId}/deactivate`, {
                method: 'PUT',
                credentials: 'include'
            });


            if (response.ok) {
                this.showMessage('Paciente desactivado exitosamente', 'success');

                // Cerrar el modal automáticamente
                this.closePatientModal();

                // Recargar la lista de pacientes activos
                this.loadPatients('active');

                // También recargar las citas para actualizar el estado del paciente
                // Forzar recarga completa para obtener datos actualizados
                setTimeout(() => {
                    this.loadAllAppointments(this.currentAppointmentsPage || 1);
                }, 500);
            } else {
                const errorData = await response.json();
                this.showMessage(`Error al desactivar paciente: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    async deleteDoctor(doctorId) {
        // Mostrar modal de confirmación
        this.showDeleteModal('doctor', doctorId, '¿Estás seguro de que quieres eliminar completamente este doctor? Esta acción no se puede deshacer.');
    }

    async deletePatient(patientId) {
        // Mostrar modal de confirmación
        this.showDeleteModal('patient', patientId, '¿Estás seguro de que quieres eliminar completamente este paciente? Esta acción no se puede deshacer.');
    }

    async viewPatientProfile(patientId) {
        try {

            const response = await fetch(`${this.baseURL}/users/patients/${patientId}`, {
                credentials: 'include'
            });


            if (response.ok) {
                const data = await response.json();
                this.displayPatientProfile(data.data);
            } else {
                const errorData = await response.json();
                this.showMessage(`Error al obtener perfil: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    async viewDoctorProfile(doctorId) {
        try {

            const response = await fetch(`${this.baseURL}/users/doctors/${doctorId}`, {
                credentials: 'include'
            });


            if (response.ok) {
                const data = await response.json();
                this.displayDoctorProfile(data.data);
            } else {
                const errorData = await response.json();
                this.showMessage(`Error al obtener perfil: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    displayPatientProfile(patient) {

        // Usar el modal que ya existe
        const modal = document.getElementById('patient-detail-modal');
        if (!modal) {
            return;
        }

        const modalContent = modal.querySelector('#patient-detail-content');
        if (!modalContent) {
            return;
        }

        const profileHTML = `
                        <p><strong>Nombre:</strong> ${patient.name} ${patient.lastname}</p>
                        <p><strong>Email:</strong> ${patient.email}</p>
            <p><strong>DNI:</strong> ${patient.personalId || 'No especificado'}</p>
                        <p><strong>Teléfono:</strong> ${patient.phone || 'No especificado'}</p>
                        <p><strong>Estado:</strong> ${patient.isActive ? 'Activo' : 'Inactivo'}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' }) : 'No especificada'}</p>
                        <p><strong>Fecha de Registro:</strong> ${patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }) : 'No especificada'}</p>
                        <div class="profile-actions">
                            ${patient.isActive ?
                `<button onclick="adminDashboard.deactivatePatient('${patient._id}')" class="btn btn-warning">Desactivar Paciente</button>` :
                `<button onclick="adminDashboard.activatePatient('${patient._id}')" class="btn btn-success">Activar Paciente</button>`
            }
                </div>
            `;

        modalContent.innerHTML = profileHTML;
        modal.style.display = 'flex';
    }

    displayDoctorProfile(doctor) {

        // Usar el modal que ya existe
        const modal = document.getElementById('patient-detail-modal');
        if (!modal) {
            return;
        }

        const modalContent = modal.querySelector('#patient-detail-content');
        if (!modalContent) {
            return;
        }

        const profileHTML = `
                        <p><strong>Nombre:</strong> ${doctor.name} ${doctor.lastname}</p>
                        <p><strong>Email:</strong> ${doctor.email}</p>
                        <p><strong>Especialidades:</strong> ${doctor.specialties ? doctor.specialties.join(', ') : 'No especificadas'}</p>
            <p><strong>Matrícula:</strong> ${doctor.license || 'No especificada'}</p>
                        <p><strong>Estado:</strong> ${doctor.isActive ? 'Activo' : 'Inactivo'}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${doctor.dateOfBirth ? new Date(doctor.dateOfBirth).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' }) : 'No especificada'}</p>
                        <p><strong>Fecha de Registro:</strong> ${doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }) : 'No especificada'}</p>
                        <div class="profile-actions">
                            ${doctor.isActive ?
                `<button onclick="adminDashboard.deactivateDoctor('${doctor._id}')" class="btn btn-warning">Desactivar Doctor</button>` :
                `<button onclick="adminDashboard.activateDoctor('${doctor._id}')" class="btn btn-success">Activar Doctor</button>`
            }
                </div>
            `;

        modalContent.innerHTML = profileHTML;
        modal.style.display = 'flex';
    }

    displayAdminProfile(admin) {

        const modal = document.getElementById('profile-modal');
        if (!modal) {
            return;
        }

        const modalContent = modal.querySelector('.modal-content');
        if (!modalContent) {
            return;
        }

        const profileHTML = `
            <div class="modal-header">
                <h3>Perfil del Administrador</h3>
                <button class="modal-close" onclick="adminDashboard.hideProfileModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="profile-info">
                    <p><strong>Nombre:</strong> ${admin.name} ${admin.lastname}</p>
                    <p><strong>Email:</strong> ${admin.email}</p>
                    <p><strong>Estado:</strong> ${admin.isActive ? 'Activo' : 'Inactivo'}</p>
                    <p><strong>Fecha de Nacimiento:</strong> ${admin.dateOfBirth ? new Date(admin.dateOfBirth).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' }) : 'No especificada'}</p>
                    <p><strong>Fecha de Registro:</strong> ${admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }) : 'No especificada'}</p>
                    </div>
                </div>
            `;

        modalContent.innerHTML = profileHTML;
        modal.style.display = 'flex';
    }

    closePatientModal() {
        const modal = document.getElementById('patient-detail-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showMessage(message, type) {

        const messageContainer = document.getElementById('message-container');
        if (!messageContainer) {
            return;
        }

        messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 3000);

    }

    hideMessage() {
        const messageContainer = document.getElementById('message-container');
        if (messageContainer) {
            messageContainer.innerHTML = '';
        }
    }

    // Variables para el modal de eliminación
    deleteType = null;
    deleteId = null;

    // Variables para mantener el estado de paginación
    currentAppointmentsPage = 1;
    currentPatientsFilter = 'all';
    currentDoctorsFilter = 'all';

    showDeleteModal(type, id, message) {

        this.deleteType = type;
        this.deleteId = id;

        const modal = document.getElementById('delete-confirmation-modal');
        if (!modal) {
            return;
        }

        const modalContent = modal.querySelector('.modal-content');
        if (!modalContent) {
            return;
        }

        modalContent.innerHTML = `
            <div class="modal-header">
                <h3>Confirmar Eliminación</h3>
                <button class="modal-close" onclick="adminDashboard.hideDeleteModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
                <div class="delete-actions">
                    <button class="cancel-delete-btn" onclick="adminDashboard.hideDeleteModal()">Cancelar</button>
                    <button class="confirm-delete-btn" onclick="adminDashboard.confirmDelete()">Eliminar</button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    }

    hideDeleteModal() {

        const modal = document.getElementById('delete-confirmation-modal');
        if (modal) {
            modal.style.display = 'none';
            this.deleteType = null;
            this.deleteId = null;
        }
    }

    hideProfileModal() {

        const modal = document.getElementById('profile-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    async confirmDelete() {
        if (!this.deleteId || !this.deleteType) {
            return;
        }

        try {

            let url = '';
            if (this.deleteType === 'doctor') {
                url = `${this.baseURL}/admin/doctors/${this.deleteId}`;
            } else if (this.deleteType === 'patient') {
                url = `${this.baseURL}/admin/patients/${this.deleteId}`;
            } else if (this.deleteType === 'admin') {
                url = `${this.baseURL}/admin/admins/${this.deleteId}`;
            } else if (this.deleteType === 'appointment') {
                url = `${this.baseURL}/appointments/${this.deleteId}`;
            }


            const response = await fetch(url, {
                method: 'DELETE',
                credentials: 'include'
            });


            if (response.ok) {
                const message = this.deleteType === 'doctor' ? 'Doctor eliminado exitosamente' :
                    this.deleteType === 'patient' ? 'Paciente eliminado exitosamente' :
                        this.deleteType === 'admin' ? 'Administrador eliminado exitosamente' :
                            'Cita cancelada exitosamente';
                this.showMessage(message, 'success');

                // Recargar la lista correspondiente
                if (this.deleteType === 'doctor') {
                    this.loadDoctors('inactive');
                } else if (this.deleteType === 'patient') {
                    this.loadPatients('inactive');
                } else if (this.deleteType === 'admin') {
                    this.loadAdmins();
                } else if (this.deleteType === 'appointment') {
                    this.loadAllAppointments();
                }
            } else {
                const errorData = await response.json();
                this.showMessage(`Error al eliminar: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        } finally {
            this.hideDeleteModal();
        }
    }

    // Función para crear controles de paginación básica (consistente con otros dashboards)
    createPaginationControls(pagination, type) {
        const { currentPage, totalPages, total, limit } = pagination;

        if (totalPages <= 1) return '';

        let paginationHTML = '<div class="pagination-controls">';
        // Mapear el tipo a un nombre legible
        const typeNames = {
            'doctors': 'doctores',
            'patients': 'pacientes',
            'admins': 'administradores',
            'appointments': 'citas'
        };
        const typeName = typeNames[type] || type || 'elementos';

        paginationHTML += `<div class="pagination-info">Página ${currentPage} de ${totalPages} (${total} ${typeName})</div>`;
        paginationHTML += '<div class="pagination-buttons">';

        // Solo botones Anterior/Siguiente (paginación básica)
        if (currentPage > 1) {
            paginationHTML += `<button onclick="adminDashboard.changePage('${type}', ${currentPage - 1}, ${limit})" class="btn btn-secondary">← Anterior</button>`;
        }

        if (currentPage < totalPages) {
            paginationHTML += `<button onclick="adminDashboard.changePage('${type}', ${currentPage + 1}, ${limit})" class="btn btn-primary">Siguiente →</button>`;
        }

        paginationHTML += '</div></div>';
        return paginationHTML;
    }

    // Función para crear controles básicos sin paginación del backend (eliminar esta función)
    createBasicPaginationControls(type) {
        // Esta función ya no es necesaria con la paginación unificada
        return '';
    }

    // Función para cambiar de página
    changePage(type, page, limit) {

        // Hacer scroll al inicio de la lista
        const mainContent = document.querySelector('.dashboard-main');
        if (mainContent) {
            mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        switch (type) {
            case 'doctors':
                this.loadDoctors(this.currentDoctorsFilter || 'all', page, limit);
                break;
            case 'patients':
                this.loadPatients(this.currentPatientsFilter || 'all', page, limit);
                break;
            case 'admins':
                this.loadAdmins(page, limit);
                break;
            case 'appointments':
                this.loadAllAppointments(page, limit);
                break;
            default:
        }
    }

    // Función para ver perfil de administrador
    async viewAdminProfile(adminId) {
        try {

            // Usar el endpoint que existe para obtener todos los admins
            const response = await fetch(`${this.baseURL}/admin/admins`, {
                credentials: 'include'
            });


            if (response.ok) {
                const data = await response.json();

                // Buscar el admin específico por ID
                const admin = data.data.find(a => a._id === adminId);
                if (admin) {
                    this.displayAdminProfile(admin);
                } else {
                    this.showMessage('Administrador no encontrado', 'error');
                }
            } else {
                const errorData = await response.json();
                this.showMessage(`Error al obtener perfil: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    // Función para mostrar perfil de administrador
    displayAdminProfile(admin) {

        const modal = document.getElementById('profile-modal');
        if (!modal) {
            return;
        }

        const modalContent = modal.querySelector('.modal-content');
        if (!modalContent) {
            return;
        }

        const profileHTML = `
                <div class="modal-header">
                    <h3>Perfil del Administrador</h3>
                <button class="modal-close" onclick="adminDashboard.hideProfileModal()">&times;</button>
                </div>
                <div class="modal-body">
                <div class="profile-info">
                        <p><strong>Nombre:</strong> ${admin.name} ${admin.lastname}</p>
                        <p><strong>Email:</strong> ${admin.email}</p>
                        <p><strong>Estado:</strong> ${admin.isActive ? 'Activo' : 'Inactivo'}</p>
                    <p><strong>Fecha de Nacimiento:</strong> ${admin.dateOfBirth ? new Date(admin.dateOfBirth).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' }) : 'No especificada'}</p>
                        <p><strong>Fecha de Registro:</strong> ${admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }) : 'No especificada'}</p>
                    </div>
                </div>
            `;

        modalContent.innerHTML = profileHTML;
        modal.style.display = 'flex';
    }

    async deleteAdmin(adminId) {
        // Mostrar modal de confirmación
        this.showDeleteModal('admin', adminId, '¿Estás seguro de que quieres eliminar completamente este administrador? Esta acción no se puede deshacer.');
    }

    // Función para asignar doctor a una cita
    async assignDoctor(appointmentId) {
        try {

            // Por ahora mostrar mensaje de funcionalidad en desarrollo
            this.showMessage('Funcionalidad de asignación de doctor en desarrollo', 'info');

            // TODO: Implementar modal para seleccionar doctor y asignar
            // 1. Mostrar modal con lista de doctores activos
            // 2. Seleccionar doctor
            // 3. Llamar API para actualizar la cita
            // 4. Recargar citas

        } catch (error) {
            this.showMessage('Error al asignar doctor', 'error');
        }
    }

    // Función para asignar paciente a una cita
    async assignPatient(appointmentId) {
        try {

            // Por ahora mostrar mensaje de funcionalidad en desarrollo
            this.showMessage('Funcionalidad de asignación de paciente en desarrollo', 'info');

            // TODO: Implementar modal para seleccionar paciente y asignar
            // 1. Mostrar modal con lista de pacientes activos
            // 2. Seleccionar paciente
            // 3. Llamar API para actualizar la cita
            // 4. Recargar citas

        } catch (error) {
            this.showMessage('Error al asignar paciente', 'error');
        }
    }

    // Función para cancelar cita
    async cancelAppointment(appointmentId) {
        try {

            // Llamar directamente al backend para cancelar la cita
            const response = await fetch(`${this.baseURL}/appointments/${appointmentId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'cancelled' }),
                credentials: 'include'
            });

            if (response.ok) {
                this.showMessage('Cita cancelada exitosamente', 'success');
                // Recargar citas en la página actual
                const currentPage = this.currentAppointmentsPage || 1;
                this.loadAllAppointments(currentPage);
            } else {
                const errorData = await response.json();
                this.showMessage(`Error al cancelar cita: ${errorData.error || 'Error desconocido'}`, 'error');
            }

        } catch (error) {
            this.showMessage('Error al cancelar cita', 'error');
        }
    }
}

// Inicializar dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});
