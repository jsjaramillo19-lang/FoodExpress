// Cambiar entre módulos
function mostrarSeccion(id) {

    const secciones = document.querySelectorAll(".seccion");

    secciones.forEach(function(seccion) {
        seccion.classList.remove("activa");
    });

    const seleccionada = document.getElementById(id);

    if (seleccionada) {
        seleccionada.classList.add("activa");
    }

    // Actualizar información al entrar a Inicio
    if (id === "inicio") {
        actualizarInicio();
    }

    // Actualizar pedidos al entrar a ese módulo
    if (id === "pedidos" &&
        typeof mostrarPedidos === "function") {
        mostrarPedidos();
    }

    // Actualizar productos
    if (id === "productos" &&
        typeof mostrarProductos === "function") {
        mostrarProductos();
    }

    // Actualizar inventario
    if (id === "inventario" &&
        typeof mostrarInventario === "function") {
        mostrarInventario();
    }
}

// Actualizar estadísticas del inicio
function actualizarInicio() {

    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    // Total de pedidos
    document.getElementById("totalPedidos").textContent = pedidos.length;

    // Pedidos pendientes
    const pendientes = pedidos.filter(function(pedido) {
        return pedido.estado === "Pendiente";
    });

    document.getElementById("pendientes").textContent = pendientes.length;

    // Total de ventas entregadas
    const ventas = pedidos
        .filter(function(pedido) {
            return pedido.estado === "Entregado";
        })
        .reduce(function(total, pedido) {
            return total + Number(pedido.total);
        }, 0);

    document.getElementById("ventas").textContent =
        "$" + ventas.toLocaleString("es-CO");

    // Total de productos
    document.getElementById("totalProductos").textContent = productos.length;
}

// Iniciar aplicación
document.addEventListener("DOMContentLoaded", function() {

    mostrarSeccion("inicio");

    actualizarInicio();

    console.log("FoodExpress iniciado correctamente");
});
