// Guardar configuración del restaurante
function guardarConfiguracion() {

    const nombre = document.getElementById("nombreRestaurante").value.trim();

    const telefono = document.getElementById("telefonoRestaurante").value.trim();

    const direccion = document.getElementById("direccionRestaurante").value.trim();

    if (nombre === "" || telefono === "" || direccion === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const configuracion = {
        nombre: nombre,
        telefono: telefono,
        direccion: direccion
    };

    localStorage.setItem(
        "configuracionRestaurante",
        JSON.stringify(configuracion)
    );

    mostrarConfiguracion();

    alert("Configuración guardada correctamente.");
}

// Mostrar configuración guardada
function mostrarConfiguracion() {

    const datos = JSON.parse(
        localStorage.getItem("configuracionRestaurante")
    );

    if (!datos) return;

    document.getElementById("nombreRestaurante").value = datos.nombre;
    document.getElementById("telefonoRestaurante").value = datos.telefono;
    document.getElementById("direccionRestaurante").value = datos.direccion;
}

// Iniciar módulo
document.addEventListener("DOMContentLoaded", function() {

    const formulario = document.getElementById("formConfiguracion");

    mostrarConfiguracion();

    if (!formulario) return;

    formulario.addEventListener("submit", function(evento) {

        evento.preventDefault();

        guardarConfiguracion();

    });
});
