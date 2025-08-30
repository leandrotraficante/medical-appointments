// Funcionalidad general de la aplicación
class MainApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalFunctions();
    }

    setupGlobalFunctions() {
        // Función global para mostrar mensajes (si no existe ya)
        if (!window.showMessage) {
            window.showMessage = (message, type) => {
                console.log(`[${type.toUpperCase()}] ${message}`);
            };
        }
    }
}

// Inicializar aplicación principal
const mainApp = new MainApp();
