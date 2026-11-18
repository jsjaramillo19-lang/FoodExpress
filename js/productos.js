// Obtener productos guardados
let productos = JSON.parse(localStorage.getItem("productos")) || [];

// Guardar productos
function guardarProductos() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Mostrar productos en pantalla
function mostrarProductos() {

    const contenedor = document.getElementById("productosRegistrados");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No hay productos registrados.</p>";
        return;
    }

    productos.forEach(function(producto, indice) {

        contenedor.innerHTML += `
            <div class="panel">
                <strong>${producto.nombre}</strong>
                <p>Precio: $${producto.precio.toLocaleString("es-CO")}</p>

                <button class="btn-principal"
                    onclick="eliminarProducto(${indice})">
                    Eliminar
                </button>
            </div>
        `;
    });
}

// Registrar un producto
document.addEventListener("DOMContentLoaded", function() {

    const formulario = document.getElementById("formProducto");

    if (!formulario) return;

    formulario.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const nombre = document.getElementById("nombreProducto").value.trim();

        const precio = Number(document.getElementById("precioProducto").value);

        if (nombre === "" || precio <= 0 || !Number.isFinite(precio)) {
            alert("Por favor, ingresa un nombre y un precio válido.");
            return;
        }

        const nuevoProducto = {
            nombre: nombre,
            precio: precio
        };

        productos.push(nuevoProducto);

        guardarProductos();
        mostrarProductos();

        formulario.reset();

        alert("Producto registrado correctamente.");
    });

    mostrarProductos();
});

// Eliminar un producto
function eliminarProducto(indice) {

    const confirmar = confirm("¿Deseas eliminar este producto?");

    if (confirmar) {
        productos.splice(indice, 1);

        guardarProductos();
        mostrarProductos();

        alert("Producto eliminado correctamente.");
    }
}
