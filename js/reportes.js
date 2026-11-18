// Actualizar reportes
function actualizarReportes() {

    // Obtener información guardada
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    // Calcular total de pedidos
    const totalPedidos = pedidos.length;

    // Calcular ventas de pedidos entregados
    const totalVentas = pedidos
        .filter(function(pedido) {
            return pedido.estado === "Entregado";
        })
        .reduce(function(total, pedido) {
            return total + Number(pedido.total);
        }, 0);

    // Mostrar total de pedidos
    document.getElementById("reportePedidos").textContent = totalPedidos;

    // Mostrar total de ventas
    document.getElementById("reporteVentas").textContent =
        "$" + totalVentas.toLocaleString("es-CO");

    // Mostrar productos registrados
    document.getElementById("reporteProductos").textContent = productos.length;

    // Calcular productos más vendidos
    const ventasProductos = {};

    pedidos.forEach(function(pedido) {

        const nombre = pedido.producto;

        if (!ventasProductos[nombre]) {
            ventasProductos[nombre] = 0;
        }

        ventasProductos[nombre] += Number(pedido.cantidad);
    });

    // Ordenar productos por cantidad vendida
    const ranking = Object.entries(ventasProductos)
        .sort(function(a, b) {
            return b[1] - a[1];
        });

    // Mostrar ranking
    const contenedor = document.getElementById("reporteProductos");

    // Mantener el total de productos en su propio elemento
    const lista = document.getElementById("listaReporteProductos");

    if (lista) {

        lista.innerHTML = "";

        if (ranking.length === 0) {
            lista.textContent = "Todavía no hay ventas registradas.";
        } else {

            ranking.forEach(function(producto, indice) {

                const elemento = document.createElement("p");

                elemento.textContent =
                    (indice + 1) + ". " +
                    producto[0] + " - " +
                    producto[1] + " unidades vendidas";

                lista.appendChild(elemento);
            });
        }
    }
}

// Actualizar reportes al abrir la página
document.addEventListener("DOMContentLoaded", function() {
    actualizarReportes();
});
