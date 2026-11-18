// Obtener inventario guardado
let inventario = JSON.parse(localStorage.getItem("inventario")) || [];

// Guardar inventario
function guardarInventario() {
    localStorage.setItem("inventario", JSON.stringify(inventario));
}

// Mostrar inventario
function mostrarInventario() {

    const lista = document.getElementById("listaInventario");

    if (!lista) return;

    lista.innerHTML = "";

    if (inventario.length === 0) {
        lista.innerHTML = "<p>No hay productos en inventario.</p>";
        return;
    }

    inventario.forEach(function(producto, indice) {

        const tarjeta = document.createElement("div");
        tarjeta.className = "panel";

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const cantidad = document.createElement("p");
        cantidad.textContent = "Existencias: " + producto.cantidad;

        const estado = document.createElement("p");

        if (producto.cantidad === 0) {
            estado.textContent = "Estado: AGOTADO";
            estado.style.color = "red";
        } else if (producto.cantidad <= 5) {
            estado.textContent = "Estado: EXISTENCIAS BAJAS";
            estado.style.color = "orange";
        } else {
            estado.textContent = "Estado: DISPONIBLE";
            estado.style.color = "green";
        }

        const botonAgregar = document.createElement("button");
        botonAgregar.className = "btn-principal";
        botonAgregar.textContent = "Agregar unidades";

        botonAgregar.addEventListener("click", function() {
            agregarExistencias(indice);
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.className = "btn-principal";
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", function() {
            eliminarInventario(indice);
        });

        tarjeta.appendChild(nombre);
        tarjeta.appendChild(cantidad);
        tarjeta.appendChild(estado);
        tarjeta.appendChild(botonAgregar);
        tarjeta.appendChild(botonEliminar);

        lista.appendChild(tarjeta);
    });
}

// Registrar producto en inventario
document.addEventListener("DOMContentLoaded", function() {

    const formulario = document.getElementById("formInventario");

    mostrarInventario();

    if (!formulario) return;

    formulario.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const nombre = document.getElementById("nombreInventario").value.trim();

        const cantidad = Number(document.getElementById("cantidadInventario").value);

        if (
            nombre === "" ||
            !Number.isInteger(cantidad) ||
            cantidad < 0
        ) {
            alert("Ingresa un nombre y una cantidad válida.");
            return;
        }

        // Comprobar si el producto ya existe
        const indice = inventario.findIndex(function(producto) {
            return producto.nombre.toLowerCase() === nombre.toLowerCase();
        });

        if (indice !== -1) {
            inventario[indice].cantidad += cantidad;
            alert("Se actualizaron las existencias del producto.");
        } else {

            const nuevoProducto = {
                nombre: nombre,
                cantidad: cantidad
            };

            inventario.push(nuevoProducto);

            alert("Producto agregado al inventario.");
        }

        guardarInventario();
        mostrarInventario();

        formulario.reset();
    });
});

// Agregar existencias
function agregarExistencias(indice) {

    const cantidad = Number(
        prompt("¿Cuántas unidades deseas agregar?")
    );

    if (
        !Number.isInteger(cantidad) ||
        cantidad <= 0
    ) {
        alert("Debes ingresar una cantidad entera mayor que cero.");
        return;
    }

    inventario[indice].cantidad += cantidad;

    guardarInventario();
    mostrarInventario();

    alert("Inventario actualizado correctamente.");
}

// Eliminar producto del inventario
function eliminarInventario(indice) {

    const confirmar = confirm("¿Deseas eliminar este producto del inventario?");

    if (confirmar) {

        inventario.splice(indice, 1);

        guardarInventario();
        mostrarInventario();

        alert("Producto eliminado correctamente.");
    }
}
