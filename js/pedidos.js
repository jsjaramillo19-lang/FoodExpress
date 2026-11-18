let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let carritoPedido = [];

// Guardar pedidos
function guardarPedidos() {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

// Cargar productos
function cargarProductosPedido() {

    const selector = document.getElementById("producto");

    if (!selector) return;

    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    selector.innerHTML = '<option value="">Seleccionar producto</option>';

    productos.forEach(function(producto) {

        const opcion = document.createElement("option");

        opcion.value = producto.nombre;
        opcion.textContent = producto.nombre + " - $" + producto.precio;

        selector.appendChild(opcion);
    });
}

// Cargar domiciliarios disponibles
function cargarDomiciliariosPedido() {

    const selector = document.getElementById("domiciliario");

    if (!selector) return;

    const domiciliarios = JSON.parse(localStorage.getItem("domiciliarios")) || [];

    selector.innerHTML = '<option value="">Seleccionar domiciliario</option>';

    domiciliarios.forEach(function(domiciliario) {

        if (domiciliario.estado === "Disponible") {

            const opcion = document.createElement("option");

            opcion.value = domiciliario.nombre;
            opcion.textContent = domiciliario.nombre;

            selector.appendChild(opcion);
        }
    });
}

// Agregar producto al carrito
function agregarProductoCarrito() {

    const nombre = document.getElementById("producto").value;
    const cantidad = Number(document.getElementById("cantidad").value);

    if (!nombre) {
        alert("Selecciona un producto.");
        return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        alert("Escribe una cantidad válida.");
        return;
    }

    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const inventario = JSON.parse(localStorage.getItem("inventario")) || [];

    const producto = productos.find(function(item) {
        return item.nombre === nombre;
    });

    const existencia = inventario.find(function(item) {
        return item.nombre === nombre;
    });

    if (!producto || !existencia) {
        alert("El producto no está registrado en el inventario.");
        return;
    }

    // Revisar cantidades que ya están en el carrito
    let cantidadEnCarrito = 0;

    carritoPedido.forEach(function(item) {
        if (item.nombre === nombre) {
            cantidadEnCarrito += item.cantidad;
        }
    });

    if (cantidadEnCarrito + cantidad > existencia.cantidad) {
        alert("No hay suficientes unidades disponibles.");
        return;
    }

    carritoPedido.push({
        nombre: producto.nombre,
        precio: Number(producto.precio),
        cantidad: cantidad,
        subtotal: Number(producto.precio) * cantidad
    });

    mostrarCarritoPedido();

    document.getElementById("cantidad").value = 1;

    alert("Producto agregado al pedido.");
}

// Mostrar carrito
function mostrarCarritoPedido() {

    const contenedor = document.getElementById("carritoPedido");
    const totalElemento = document.getElementById("totalCarrito");

    if (!contenedor || !totalElemento) return;

    contenedor.innerHTML = "";

    if (carritoPedido.length === 0) {
        contenedor.innerHTML = "<p>Aún no has agregado productos.</p>";
    }

    carritoPedido.forEach(function(item, indice) {

        const fila = document.createElement("div");

        fila.innerHTML = `
            <p>
                <strong>${item.nombre}</strong>
                - Cantidad: ${item.cantidad}
                - Subtotal: $${item.subtotal.toLocaleString("es-CO")}
                <button type="button" onclick="eliminarProductoCarrito(${indice})">
                    Quitar
                </button>
            </p>
        `;

        contenedor.appendChild(fila);
    });

    const total = carritoPedido.reduce(function(suma, item) {
        return suma + item.subtotal;
    }, 0);

    totalElemento.textContent = "$" + total.toLocaleString("es-CO");
}

// Quitar producto del carrito
function eliminarProductoCarrito(indice) {

    carritoPedido.splice(indice, 1);

    mostrarCarritoPedido();
}

// Mostrar pedidos
function mostrarPedidos() {

    const tabla = document.getElementById("tablaPedidos");

    if (!tabla) return;

    tabla.innerHTML = "";

    pedidos.forEach(function(pedido, indice) {

        const fila = document.createElement("tr");

        const productosTexto = pedido.productos
            ? pedido.productos.map(function(item) {
                return item.nombre + " x " + item.cantidad;
            }).join(", ")
            : pedido.producto;

        fila.innerHTML = `
            <td>${pedido.cliente}</td>
            <td>${pedido.telefono}</td>
            <td>${productosTexto}</td>
            <td>${pedido.domiciliario || "Sin asignar"}</td>
            <td>$${Number(pedido.total).toLocaleString("es-CO")}</td>
            <td>${pedido.estado}</td>
            <td>
                <button onclick="cambiarEstadoPedido(${indice})"
                    ${pedido.estado === "Entregado" ? "disabled" : ""}>
                    ${pedido.estado === "Entregado" ? "Finalizado" : "Avanzar estado"}
                </button>
            </td>
        `;

        tabla.appendChild(fila);
    });
}

// Registrar pedido con varios productos
document.addEventListener("DOMContentLoaded", function() {

    cargarProductosPedido();
    cargarDomiciliariosPedido();
    mostrarPedidos();
    mostrarCarritoPedido();

    const formulario = document.getElementById("formPedido");

    if (!formulario) return;

    formulario.addEventListener("submit", function(event) {

        event.preventDefault();

        const cliente = document.getElementById("cliente").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const nombreDomiciliario = document.getElementById("domiciliario").value;

        if (!cliente || !telefono || !direccion || !nombreDomiciliario) {
            alert("Completa los datos del cliente y selecciona un domiciliario.");
            return;
        }

        if (carritoPedido.length === 0) {
            alert("Primero agrega al menos un producto al pedido.");
            return;
        }

        const inventario = JSON.parse(localStorage.getItem("inventario")) || [];
        const domiciliarios = JSON.parse(localStorage.getItem("domiciliarios")) || [];

        const domiciliario = domiciliarios.find(function(item) {
            return item.nombre === nombreDomiciliario &&
                   item.estado === "Disponible";
        });

        if (!domiciliario) {
            alert("El domiciliario seleccionado no está disponible.");
            return;
        }

        // Validar todas las existencias antes de descontar
        for (let i = 0; i < carritoPedido.length; i++) {

            const item = carritoPedido[i];

            const existencia = inventario.find(function(producto) {
                return producto.nombre === item.nombre;
            });

            if (!existencia || existencia.cantidad < item.cantidad) {
                alert("No hay suficientes existencias de: " + item.nombre);
                return;
            }
        }

        // Descontar productos del inventario
        carritoPedido.forEach(function(item) {

            const existencia = inventario.find(function(producto) {
                return producto.nombre === item.nombre;
            });

            existencia.cantidad -= item.cantidad;
        });

        localStorage.setItem("inventario", JSON.stringify(inventario));

        // Calcular total
        const total = carritoPedido.reduce(function(suma, item) {
            return suma + item.subtotal;
        }, 0);

        // Crear pedido
        const nuevoPedido = {
            cliente: cliente,
            telefono: telefono,
            direccion: direccion,
            productos: carritoPedido.map(function(item) {
                return {
                    nombre: item.nombre,
                    precio: item.precio,
                    cantidad: item.cantidad,
                    subtotal: item.subtotal
                };
            }),
            domiciliario: nombreDomiciliario,
            telefonoDomiciliario: domiciliario.telefono,
            total: total,
            estado: "Pendiente"
        };

        pedidos.push(nuevoPedido);

        // Marcar domiciliario como ocupado
        const posicionDomiciliario = domiciliarios.findIndex(function(item) {
            return item.nombre === nombreDomiciliario;
        });

        if (posicionDomiciliario !== -1) {
            domiciliarios[posicionDomiciliario].estado = "Ocupado";
        }

        localStorage.setItem("domiciliarios", JSON.stringify(domiciliarios));

        guardarPedidos();

        // Limpiar carrito y formulario
        carritoPedido = [];

        formulario.reset();

        mostrarCarritoPedido();
        mostrarPedidos();
        cargarProductosPedido();
        cargarDomiciliariosPedido();

        if (typeof mostrarInventario === "function") {
            mostrarInventario();
        }

        if (typeof mostrarDomiciliarios === "function") {
            mostrarDomiciliarios();
        }

        if (typeof actualizarInicio === "function") {
            actualizarInicio();
        }

        if (typeof actualizarReportes === "function") {
            actualizarReportes();
        }

        alert("¡Pedido registrado correctamente!");
    });
});

// Buscar pedidos por cliente, teléfono y estado
function buscarPedidos() {

    const campoBusqueda = document.getElementById("buscarPedido");
    const filtro = document.getElementById("filtroEstado");

    const texto = campoBusqueda
        ? campoBusqueda.value.toLowerCase().trim()
        : "";

    const estadoSeleccionado = filtro ? filtro.value : "";

    const tabla = document.getElementById("tablaPedidos");

    if (!tabla) return;

    tabla.innerHTML = "";

    pedidos.forEach(function(pedido, indice) {

        const cliente = pedido.cliente.toLowerCase();
        const telefono = pedido.telefono.toLowerCase();

        const coincideTexto =
            cliente.includes(texto) || telefono.includes(texto);

        const coincideEstado =
            !estadoSeleccionado || pedido.estado === estadoSeleccionado;

        if (coincideTexto && coincideEstado) {

            const fila = document.createElement("tr");

            const productosTexto = pedido.productos
                ? pedido.productos.map(function(item) {
                    return item.nombre + " x " + item.cantidad;
                }).join(", ")
                : pedido.producto;

            fila.innerHTML = `
                <td>${pedido.cliente}</td>
                <td>${pedido.telefono}</td>
                <td>${productosTexto}</td>
                <td>${pedido.domiciliario || "Sin asignar"}</td>
                <td>$${Number(pedido.total).toLocaleString("es-CO")}</td>
                <td>${pedido.estado}</td>
                <td>
                    <button onclick="cambiarEstadoPedido(${indice})"
                        ${pedido.estado === "Entregado" ? "disabled" : ""}>
                        ${pedido.estado === "Entregado" ? "Finalizado" : "Avanzar estado"}
                    </button>
                </td>
            `;

            tabla.appendChild(fila);
        }
    });
}

// Cambiar estado del pedido
function cambiarEstadoPedido(indice) {

    const estados = [
        "Pendiente",
        "En preparación",
        "En camino",
        "Entregado"
    ];

    const estadoActual = pedidos[indice].estado;
    const posicion = estados.indexOf(estadoActual);

    if (posicion === -1 || posicion === estados.length - 1) {
        return;
    }

    pedidos[indice].estado = estados[posicion + 1];

    // Liberar domiciliario al entregar el pedido
    if (pedidos[indice].estado === "Entregado") {

        const domiciliarios = JSON.parse(localStorage.getItem("domiciliarios")) || [];

        const domiciliario = domiciliarios.find(function(item) {
            return item.nombre === pedidos[indice].domiciliario;
        });

        if (domiciliario) {
            domiciliario.estado = "Disponible";

            localStorage.setItem("domiciliarios", JSON.stringify(domiciliarios));
        }

        cargarDomiciliariosPedido();

        if (typeof mostrarDomiciliarios === "function") {
            mostrarDomiciliarios();
        }
    }

    guardarPedidos();

    mostrarPedidos();

    if (typeof actualizarInicio === "function") {
        actualizarInicio();
    }

    if (typeof actualizarReportes === "function") {
        actualizarReportes();
    }

    alert("El pedido ahora está: " + pedidos[indice].estado);
}
