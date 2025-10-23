// auth.js - Manejo de la alternancia entre login y registro
document.addEventListener('DOMContentLoaded', function() {
    const paginaInicio = document.getElementById('pagina-inicio');
    const paginaRegistro = document.getElementById('pagina-registro');
    const alternarRegistro = document.getElementById('alternar-registro');
    const alternarInicio = document.getElementById('alternar-inicio');

    // Función para mostrar registro
    function mostrarRegistro() {
        paginaInicio.classList.remove('activo');
        paginaRegistro.classList.add('activo');
    }

    // Función para mostrar login
    function mostrarInicio() {
        paginaRegistro.classList.remove('activo');
        paginaInicio.classList.add('activo');
    }

    // Event listeners
    if (alternarRegistro) {
        alternarRegistro.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarRegistro();
        });
    }

    if (alternarInicio) {
        alternarInicio.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarInicio();
        });
    }

    // Validación adicional para DNI
    const dniInput = document.getElementById('registro-dni');
    if (dniInput) {
        dniInput.addEventListener('input', function() {
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
        });
    }

    console.log('Auth.js cargado correctamente');
});