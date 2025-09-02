// Dashboard del Doctor
class DoctorDashboard {
    constructor() {
        this.baseURL = '/api';
        this.currentAppointment = null; // Para mantener referencia a la cita seleccionada
        this.currentAppointmentsFilter = 'all'; // Filtro actual de citas
        this.currentAppointmentsPage = 1; // Página actual de citas
        this.init();
    }

    async init() {
        await this.loadProfile();
        await this.loadAppointments();
        await this.loadTodayAppointments();
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
                    <p><strong>Especialidades:</strong> ${profile.specialties ? profile.specialties.join(', ') : 'No especificadas'}</p>
                    <p><strong>Matrícula:</strong> ${profile.license || 'No especificada'}</p>
                </div>
            `;
        }
    }

    async loadAppointments(page = 1, limit = 5, filter = 'all') {
        try {
            // Guardar el filtro y página actual
            this.currentAppointmentsFilter = filter;
            this.currentAppointmentsPage = page;
            
            let url = `${this.baseURL}/appointments/my-appointments?page=${page}&limit=${limit}`;
            
            // Agregar filtro por estado si no es 'all'
            if (filter !== 'all') {
                url += `&status=${filter}`;
            }
                       
            const response = await fetch(url, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                
                // Ordenar citas por fecha de la cita (más cercana cronológicamente primero)
                if (data.data && Array.isArray(data.data)) {
                    data.data.sort((a, b) => {
                        // Usar la fecha de la cita, no la fecha de creación
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        
                        // Ordenar de más cercana a más lejana cronológicamente
                        return dateA - dateB;
                    });
                }
                
                this.displayAppointments(data.data, data.pagination, filter);
            } else {
                this.showMessage('Error al cargar las citas', 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    filterAppointments(filter) {       
        // Actualizar botones de tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-filter="${filter}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Cargar citas con el filtro seleccionado
        this.loadAppointments(1, 5, filter);
    }

    async loadTodayAppointments(page = 1, limit = 5) {
        try {
            const now = new Date();
            const today = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`; // Formato YYYY-MM-DD local
            const response = await fetch(`${this.baseURL}/appointments/my-appointments?startDate=${today}&endDate=${today}&page=${page}&limit=${limit}`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Ordenar citas por fecha de la cita (más cercana cronológicamente primero)
                if (data.data && Array.isArray(data.data)) {
                    data.data.sort((a, b) => {
                        // Usar la fecha de la cita, no la fecha de creación
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        
                        // Ordenar de más cercana a más lejana cronológicamente
                        return dateA - dateB;
                    });
                }
                
                this.displayTodayAppointments(data.data, data.pagination);
            } else {
                this.showMessage('Error al cargar las citas del día', 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    displayAppointments(appointments, pagination = null, filter = 'all') {
        const appointmentsContainer = document.getElementById('appointments-list');
        if (appointmentsContainer) {
            if (appointments.length === 0) {
                let message = 'No tenés citas asignadas';
                if (filter === 'pending') message = 'No tenés citas pendientes';
                else if (filter === 'confirmed') message = 'No tenés citas confirmadas';
                else if (filter === 'completed') message = 'No tenés citas completadas';
                else if (filter === 'cancelled') message = 'No tenés citas canceladas';
                
                appointmentsContainer.innerHTML = `<p>${message}</p>`;
                return;
            }

            // Título según el filtro
            let title = 'Mis Citas Asignadas';
            if (filter === 'pending') title = '⏳ Citas Pendientes';
            else if (filter === 'confirmed') title = '✅ Citas Confirmadas';
            else if (filter === 'completed') title = '🎯 Citas Completadas';
            else if (filter === 'cancelled') title = '❌ Citas Canceladas';
            
            let appointmentsHTML = `<h3>${title}</h3>`;
            
            // Agregar controles de paginación básica si hay múltiples páginas
            if (pagination && pagination.totalPages > 1) {
                appointmentsHTML += this.createPaginationControls(pagination, 'appointments');
            }

            appointmentsHTML += '<div class="appointments-list">';
            
            appointments.forEach(appointment => {
                // Solo mostrar botones de acción para citas pending y confirmed
                const actionButtons = (appointment.status === 'pending' || appointment.status === 'confirmed') ? `
                    <div class="appointment-actions">
                        ${appointment.status === 'pending' ? 
                            `<button onclick="doctorDashboard.confirmAppointment('${appointment._id}')" class="action-btn confirm-btn">
                                ✅ Confirmar
                            </button>` : ''
                        }
                        <button onclick="doctorDashboard.cancelAppointment('${appointment._id}')" class="action-btn cancel-btn">
                            ❌ Cancelar
                        </button>
                    </div>
                ` : '';

                appointmentsHTML += `
                    <div class="appointment-card">
                    <div class="appointment-header">
                        <h4>👤 ${appointment.patient.name} ${appointment.patient.lastname}</h4>
                        <span class="status-badge ${appointment.status}">${appointment.status}</span>
                    </div>
                    <div class="appointment-info">
                            <p><strong>📅 Fecha:</strong> ${new Date(appointment.date).toLocaleString('es-AR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'America/Argentina/Buenos_Aires'
                            })}</p>
                        <p><strong>🆔 DNI:</strong> ${appointment.patient.personalId || 'No especificado'}</p>
                            <p><strong>📞 Teléfono:</strong> ${appointment.patient.phone || 'No especificado'}</p>
                    </div>
                        ${actionButtons}
                        <div class="appointment-detail-link">
                            <button onclick="doctorDashboard.showAppointmentDetail('${appointment._id}')" class="detail-btn">
                                📋 Ver Detalles
                        </button>
                    </div>
                </div>
                `;
            });

            appointmentsHTML += '</div>';
            appointmentsContainer.innerHTML = appointmentsHTML;
        }
    }

    displayTodayAppointments(appointments, pagination = null) {
        const appointmentsContainer = document.getElementById('today-appointments-list');
        if (appointmentsContainer) {
            if (appointments.length === 0) {
                appointmentsContainer.innerHTML = '<p>No tenés citas programadas para hoy</p>';
                return;
            }

            let appointmentsHTML = '<h3>Citas del Día</h3>';
            
            // Agregar controles de paginación básica si hay múltiples páginas
            if (pagination && pagination.totalPages > 1) {
                appointmentsHTML += this.createPaginationControls(pagination, 'today-appointments');
            }

            appointmentsHTML += '<div class="appointments-list">';
            
            appointments.forEach(appointment => {
                // Solo mostrar botones de acción para citas pending y confirmed
                const actionButtons = (appointment.status === 'pending' || appointment.status === 'confirmed') ? `
                    <div class="appointment-actions">
                        ${appointment.status === 'pending' ? 
                            `<button onclick="doctorDashboard.confirmAppointment('${appointment._id}')" class="action-btn confirm-btn">
                                ✅ Confirmar
                            </button>` : ''
                        }
                        <button onclick="doctorDashboard.cancelAppointment('${appointment._id}')" class="action-btn cancel-btn">
                                ❌ Cancelar
                            </button>
                    </div>
                ` : '';

                appointmentsHTML += `
                    <div class="appointment-card">
                        <div class="appointment-header">
                            <h4>👤 ${appointment.patient.name} ${appointment.patient.lastname}</h4>
                            <span class="status-badge ${appointment.status}">${appointment.status}</span>
                        </div>
                        <div class="appointment-info">
                            <p><strong>📅 Hora:</strong> ${new Date(appointment.date).toLocaleTimeString('es-AR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'America/Argentina/Buenos_Aires'
                            })}</p>
                            <p><strong>🆔 DNI:</strong> ${appointment.patient.personalId || 'No especificado'}</p>
                            <p><strong>📞 Teléfono:</strong> ${appointment.patient.phone || 'No especificado'}</p>
                        </div>
                        ${actionButtons}
                        <div class="appointment-detail-link">
                            <button onclick="doctorDashboard.showAppointmentDetail('${appointment._id}')" class="detail-btn">
                                📋 Ver Detalles
                            </button>
                        </div>
                    </div>
                `;
            });
            
            appointmentsHTML += '</div>';
            appointmentsContainer.innerHTML = appointmentsHTML;
        }
    }

    // Función para crear controles de paginación básica (consistente con otros dashboards)
    createPaginationControls(pagination, type) {
        const { currentPage, totalPages, total, limit } = pagination;
        
        let paginationHTML = '<div class="pagination-controls">';
        paginationHTML += `<div class="pagination-info">Página ${currentPage} de ${totalPages} (${total} citas)</div>`;
        paginationHTML += '<div class="pagination-buttons">';
        
        // Solo botones Anterior/Siguiente (paginación básica)
        if (currentPage > 1) {
            paginationHTML += `<button onclick="doctorDashboard.changePage('${type}', ${currentPage - 1}, ${limit})" class="btn btn-secondary">← Anterior</button>`;
        }
        
        if (currentPage < totalPages) {
            paginationHTML += `<button onclick="doctorDashboard.changePage('${type}', ${currentPage + 1}, ${limit})" class="btn btn-primary">Siguiente →</button>`;
        }
        
        paginationHTML += '</div></div>';
        return paginationHTML;
    }

    // Función para cambiar de página
    changePage(type, page, limit) {
        
        // Hacer scroll al inicio de la lista
        const mainContent = document.querySelector('.dashboard-main');
        if (mainContent) {
            mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        switch (type) {
            case 'appointments':
                this.loadAppointments(page, limit, this.currentAppointmentsFilter);
                break;
            case 'today-appointments':
                this.loadTodayAppointments(page, limit);
                break;
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
                this.currentAppointment = data.data;
                this.currentAppointmentId = appointmentId; // Guardar el ID para las acciones
                this.displayAppointmentDetail(data.data);
                this.showView('appointment-management');
            } else {
                this.showMessage('Error al cargar detalles de la cita', 'error');
            }
        } catch (error) {
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
                day: 'numeric',
                timeZone: 'America/Argentina/Buenos_Aires'
            });
            const formattedTime = appointmentDate.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Argentina/Buenos_Aires'
            });

            contentContainer.innerHTML = `
                <div class="appointment-detail-card">
                    <div class="detail-header">
                        <h3>📋 Detalles de la Cita</h3>
                        <span class="status-badge ${appointment.status}">${appointment.status}</span>
                    </div>
                    
                    <div class="detail-section">
                        <h4>👤 Información del Paciente</h4>
                        <p><strong>Nombre:</strong> ${appointment.patient.name} ${appointment.patient.lastname}</p>
                        <p><strong>DNI:</strong> ${appointment.patient.personalId || 'No especificado'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>📅 Información de la Cita</h4>
                        <p><strong>Fecha:</strong> ${formattedDate}</p>
                        <p><strong>Hora:</strong> ${formattedTime}</p>
                        <p><strong>Estado:</strong> ${appointment.status}</p>
                        <p><strong>ID de Cita:</strong> ${appointment._id}</p>
                    </div>
                    
                    ${appointment.notes ? `
                        <div class="detail-section">
                            <h4>📝 Notas</h4>
                            <p>${appointment.notes}</p>
                        </div>
                    ` : ''}
                    
                    <div class="detail-actions">
                        <button onclick="doctorDashboard.showView('my-appointments')" class="btn-secondary">
                            ← Volver a Mis Citas
                        </button>
                        <button onclick="doctorDashboard.showView('today-appointments')" class="btn-secondary">
                            📅 Ver Citas de Hoy
                        </button>

                    </div>
                    
                    <!-- Botones de acción para la cita actual -->
                    <div class="appointment-actions-detail">
                        ${appointment.status === 'pending' ? `
                            <button onclick="doctorDashboard.confirmAppointment('${appointment._id}')" class="action-btn confirm-btn">
                                ✅ Confirmar Cita
                            </button>
                        ` : ''}
                        ${(appointment.status === 'pending' || appointment.status === 'confirmed') ? `
                            <button onclick="doctorDashboard.cancelAppointment('${appointment._id}')" class="action-btn cancel-btn">
                                ❌ Cancelar
                            </button>
                        ` : ''}
                        ${appointment.status === 'confirmed' ? `
                            <button onclick="doctorDashboard.completeAppointment()" class="action-btn complete-btn">
                                🎯 Completada
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;

            // Mostrar/ocultar botones según el estado actual
            this.updateActionButtons(appointment.status);
        }
    }

    updateActionButtons(currentStatus) {
        const confirmBtn = document.getElementById('confirmBtn');
        const completeBtn = document.getElementById('completeBtn');

        // Botón Confirmar: solo visible si está pendiente
        if (confirmBtn) {
            confirmBtn.style.display = currentStatus === 'pending' ? 'block' : 'none';
        }

        // Botón Completar: solo visible si está confirmada
        if (completeBtn) {
            completeBtn.style.display = currentStatus === 'confirmed' ? 'block' : 'none';
        }
    }

    // ===== CAMBIAR ESTADO DE CITAS =====

    async confirmAppointment() {
        if (!this.currentAppointment) {
            this.showMessage('No hay cita seleccionada', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/appointments/${this.currentAppointment._id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'confirmed' }),
                credentials: 'include'
            });

            if (response.ok) {
                this.showMessage('✅ Cita confirmada exitosamente!', 'success');
                // Recargar citas y volver a la lista
                setTimeout(() => {
                    this.loadAppointments();
                    this.showView('my-appointments');
                }, 1500);
            } else {
                const errorData = await response.json();
                this.showMessage(`❌ ${errorData.error || 'Error al confirmar la cita'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    async completeAppointment() {
        if (!this.currentAppointment) {
            this.showMessage('No hay cita seleccionada', 'error');
            return;
        }

        // Validar que la cita no sea futura
        const appointmentDate = new Date(this.currentAppointment.date);
        const now = new Date();
        
        if (appointmentDate > now) {
            this.showMessage('❌ No se puede marcar como completada una cita futura. La cita debe haber pasado para marcarla como completada.', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/appointments/${this.currentAppointment._id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'completed' }),
                credentials: 'include'
            });

            if (response.ok) {
                this.showMessage('✅ Cita marcada como completada!', 'success');
                // Recargar citas y volver a la lista
                setTimeout(() => {
                    this.loadAppointments(1, 5, this.currentAppointmentsFilter);
                    this.showView('my-appointments');
                }, 1500);
            } else {
                const errorData = await response.json();
                this.showMessage(`❌ ${errorData.error || 'Error al marcar como completada'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    // ===== ACCIONES DE CITAS =====

    // Función para mostrar modal de confirmación
    showConfirmModal(message, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'confirm-modal-overlay';
        modal.innerHTML = `
            <div class="confirm-modal">
                <div class="confirm-modal-header">
                    <h3>Confirmar Acción</h3>
                </div>
                <div class="confirm-modal-body">
                    <p>${message}</p>
                </div>
                <div class="confirm-modal-actions">
                    <button class="btn-secondary" onclick="this.closest('.confirm-modal-overlay').remove()">
                        Cancelar
                    </button>
                    <button class="btn-primary" onclick="this.closest('.confirm-modal-overlay').remove(); ${onConfirm}">
                        Confirmar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }



    async confirmAppointment(appointmentId) {
        try {
            
            this.showConfirmModal(
                '¿Estás seguro de que querés confirmar esta cita?',
                `doctorDashboard.confirmAppointmentAction('${appointmentId}')`
            );
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    async confirmAppointmentAction(appointmentId) {
        try {
            const response = await fetch(`${this.baseURL}/appointments/${appointmentId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'confirmed' }),
                credentials: 'include'
            });

            if (response.ok) {
                this.showMessage('✅ Cita confirmada exitosamente!', 'success');
                
                // Regresar a la vista de citas después de confirmar
                setTimeout(() => {
                    this.showView('my-appointments');
                    this.loadAppointments(1, 5, this.currentAppointmentsFilter);
                    this.loadTodayAppointments();
                }, 1000);
            } else {
                const errorData = await response.json();
                this.showMessage(`❌ Error al confirmar la cita: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    async cancelAppointment(appointmentId) {
        try {
            
            this.showConfirmModal(
                '¿Estás seguro de que querés cancelar esta cita?',
                `doctorDashboard.cancelAppointmentAction('${appointmentId}')`
            );
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    async cancelAppointmentAction(appointmentId) {
        try {
            const response = await fetch(`${this.baseURL}/appointments/${appointmentId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    status: 'cancelled'
                }),
                credentials: 'include'
            });

            if (response.ok) {
                this.showMessage('✅ Cita cancelada exitosamente!', 'success');
                
                // Regresar a la vista de citas después de cancelar
                setTimeout(() => {
                    this.showView('my-appointments');
                    this.loadAppointments(1, 5, this.currentAppointmentsFilter);
                    this.loadTodayAppointments();
                }, 1000);
            } else {
                const errorData = await response.json();
                this.showMessage(`❌ Error al cancelar la cita: ${errorData.error || 'Error desconocido'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    // ===== CANCELACIÓN MASIVA SEMANAL =====

    async cancelWeekAppointments() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const reason = document.getElementById('cancellationReason').value;

        if (!startDate || !endDate) {
            this.showMessage('Seleccioná las fechas de inicio y fin de la semana', 'error');
            return;
        }

        if (!reason.trim()) {
            this.showMessage('Ingresá un motivo para la cancelación', 'error');
            return;
        }

        // Confirmar antes de proceder
        this.showConfirmModal(
            `¿Estás seguro de que querés cancelar TODAS las citas del ${startDate} al ${endDate}?\n\nMotivo: ${reason}\n\nEsta acción no se puede deshacer.`,
            `doctorDashboard.cancelWeekAppointmentsAction('${startDate}', '${endDate}', '${reason}')`
        );
            return;

        }

    async cancelWeekAppointmentsAction(startDate, endDate, reason) {
        try {
            // Obtener el ID del doctor desde el perfil
            const profileResponse = await fetch(`${this.baseURL}/users/my-profile`, {
                credentials: 'include'
            });
            
            if (!profileResponse.ok) {
                this.showMessage('Error al obtener perfil del doctor', 'error');
                return;
            }
            
            const profileData = await profileResponse.json();
            const doctorId = profileData.data._id;

            const response = await fetch(`${this.baseURL}/appointments/doctor/${doctorId}/cancel-week`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    startDate: startDate,
                    endDate: endDate,
                    reason: reason
                }),
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                this.showMessage(`✅ Se cancelaron ${result.data.modifiedCount} citas exitosamente!`, 'success');
                
                // Limpiar formulario
                document.getElementById('startDate').value = '';
                document.getElementById('endDate').value = '';
                document.getElementById('cancellationReason').value = '';
                
                // Recargar citas
                setTimeout(() => {
                    this.loadAppointments();
                }, 1500);
            } else {
                const errorData = await response.json();
                this.showMessage(`❌ ${errorData.error || 'Error al cancelar las citas'}`, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    // ===== NAVEGACIÓN =====

    showView(viewId) {        
        // Ocultar todas las vistas
        const sections = ['my-appointments', 'today-appointments', 'appointment-management', 'doctor-info', 'bulk-cancellation'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });

        // Mostrar la vista seleccionada
        const selectedSection = document.getElementById(viewId);
        if (selectedSection) {
            selectedSection.style.display = 'block';
            
            // Hacer scroll suave al inicio de la sección
            selectedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Actualizar botones del sidebar
        const sidebarButtons = document.querySelectorAll('.sidebar-btn');
        sidebarButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Marcar el botón activo
        const activeButton = document.querySelector(`[onclick="doctorDashboard.showView('${viewId}')"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Cargar datos específicos de la vista si es necesario
        this.loadViewSpecificData(viewId);
    }

    loadViewSpecificData(viewId) {
        switch (viewId) {
            case 'my-appointments':
                this.loadAppointments(1, 5, this.currentAppointmentsFilter);
                break;
            case 'today-appointments':
                this.loadTodayAppointments();
                break;
            case 'doctor-info':
                this.loadProfile();
                break;
        }
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
}

// Inicializar dashboard
const doctorDashboard = new DoctorDashboard();
