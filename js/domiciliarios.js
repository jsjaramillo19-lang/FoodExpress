let domiciliarios = JSON.parse(localStorage.getItem("domiciliarios")) || [];

// Guardar domiciliarios
function guardarDomiciliarios() {
    localStorage.setItem("domiciliarios", JSON.stringify(domiciliarios));
}

// Mostrar domiciliarios
function mostrarDomiciliarios() {

    const lista = document.getElementById("listaDomiciliarios");

    if (!lista) return;

    lista.innerHTML = "";

    domiciliarios.forEach(function(domiciliario, indice) {

        const tarjeta = document.createElement("div");

        tarjeta.className = "tarjeta";

        const colorEstado = domiciliario.estado === "Disponible"
            ? "green"
            : "orange";

        tarjeta.innerHTML = `
            <h3>${domiciliario.nombre}</h3>

            <p>Teléfono: ${domiciliario.telefono}</p>

            <p>
                Estado:
                <strong style="color: ${colorEstado}">
                    ${domiciliario.estado}
                </strong>
            </p>

            <button onclick="eliminarDomiciliario(${indice})">
                Eliminar
            </button>
        `;

        lista.appendChild(tarjeta);
    });
}

// Registrar domiciliario
document.addEventListener("DOMContentLoaded", function() {

    mostrarDomiciliarios();

    const formulario = document.getElementById("formDomiciliario");

    if (!formulario) return;

    formulario.addEventListener("submit", function(event) {

        event.preventDefault();

        const nombre = document.getElementById("nombreDomiciliario").value.trim();

        const telefono = document.getElementById("telefonoDomiciliario").value.trim();

        if (!nombre || !telefono) {
            alert("Completa todos los campos.");
            return;
        }

        const existe = domiciliarios.some(function(item) {
            return item.telefono === telefono;
        });

        if (existe) {
            alert("Este domiciliario ya está registrado.");
            return;
        }

        const nuevoDomiciliario = {
            nombre: nombre,
            telefono: telefono,
            estado: "Disponible"
        };

        domiciliarios.push(nuevoDomiciliario);

        guardarDomiciliarios();

        mostrarDomiciliarios();

        formulario.reset();

        alert("Domiciliario registrado correctamente.");
    });
});

// Eliminar domiciliario
function eliminarDomiciliario(indice) {

    if (domiciliarios[indice].estado === "Ocupado") {
        alert("No puedes eliminar un domiciliario que tiene un pedido asignado.");
        return;
    }

    const confirmar = confirm("¿Deseas eliminar este domiciliario?");

    if (confirmar) {

        domiciliarios.splice(indice, 1);

        guardarDomiciliarios();

        mostrarDomiciliarios();

        alert("Domiciliario eliminado correctamente.");
    }
};
