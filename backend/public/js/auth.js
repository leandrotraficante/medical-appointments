// Funciones de autenticación para el landing page

// Funciones de navegación
// ===== AUTH FORMS MANAGEMENT =====

// Función para mostrar el formulario de registro
function showRegister() {
    console.log('🔍 showRegister() ejecutándose...');
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authContainer = document.querySelector('.auth-container');
    
    console.log('📋 Elementos encontrados:', {
        loginForm: loginForm,
        registerForm: registerForm,
        authContainer: authContainer
    });
    
    if (loginForm && registerForm && authContainer) {
        console.log('✅ Todos los elementos existen, ocultando login y mostrando register...');
        
        // Ocultar login, mostrar register
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        
        // Centrar el formulario de registro
        authContainer.classList.add('single-form');
        
        console.log('✅ Cambios aplicados');
    } else {
        console.log('❌ Faltan elementos:', {
            loginForm: !!loginForm,
            registerForm: !!registerForm,
            authContainer: !!authContainer
        });
    }
}

// Función para mostrar el formulario de login
function showLogin() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authContainer = document.querySelector('.auth-container');
    
    if (loginForm && registerForm && authContainer) {
        // Ocultar register, mostrar login
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        
        // Restaurar layout de dos columnas
        authContainer.classList.remove('single-form');
    }
}

// ===== FORM SUBMISSION =====

// Login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // El formulario de register usa onsubmit directamente en el HTML
    // No necesitamos addEventListener aquí
});

// Handle login submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageContainer = document.getElementById('loginMessage');
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(messageContainer, 'Inicio de sesión exitoso', 'success');
            
            // Redirect based on role
            setTimeout(() => {
                switch(data.user.role) {
                    case 'patient':
                        window.location.href = '/patient-dashboard.html';
                        break;
                    case 'doctor':
                        window.location.href = '/doctor-dashboard.html';
                        break;
                    case 'admin':
                        window.location.href = '/admin-dashboard.html';
                        break;
                    default:
                        window.location.href = '/patient-dashboard.html';
                }
            }, 1500);
        } else {
            let errorMessage = 'Error en el inicio de sesión';
            
            if (response.status === 401) {
                errorMessage = 'Verifica tu email y contraseña.';
            } else if (response.status === 404) {
                errorMessage = 'Usuario no encontrado. Verifica tu email.';
            } else if (response.status === 403) {
                errorMessage = 'Cuenta desactivada. Contacta al administrador.';
            } else if (data.message) {
                errorMessage = data.message;
            }
            
            showMessage(messageContainer, errorMessage, 'error');
        }
    } catch (error) {
        showMessage(messageContainer, 'Error de conexión', 'error');
    }
}

// Handle register submission
async function handleUserRegister(e) {
    e.preventDefault();
    
    // Verificar que todos los elementos existan antes de acceder a .value
    const email = document.getElementById('registerEmail');
    const password = document.getElementById('registerPassword');
    const name = document.getElementById('registerName');
    const lastname = document.getElementById('registerLastname');
    const role = document.getElementById('registerRole');
    const personalId = document.getElementById('registerPersonalId');
    const birthDate = document.getElementById('registerBirthDate');
    
    if (!email || !password || !name || !lastname || !role || !personalId || !birthDate) {
        console.error('❌ Elementos del formulario no encontrados');
        return;
    }
    
    const formData = {
        email: email.value,
        password: password.value,
        name: name.value,
        lastname: lastname.value,
        role: role.value,
        personalId: personalId.value,
        dateOfBirth: birthDate.value
    };
    
    const messageContainer = document.getElementById('registerMessage');
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(messageContainer, 'Registro exitoso. Redirigiendo al dashboard...', 'success');
            
            // Redirect to patient dashboard (since role is always "patient")
            setTimeout(() => {
                window.location.href = '/patient-dashboard.html';
            }, 2000);
        } else {
            let errorMessage = 'Error en el registro';
            
            if (response.status === 409) {
                errorMessage = 'El email o DNI ya están registrados en el sistema.';
            } else if (data.message) {
                errorMessage = data.message;
            }
            
            showMessage(messageContainer, errorMessage, 'error');
        }
    } catch (error) {
        showMessage(messageContainer, 'Error de conexión', 'error');
    }
}

// Utility function to show messages
function showMessage(container, message, type) {
    if (container) {
        container.innerHTML = `<div class="message ${type}">${message}</div>`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }
}

// El archivo está listo para usar

// ===== LOGOUT FUNCTION =====

// Función global para logout (usada por main.js)
window.logout = async function() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            // Limpiar cookies del frontend
            document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            // Redirigir al landing page
            window.location.href = '/';
        } else {
            console.error('Logout failed');
            // Redirigir de todas formas
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Logout error:', error);
        // Redirigir de todas formas
        window.location.href = '/';
    }
};
