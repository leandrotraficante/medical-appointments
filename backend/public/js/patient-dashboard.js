// Dashboard del Paciente
class PatientDashboard {
    constructor() {
        this.baseURL = '/api';
        this.currentDoctor = null; // Para mantener referencia al doctor seleccionado
        this.currentUserId = null; // Para mantener referencia al ID del usuario actual
        this.isViewingAppointments = false; // Flag para controlar si estamos viendo citas
        this.currentAppointmentsFilter = 'all'; // Filtro actual de citas
        this.previousView = null; // Para recordar la vista anterior
        this.init();
    }

    async init() {
        await this.loadProfile();
        await this.loadAppointments();
    }

    async loadProfile() {
        try {
            const response = await fetch(`${this.baseURL}/users/my-profile`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                this.displayProfile(data.data);
                
                            // Extraer el ID del usuario del perfil
            
            // El ID puede estar en diferentes campos según la API
            if (data.data._id) {
                this.currentUserId = data.data._id;
            } else if (data.data.id) {
                this.currentUserId = data.data.id;
            } else {
                console.error('No se encontró ID en el perfil:', data.data);
                this.showMessage('Error: Perfil incompleto', 'error');
            }
            } else {
                this.showMessage('Error al cargar el perfil', 'error');
            }
        } catch (error) {
            console.error('Error cargando perfil:', error);
            this.showMessage('Error de conexión', 'error');
        }
    }

    async loadAppointments(page = 1, limit = 5, filter = 'all') {
        try {            
            // Construir URL con filtros
            let url = `${this.baseURL}/appointments/my-appointments?page=${page}&limit=${limit}`;
            if (filter && filter !== 'all') {
                url += `&status=${filter}`;
            }
                        
            const response = await fetch(url, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                
                if (data.data && data.data.length > 0) {
                    // Ordenar citas por fecha de la cita (más cercana cronológicamente primero)
                    const sortedAppointments = data.data.sort((a, b) => {
                        // Usar la fecha de la cita, no la fecha de creación
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        
                        // Ordenar de más cercana a más lejana cronológicamente
                        return dateA - dateB;
                    });

                    this.displayAppointments(sortedAppointments, data.pagination, filter);
                } else {
                    this.displayAppointments([], null, filter);
                }
                this.isViewingAppointments = true; // Marcar que estamos viendo citas
            } else {
                const errorData = await response.json();
                console.error('❌ Error en response:', errorData);
                this.showMessage(`Error al cargar las citas: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            console.error('💥 Error cargando citas:', error);
            this.showMessage('Error de conexión', 'error');
        }
    }

    displayProfile(profile) {
        const profileContainer = document.getElementById('profile-data');
        if (profileContainer) {
            
            // Formatear fecha de nacimiento de manera segura
            let birthDateDisplay = 'No especificada';
            if (profile.dateOfBirth) {
                try {
                    const birthDate = new Date(profile.dateOfBirth);
                    if (!isNaN(birthDate.getTime())) {
                        birthDateDisplay = birthDate.toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric'});
                    }
                } catch (error) {
                    console.error('Error formateando fecha de nacimiento:', error);
                }
            }

            profileContainer.innerHTML = `
                <div>
                    <p><strong>Nombre:</strong> ${profile.name} ${profile.lastname}</p>
                    <p><strong>Email:</strong> ${profile.email}</p>
                    <p><strong>Teléfono:</strong> ${profile.phone || 'No especificado'}</p>
                    <p><strong>DNI:</strong> ${profile.personalId}</p>
                    <p><strong>Fecha de Nacimiento:</strong> ${birthDateDisplay}</p>
                </div>
            `;
        }
    }

    displayAppointments(appointments, pagination = null) {
        const appointmentsContainer = document.getElementById('appointments-list');
        if (appointmentsContainer) {
            if (appointments.length === 0) {
                appointmentsContainer.innerHTML = `
                    <div class="empty-state">
                        <h3>No tenés citas programadas</h3>
                        <p>¿Querés agendar tu primera cita médica?</p>
                        <div class="empty-state-actions">
                            <button onclick="patientDashboard.showView('doctor-search')" class="btn btn-primary">
                                Buscar Doctores
                            </button>
                            <button onclick="patientDashboard.showView('patient-info')" class="btn btn-secondary">
                                Ver Mi Perfil
                            </button>
                        </div>
                    </div>
                `;
                return;
            }

            // Agregar controles de filtro
            const filterControls = `
                <div class="appointments-filters">
                    
                    </div>
                </div>
            `;

            const appointmentsHTML = appointments.map(appointment => `
                <div class="appointment-card" onclick="patientDashboard.showAppointmentDetail('${appointment._id}')">
                    <div class="appointment-header">
                        <h4>${appointment.doctor.name} ${appointment.doctor.lastname}</h4>
                        <span class="status-badge ${appointment.status}">${appointment.status}</span>
                    </div>
                    <div class="appointment-info">
                        <p><strong>Fecha:</strong> ${new Date(appointment.date).toLocaleString()}</p>
                        <p><strong>Especialidades:</strong> ${appointment.doctor.specialties ? appointment.doctor.specialties.join(', ') : 'No especificadas'}</p>
                    </div>
                    <div class="appointment-actions">
                        <button onclick="event.stopPropagation(); patientDashboard.showAppointmentDetail('${appointment._id}')" class="detail-btn">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            `).join('');

            // Agregar controles de paginación básica si hay múltiples páginas
            let paginationHTML = '';
            if (pagination && pagination.totalPages > 1) {
                paginationHTML = this.createPaginationControls(pagination, 'appointments');
            }

            appointmentsContainer.innerHTML = filterControls + appointmentsHTML + paginationHTML;
        }
    }

    // ===== BÚSQUEDA DE DOCTORES =====
    
    async searchDoctors() {
        const searchTerm = document.getElementById('searchInput').value.trim();
        if (!searchTerm) {
            this.showMessage('Ingresá un término de búsqueda', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/users/search?q=${encodeURIComponent(searchTerm)}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                // Filtrar solo doctores activos
                const doctors = data.data.filter(user => user.type === 'doctor' && user.user?.isActive !== false);
                
                if (doctors.length === 0) {
                    this.showMessage(`No se encontraron doctores con "${searchTerm}". Probá con otro término de búsqueda.`, 'info');
                    document.getElementById('search-results').innerHTML = `
                        <p>No se encontraron doctores con tu búsqueda. Probá con otro término.</p>
                    `;
                } else {
                    // Ordenar doctores alfabéticamente por apellido
                    doctors.sort((a, b) => {
                        const lastNameA = (a.user?.lastname || a.lastname || '').toLowerCase();
                        const lastNameB = (b.user?.lastname || b.lastname || '').toLowerCase();
                        return lastNameA.localeCompare(lastNameB);
                    });
                    
                    this.showMessage(`Se encontraron ${doctors.length} doctor(es) con "${searchTerm}"`, 'success');
                    this.displayDoctorSearchResults(doctors);
                }
            } else {
                this.showMessage('Error en la búsqueda', 'error');
            }
        } catch (error) {
            console.error('Error buscando doctores:', error);
            this.showMessage('Error de conexión', 'error');
        }
    }

    async loadAllDoctors() {
        await this.loadDoctorsPage(1);
    }

    async loadDoctorsPage(page) {
        try {
            const response = await fetch(`${this.baseURL}/users/doctors?page=${page}&limit=5`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                
                // Filtrar solo doctores activos y ordenar alfabéticamente por apellido
                const activeDoctors = data.data.filter(doctor => doctor.isActive !== false);
                const sortedDoctors = activeDoctors.sort((a, b) => {
                    const lastNameA = (a.lastname || '').toLowerCase();
                    const lastNameB = (b.lastname || '').toLowerCase();
                    return lastNameA.localeCompare(lastNameB);
                });
                this.displayDoctorSearchResults(sortedDoctors, data.pagination);
            } else {
                this.showMessage('Error al cargar doctores', 'error');
            }
        } catch (error) {
            console.error('Error cargando doctores:', error);
            this.showMessage('Error de conexión', 'error');
        }
    }

    displayDoctorSearchResults(doctors, pagination = null) {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            if (doctors.length === 0) {
                resultsContainer.innerHTML = '<p>No se encontraron doctores</p>';
                return;
            }

            const doctorsHTML = doctors.map(doctor => {
                // La API de búsqueda devuelve { user: {...}, type: 'doctor' }
                const doctorData = doctor.user || doctor; // Fallback para compatibilidad
                
                return `
                    <div class="card doctor-card">
                        <div class="card-header">
                            <h3 class="card-title">Dr. ${doctorData.name || 'Sin nombre'} ${doctorData.lastname || 'Sin apellido'}</h3>
                            <span class="card-specialty">${doctorData.specialties ? doctorData.specialties.join(', ') : 'Sin especialidad'}</span>
                        </div>
                        <div class="card-content">
                            <div class="doctor-info">
                                <p><strong>Matrícula:</strong> ${doctorData.license || 'No especificada'}</p>
                                <p><strong>Email:</strong> ${doctorData.email || 'Sin email'}</p>
                            </div>
                        </div>
                        <div class="card-actions">
                            <button onclick="patientDashboard.showDoctorDetail('${doctorData._id}')" class="btn btn-primary">Ver Doctor</button>
                            <button onclick="patientDashboard.showSlots('${doctorData._id}')" class="btn btn-secondary">Ver Disponibilidad</button>
                        </div>
                    </div>
                `;
            }).join('');

            // Agregar controles de paginación si existen
            let paginationHTML = '';
     
            if (pagination && pagination.totalPages > 1) {
                paginationHTML = `
                    <div class="pagination-controls">
                        <div class="pagination-info">
                            <p>Página ${pagination.currentPage} de ${pagination.totalPages} (${pagination.total} doctores)</p>
                        </div>
                        <div class="pagination-buttons">
                            ${pagination.currentPage > 1 ? `<button onclick="patientDashboard.loadDoctorsPage(${pagination.currentPage - 1})" class="btn btn-secondary">← Anterior</button>` : ''}
                            ${pagination.currentPage < pagination.totalPages ? `<button onclick="patientDashboard.loadDoctorsPage(${pagination.currentPage + 1})" class="btn btn-primary">Siguiente →</button>` : ''}
                        </div>
                    </div>
                `;
            }
            // Agregar solo controles de paginación
            resultsContainer.innerHTML = doctorsHTML + paginationHTML;
        }
    }

    // ===== VISTAS INDIVIDUALES =====

    async showDoctorDetail(doctorId) {
        if (doctorId) {
            this.currentDoctor = doctorId;
        }

        if (!this.currentDoctor) {
            this.showMessage('No hay doctor seleccionado', 'error');
            return;
        }

        // Guardar la vista anterior para poder regresar
        this.previousView = 'doctor-search';
        console.log('💾 showDoctorDetail - Guardando vista anterior:', this.previousView);

        try {
            const response = await fetch(`${this.baseURL}/users/doctors/${this.currentDoctor}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                this.displayDoctorDetail(data.data);
                this.showView('doctor-detail-view');
            } else {
                this.showMessage('Error al cargar detalles del doctor', 'error');
            }
        } catch (error) {
            console.error('Error cargando detalles del doctor:', error);
            this.showMessage('Error de conexión', 'error');
        }
    }

    displayDoctorDetail(doctor) {
        const contentContainer = document.getElementById('doctor-detail-content');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="doctor-detail">
                    <h3>${doctor.name} ${doctor.lastname}</h3>
                    <p><strong>Especialidades:</strong> ${doctor.specialties ? doctor.specialties.join(', ') : 'No especificadas'}</p>
                    <p><strong>Matrícula:</strong> ${doctor.license || 'No especificada'}</p>
                    <p><strong>Email:</strong> ${doctor.email}</p>
                </div>
            `;
        }
    }

    async showSlots(doctorId) {
        if (doctorId) {
            this.currentDoctor = doctorId;
        }

        if (!this.currentDoctor) {
            this.showMessage('No hay doctor seleccionado', 'error');
            return;
        }

        // Guardar la vista anterior para poder regresar
        this.previousView = 'doctor-search';
        console.log('💾 showSlots - Guardando vista anterior:', this.previousView);

        // Mostrar formulario para seleccionar fecha
        const contentContainer = document.getElementById('slots-content');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="slots-form">
                    <h3>Seleccionar Fecha</h3>
                    <input type="date" id="slotDate" min="${new Date().toISOString().split('T')[0]}" onchange="patientDashboard.validateDate()">
                                            <button id="searchSlotsBtn" onclick="patientDashboard.loadAvailableSlots()" disabled class="btn btn-primary">Ver Disponibilidad</button>
                    <small>⚠️ Solo se permiten citas de Lunes a Viernes</small>
                    <div class="back-buttons">
                        <button onclick="patientDashboard.backToSearch()" class="back-btn">
                            ← Volver a Búsqueda
                        </button>
                    </div>
                </div>
                <div id="slots-list"></div>
            `;
        }

        this.showView('slots-view');
    }

    async loadAvailableSlots() {
        const date = document.getElementById('slotDate').value;
        if (!date) {
            this.showMessage('Seleccioná una fecha', 'error');
            return;
        }

        try {
            // Obtener slots disponibles
            const slotsResponse = await fetch(`${this.baseURL}/appointments/available-slots/${this.currentDoctor}?date=${date}`, {
                credentials: 'include'
            });

            if (slotsResponse.ok) {
                const slotsData = await slotsResponse.json();
                
                // Los slots ya vienen filtrados del backend, no necesitamos filtrar más
                this.displayAvailableSlots(slotsData.data, date);
            } else {
                this.showMessage('Error al cargar slots disponibles', 'error');
            }
        } catch (error) {
            console.error('Error cargando slots:', error);
            this.showMessage('Error de conexión', 'error');
        }
    }

    displayAvailableSlots(slots, date) {
        const slotsList = document.getElementById('slots-list');
        if (slotsList) {
            if (slots.length === 0) {
                slotsList.innerHTML = '<p>No hay slots disponibles para esta fecha</p>';
                return;
            }

            const slotsHTML = slots.map(slot => `
                <div class="slot-item">
                    <p><strong>Horario:</strong> ${slot.formatted}</p>
                    <button onclick="patientDashboard.selectSlot('${slot.time}')">Seleccionar</button>
                </div>
            `).join('');

            // Formatear la fecha de manera segura para evitar problemas de zona horaria
            const displayDate = new Date(date + 'T00:00:00'); // Forzar hora local
            const formattedDate = displayDate.toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            slotsList.innerHTML = `
                <h4>Slots disponibles para ${formattedDate}</h4>
                ${slotsHTML}
                <div class="back-buttons">
                    <button onclick="patientDashboard.backToSearch()" class="back-btn">
                        ← Volver a Búsqueda
                    </button>
                </div>
            `;
        }
    }

    selectSlot(slotTime) {
        // Guardar el slot seleccionado y mostrar formulario de cita
        this.selectedSlot = slotTime;
        
        // Extraer la hora del slot para preseleccionarla en el formulario
        const slotDate = new Date(slotTime);
        const hours = slotDate.getHours().toString().padStart(2, '0');
        const minutes = slotDate.getMinutes().toString().padStart(2, '0');
        this.selectedTime = `${hours}:${minutes}`;
        
        
        // Usar la fecha original del input, no la del slot (que puede tener problemas de zona horaria)
        const originalDateInput = document.getElementById('slotDate');
        if (originalDateInput && originalDateInput.value) {
            this.selectedDate = originalDateInput.value;
        } else {
            // Fallback: usar la fecha del slot pero con cuidado
            const year = slotDate.getFullYear();
            const month = (slotDate.getMonth() + 1).toString().padStart(2, '0');
            const day = slotDate.getDate().toString().padStart(2, '0');
            this.selectedDate = `${year}-${month}-${day}`;
        }
        
        this.showBookAppointment();
    }

    showBookAppointment(doctorId) {
        if (doctorId) {
            this.currentDoctor = doctorId;
        }

        if (!this.currentDoctor) {
            this.showMessage('No hay doctor seleccionado', 'error');
            return;
        }

        const contentContainer = document.getElementById('book-appointment-content');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="book-appointment-form">
                    <h3>Ver Disponibilidad</h3>
                    <p><strong>Doctor:</strong> <span id="selected-doctor-name">Cargando...</span></p>
                    <p><strong>Fecha y Hora:</strong> <span id="selected-slot-time">${this.selectedSlot ? new Date(this.selectedSlot).toLocaleString() : 'No seleccionado'}</span></p>
                    
                    <div class="form-group">
                        <label>Fecha:</label>
                        <input type="date" id="appointmentDate" min="${new Date().toISOString().split('T')[0]}" ${this.selectedDate ? `value="${this.selectedDate}"` : ''}>
                    </div>
                    
                    <div class="form-group">
                        <label>Hora:</label>
                        <select id="appointmentTime" required>
                                <option value="">Seleccionar hora</option>
                                <option value="09:00" ${this.selectedTime === '09:00' ? 'selected' : ''}>09:00</option>
                                <option value="09:30" ${this.selectedTime === '09:30' ? 'selected' : ''}>09:30</option>
                                <option value="10:00" ${this.selectedTime === '10:00' ? 'selected' : ''}>10:00</option>
                                <option value="10:30" ${this.selectedTime === '10:30' ? 'selected' : ''}>10:30</option>
                                <option value="11:00" ${this.selectedTime === '11:00' ? 'selected' : ''}>11:00</option>
                                <option value="11:30" ${this.selectedTime === '11:30' ? 'selected' : ''}>11:30</option>
                                <option value="12:00" ${this.selectedTime === '12:00' ? 'selected' : ''}>12:00</option>
                                <option value="12:30" ${this.selectedTime === '12:30' ? 'selected' : ''}>12:30</option>
                                <option value="13:00" ${this.selectedTime === '13:00' ? 'selected' : ''}>13:00</option>
                                <option value="13:30" ${this.selectedTime === '13:30' ? 'selected' : ''}>13:30</option>
                                <option value="14:00" ${this.selectedTime === '14:00' ? 'selected' : ''}>14:00</option>
                                <option value="14:30" ${this.selectedTime === '14:30' ? 'selected' : ''}>14:30</option>
                                <option value="15:00" ${this.selectedTime === '15:00' ? 'selected' : ''}>15:00</option>
                                <option value="15:30" ${this.selectedTime === '15:30' ? 'selected' : ''}>15:30</option>
                                <option value="16:00" ${this.selectedTime === '16:00' ? 'selected' : ''}>16:00</option>
                                <option value="16:30" ${this.selectedTime === '16:30' ? 'selected' : ''}>16:30</option>
                            </select>
                            <small>Horarios disponibles: 9:00 AM - 5:00 PM (cada 30 minutos)</small>
                        </div>
                    
                    <button onclick="patientDashboard.createAppointment()" class="confirm-appointment-btn">Confirmar Cita</button>
                </div>
            `;
        }

        this.showView('book-appointment-view');
        this.loadDoctorName();
    }

    async loadDoctorName() {
        try {
            const response = await fetch(`${this.baseURL}/users/doctors/${this.currentDoctor}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                const doctorNameElement = document.getElementById('selected-doctor-name');
                if (doctorNameElement) {
                    doctorNameElement.textContent = `${data.data.name} ${data.data.lastname}`;
                }
            }
        } catch (error) {
            console.error('Error cargando nombre del doctor:', error);
        }
    }

    async createAppointment() {
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;

        if (!date || !time) {
            this.showMessage('Completá fecha y hora', 'error');
            return;
        }

        // Validar que la fecha no sea en el pasado
        const selectedDateTime = new Date(`${date}T${time}`);
        const now = new Date();
        
        if (selectedDateTime <= now) {
            this.showMessage('La fecha y hora deben ser en el futuro', 'error');
            return;
        }

        // Validar que la hora esté en el rango permitido (9:00 AM - 5:00 PM)
        const hour = selectedDateTime.getHours();
        if (hour < 9 || hour >= 17) {
            this.showMessage('Los horarios disponibles son de 9:00 AM a 5:00 PM', 'error');
            return;
        }

        const dateTime = selectedDateTime.toISOString();

        try {
            // Obtener el ID del paciente desde el perfil
            const profileResponse = await fetch(`${this.baseURL}/users/my-profile`, {
                credentials: 'include'
            });
            
            if (!profileResponse.ok) {
                this.showMessage('Error al obtener perfil del paciente', 'error');
                return;
            }
            
            const profileData = await profileResponse.json();
            
            // El ID del paciente está en req.user.userId del middleware
            // Vamos a obtenerlo de otra manera
            const patientId = this.getCurrentUserId();
            
            if (!patientId) {
                this.showMessage('Error: No se pudo obtener el ID del paciente', 'error');
                return;
            }

            // Verificar que el slot no esté ocupado antes de crear la cita
            const response = await fetch(`${this.baseURL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patient: patientId,
                    doctor: this.currentDoctor,
                    date: dateTime
                }),
                credentials: 'include'
            });

            if (response.ok) {
                const successData = await response.json();
                this.showMessage('Cita creada exitosamente!', 'success');
                
                // Esperar un poco antes de redirigir para que se vea el mensaje
                setTimeout(() => {
                    this.backToSearch();
                    this.loadAppointments(); // Recargar citas
                }, 1500);
            } else {
                const errorData = await response.json();
                this.showMessage(`${errorData.error || 'Error al crear la cita'}`, 'error');
            }
        } catch (error) {
            console.error('Error creando cita:', error);
            this.showMessage('Error de conexión', 'error');
        }
    }

    // ===== VISTA DETALLADA DE CITA =====

    async showAppointmentDetail(appointmentId) {
        try {
            const response = await fetch(`${this.baseURL}/appointments/${appointmentId}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                this.displayAppointmentDetail(data.data);
                this.showView('appointment-detail-view');
            } else {
                this.showMessage('Error al cargar detalles de la cita', 'error');
            }
        } catch (error) {
            console.error('Error cargando detalles de la cita:', error);
            this.showMessage('Error de conexión', 'error');
        }
    }

    displayAppointmentDetail(appointment) {
        const contentContainer = document.getElementById('appointment-detail-content');
        if (contentContainer) {
            const appointmentDate = new Date(appointment.date);
            const formattedDate = appointmentDate.toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const formattedTime = appointmentDate.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit'
            });

            contentContainer.innerHTML = `
                <div class="appointment-detail-card">
                    <div class="detail-header">
                        <h3>📋 Detalles de la Cita</h3>
                        <span class="status-badge ${appointment.status}">${appointment.status}</span>
                    </div>
                    
                    <div class="detail-section">
                        <h4>👨‍⚕️ Información del Doctor</h4>
                        <p><strong>Nombre:</strong> ${appointment.doctor.name} ${appointment.doctor.lastname}</p>
                        <p><strong>Especialidades:</strong> ${appointment.doctor.specialties ? appointment.doctor.specialties.join(', ') : 'No especificadas'}</p>
                        <p><strong>Matrícula:</strong> ${appointment.doctor.license || 'No especificada'}</p>
                        <p><strong>Email:</strong> ${appointment.doctor.email || 'No especificado'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>📅 Información de la Cita</h4>
                        <p><strong>Fecha:</strong> ${formattedDate}</p>
                        <p><strong>Hora:</strong> ${formattedTime}</p>
                        <p><strong>Estado:</strong> ${appointment.status}</p>
                        <p><strong>ID de Cita:</strong> ${appointment._id}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>👤 Información del Paciente</h4>
                        <p><strong>Nombre:</strong> ${appointment.patient.name} ${appointment.patient.lastname}</p>
                        <p><strong>DNI:</strong> ${appointment.patient.personalId || 'No especificado'}</p>
                    </div>
                    
                    ${appointment.notes ? `
                        <div class="detail-section">
                            <h4>📝 Notas</h4>
                            <p>${appointment.notes}</p>
                        </div>
                    ` : ''}
                    
                    <div class="detail-actions">
                        <button onclick="patientDashboard.showView('my-appointments')" class="back-btn">
                            ← Volver a Mis Citas
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // ===== NAVEGACIÓN =====

    showView(viewId) {
        console.log('🔍 showView llamada con:', viewId);
        console.log('🔍 previousView actual:', this.previousView);
        
        // Ocultar todas las vistas
        document.getElementById('doctor-search').style.display = 'none';
        document.getElementById('my-appointments').style.display = 'none';
        document.getElementById('doctor-detail-view').style.display = 'none';
        document.getElementById('slots-view').style.display = 'none';
        document.getElementById('book-appointment-view').style.display = 'none';
        document.getElementById('appointment-detail-view').style.display = 'none';

        // Mostrar la vista seleccionada
        const viewElement = document.getElementById(viewId);
        if (viewElement) {
            // Los modales usan display: flex para centrado
            if (viewId.includes('view') || viewId.includes('modal')) {
                viewElement.style.display = 'flex';
            } else {
                viewElement.style.display = 'block';
            }
        }

        // Actualizar sidebar activo
        this.updateSidebarActive(viewId);

        // Si volvemos a doctor-search, solo limpiar vistas de doctores si no venimos de un modal
        if (viewId === 'doctor-search' && !this.previousView) {
            this.clearDoctorViews();
        }
        
        console.log('✅ Vista mostrada:', viewId);
    }

    updateSidebarActive(viewId) {
        // Remover clase active de todos los enlaces del sidebar
        const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Agregar clase active al enlace correspondiente
        let targetLink = null;
        if (viewId === 'patient-info') {
            targetLink = document.querySelector('.sidebar-nav a[onclick*="patient-info"]');
        } else if (viewId === 'doctor-search') {
            targetLink = document.querySelector('.sidebar-nav a[onclick*="doctor-search"]');
        } else if (viewId === 'my-appointments') {
            targetLink = document.querySelector('.sidebar-nav a[onclick*="my-appointments"]');
        }

        if (targetLink) {
            targetLink.classList.add('active');
        }
    }

    getCurrentUserId() {
        return this.currentUserId;
    }

    validateDate() {
        const dateInput = document.getElementById('slotDate');
        const searchBtn = document.getElementById('searchSlotsBtn');
        
        if (dateInput && dateInput.value) {
            const selectedDate = new Date(dateInput.value + 'T00:00:00'); // Evitar problemas de zona horaria
            const dayOfWeek = selectedDate.getDay();
            
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                this.showMessage('No se permiten citas en fines de semana. Seleccioná un día de Lunes a Viernes.', 'error');
                dateInput.value = ''; // Limpiar fecha inválida
                if (searchBtn) searchBtn.disabled = true;
            } else {
                // Fecha válida, habilitar botón
                if (searchBtn) searchBtn.disabled = false;
            }
        } else {
            // Sin fecha, deshabilitar botón
            if (searchBtn) searchBtn.disabled = true;
        }
    }

    backToSearch() {
        console.log('🔍 backToSearch llamada');
        console.log('🔍 previousView:', this.previousView);
        
        // Si hay una vista anterior, regresar a ella, sino ir a doctor-search
        if (this.previousView) {
            console.log('🔄 Regresando a vista anterior:', this.previousView);
            this.showView(this.previousView);
            this.previousView = null; // Limpiar la vista anterior
        } else {
            console.log('🔄 No hay vista anterior, yendo a doctor-search');
            this.showView('doctor-search');
        }
        // No limpiar el estado aquí porque clearDoctorViews ya lo hace
    }

    showMessage(message, type) {
        const messageContainer = document.getElementById('message-container');
        if (messageContainer) {
            messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
            setTimeout(() => {
                messageContainer.innerHTML = '';
            }, 3000);
        }
    }

    clearDoctorViews() {
        // Limpiar SOLO resultados de búsqueda y slots, NO el formulario
        const searchResults = document.getElementById('search-results');
        const slotsContent = document.getElementById('slots-content');
        const slotsList = document.getElementById('slots-list');
        
        if (searchResults) searchResults.innerHTML = '';
        if (slotsContent) slotsContent.innerHTML = '';
        if (slotsList) slotsList.innerHTML = '';
        
        // Limpiar estado
        this.currentDoctor = null;
        this.selectedSlot = null;
        this.selectedTime = null;
        this.selectedDate = null;
    }

        // ===== FILTROS DE CITAS =====

    filterAppointments(filter) {
        
        // Guardar el filtro actual
        this.currentAppointmentsFilter = filter;
        
        // Actualizar botones de tabs
        this.updateTabButtons(filter);
        
        // Cargar citas con el filtro seleccionado
        this.loadAppointments(1, 5, filter);
    }

    updateTabButtons(activeFilter) {
        // Remover clase active de todos los tabs
        const allTabs = document.querySelectorAll('.tab-btn');
        allTabs.forEach(tab => tab.classList.remove('active'));
        
        // Agregar clase active al tab seleccionado
        const activeTab = document.querySelector(`[data-filter="${activeFilter}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }
    
    reorderVisibleAppointments() {
        const appointmentsContainer = document.getElementById('appointments-list');
        if (!appointmentsContainer) return;
        
        const visibleCards = Array.from(document.querySelectorAll('.appointment-card[style="display: block"], .appointment-card:not([style])'));
        
        if (visibleCards.length > 1) {
            // Ordenar por fecha (más reciente primero)
            visibleCards.sort((a, b) => {
                const dateA = a.querySelector('.appointment-date')?.textContent;
                const dateB = b.querySelector('.appointment-date')?.textContent;
                
                if (dateA && dateB) {
                    return new Date(dateB) - new Date(dateA);
                }
                return 0;
            });
            
            // Reordenar en el DOM
            visibleCards.forEach(card => {
                appointmentsContainer.appendChild(card);
            });
        }
    }

    clearFilters() {
        // Resetear filtros
        document.getElementById('statusFilter').value = '';
        
        // Mostrar todas las citas
        const appointmentCards = document.querySelectorAll('.appointment-card');
        appointmentCards.forEach(card => {
            card.style.display = 'block';
        });
        
        // Remover mensaje de no resultados
        const noResultsMsg = document.querySelector('.no-results-message');
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // Función para crear controles de paginación básica (consistente con otros dashboards)
    createPaginationControls(pagination, type) {
        const { currentPage, totalPages, total, limit } = pagination;
        
        let paginationHTML = '<div class="pagination-controls">';
        paginationHTML += `<div class="pagination-info">Página ${currentPage} de ${totalPages}${total ? ` (${total} citas)` : ''}</div>`;
        paginationHTML += '<div class="pagination-buttons">';
        
        // Solo botones Anterior/Siguiente (paginación básica)
        if (currentPage > 1) {
            paginationHTML += `<button onclick="patientDashboard.changePage('${type}', ${currentPage - 1}, ${limit})" class="btn btn-secondary">← Anterior</button>`;
        }
        
        if (currentPage < totalPages) {
            paginationHTML += `<button onclick="patientDashboard.changePage('${type}', ${currentPage + 1}, ${limit})" class="btn btn-primary">Siguiente →</button>`;
        }
        
        paginationHTML += '</div></div>';
        return paginationHTML;
    }

    // Función para cambiar de página
    changePage(type, page, limit) {
        switch (type) {
            case 'appointments':
                // Usar el filtro actual guardado
                this.loadAppointments(page, limit, this.currentAppointmentsFilter);
                break;
            case 'doctors':
                this.loadDoctorsPage(page);
                break;
        }
    }
}

// Inicializar dashboard
const patientDashboard = new PatientDashboard();
