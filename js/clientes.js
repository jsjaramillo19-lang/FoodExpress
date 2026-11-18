// Obtener clientes guardados
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

// Guardar clientes
function guardarClientes() {
    localStorage.setItem("clientes", JSON.stringify(clientes));
}

// Mostrar clientes
function mostrarClientes() {

    const lista = document.getElementById("listaClientes");

    if (!lista) return;

    lista.innerHTML = "";

    if (clientes.length === 0) {
        lista.innerHTML = "<p>No hay clientes registrados.</p>";
        return;
    }

    clientes.forEach(function(cliente, indice) {

        const tarjeta = document.createElement("div");
        tarjeta.className = "panel";

        const nombre = document.createElement("h3");
        nombre.textContent = cliente.nombre;

        const telefono = document.createElement("p");
        telefono.textContent = "Teléfono: " + cliente.telefono;

        const direccion = document.createElement("p");
        direccion.textContent = "Dirección: " + cliente.direccion;

        const boton = document.createElement("button");
        boton.textContent = "Eliminar";
        boton.className = "btn-principal";

        boton.addEventListener("click", function() {
            eliminarCliente(indice);
        });

        tarjeta.appendChild(nombre);
        tarjeta.appendChild(telefono);
        tarjeta.appendChild(direccion);
        tarjeta.appendChild(boton);

        lista.appendChild(tarjeta);
    });
}

// Registrar clientes
document.addEventListener("DOMContentLoaded", function() {

    const formulario = document.getElementById("formCliente");

    mostrarClientes();

    if (!formulario) return;

    formulario.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const nombre = document.getElementById("nombreCliente").value.trim();
        const telefono = document.getElementById("telefonoCliente").value.trim();
        const direccion = document.getElementById("direccionCliente").value.trim();

        if (nombre === "" || telefono === "" || direccion === "") {
            alert("Completa todos los campos.");
            return;
        }

        // Comprobar si el teléfono ya existe
        const existe = clientes.some(function(cliente) {
            return cliente.telefono === telefono;
        });

        if (existe) {
            alert("Este cliente ya está registrado.");
            return;
        }

        const nuevoCliente = {
            nombre: nombre,
            telefono: telefono,
            direccion: direccion
        };

        clientes.push(nuevoCliente);

        guardarClientes();
        mostrarClientes();

        formulario.reset();

        alert("Cliente registrado correctamente.");
    });
});

// Eliminar cliente
function eliminarCliente(indice) {

    const confirmar = confirm("¿Deseas eliminar este cliente?");

    if (confirmar) {
        clientes.splice(indice, 1);

        guardarClientes();
        mostrarClientes();

        alert("Cliente eliminado correctamente.");
    }
};
