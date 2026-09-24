/* =========================================
   GOLDEN PIZZERIA
   SISTEMA DEL MENÚ Y CARRITO
   ========================================= */


/* =========================================
   PRODUCTOS
   ========================================= */

const productos = [

    /* ---------- PIZZAS ---------- */

    {
        id: 1,
        nombre: "Pizza Clásica",
        categoria: "pizza",
        descripcion: "Pizza artesanal preparada al horno.",
        precio: 25.00,
        icono: "🍕",
        disponible: true
    },

    {
        id: 2,
        nombre: "Pizza Golden",
        categoria: "pizza",
        descripcion: "Nuestra especialidad de la casa.",
        precio: 32.00,
        icono: "🍕",
        disponible: true
    },

    {
        id: 3,
        nombre: "Pizza Familiar",
        categoria: "pizza",
        descripcion: "Ideal para compartir en familia.",
        precio: 38.00,
        icono: "🍕",
        disponible: true
    },


    /* ---------- FRAPPÉS ---------- */

    {
        id: 4,
        nombre: "Frappé de Fresa",
        categoria: "frappe",
        descripcion: "Frappé cremoso con sabor a fresa.",
        precio: 10.00,
        icono: "🍓",
        disponible: true
    },

    {
        id: 5,
        nombre: "Frappé de Mango",
        categoria: "frappe",
        descripcion: "Refrescante frappé de mango.",
        precio: 10.00,
        icono: "🥭",
        disponible: true
    },

    {
        id: 6,
        nombre: "Frappé de Maracuyá",
        categoria: "frappe",
        descripcion: "Frappé de maracuyá.",
        precio: 10.00,
        icono: "🥭",
        disponible: true
    },

    {
        id: 7,
        nombre: "Frappé Oreo",
        categoria: "frappe",
        descripcion: "Cremoso frappé con Oreo.",
        precio: 12.00,
        icono: "🍪",
        disponible: true
    },

    {
        id: 8,
        nombre: "Frappé Cappuccino",
        categoria: "frappe",
        descripcion: "Frappé con sabor a cappuccino.",
        precio: 12.00,
        icono: "☕",
        disponible: true
    },

    {
        id: 9,
        nombre: "Frappé de Lúcuma",
        categoria: "frappe",
        descripcion: "Cremoso frappé de lúcuma.",
        precio: 12.00,
        icono: "🥤",
        disponible: true
    },


    /* ---------- BEBIDAS CALIENTES ---------- */

    {
        id: 10,
        nombre: "Mate",
        categoria: "caliente",
        descripcion: "Mate caliente para acompañar tu momento.",
        precio: 5.00,
        icono: "🍵",
        disponible: true
    },

    {
        id: 11,
        nombre: "Infusión",
        categoria: "caliente",
        descripcion: "Infusión caliente a elección.",
        precio: 5.00,
        icono: "☕",
        disponible: true
    },


    /* ---------- BEBIDAS FRÍAS ---------- */

    {
        id: 12,
        nombre: "Limonada",
        categoria: "fria",
        descripcion: "Limonada natural y refrescante.",
        precio: 7.00,
        icono: "🍋",
        disponible: true
    },

    {
        id: 13,
        nombre: "Limonada Frozen",
        categoria: "fria",
        descripcion: "Limonada frozen bien refrescante.",
        precio: 9.00,
        icono: "🧊",
        disponible: true
    },

    {
        id: 14,
        nombre: "Chicha Morada",
        categoria: "fria",
        descripcion: "Chicha morada tradicional.",
        precio: 7.00,
        icono: "🥤",
        disponible: true
    },

    {
        id: 15,
        nombre: "Chicha Morada Frozen",
        categoria: "fria",
        descripcion: "Chicha morada en versión frozen.",
        precio: 9.00,
        icono: "🧊",
        disponible: true
    }

];


/* =========================================
   CARRITO
   ========================================= */

let carrito = [];


/* =========================================
   MOSTRAR PRODUCTOS
   ========================================= */

function mostrarProductos(lista = productos) {

    const contenedor = document.getElementById("productos");

    contenedor.innerHTML = "";


    lista.forEach(producto => {

        const tarjeta = document.createElement("div");

        tarjeta.className = "producto";


        tarjeta.innerHTML = `

            <div class="producto-imagen">
                ${producto.icono}
            </div>

            <div class="producto-info">

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    ${producto.descripcion}
                </p>

                <div class="producto-footer">

                    <span class="precio">
                        S/ ${producto.precio.toFixed(2)}
                    </span>

                    ${
                        producto.disponible

                        ?

                        `
                        <button
                            class="btn-agregar"
                            onclick="agregarAlCarrito(${producto.id})"
                        >
                            + AGREGAR
                        </button>
                        `

                        :

                        `
                        <button
                            class="btn-agregar"
                            disabled
                        >
                            AGOTADO
                        </button>
                        `
                    }

                </div>

            </div>
        `;


        contenedor.appendChild(tarjeta);

    });

}


/* =========================================
   FILTRAR PRODUCTOS
   ========================================= */

function filtrarProductos(categoria) {

    let lista;

    if (categoria === "todos") {

        lista = productos;

    } else {

        lista = productos.filter(
            producto => producto.categoria === categoria
        );

    }


    mostrarProductos(lista);


    /* Activar botón seleccionado */

    const botones =
        document.querySelectorAll(".categorias button");


    botones.forEach(boton => {

        boton.classList.remove("activo");

    });


    const botonSeleccionado =
        [...botones].find(
            boton =>
                boton.getAttribute("onclick") ===
                `filtrarProductos('${categoria}')`
        );


    if (botonSeleccionado) {

        botonSeleccionado.classList.add("activo");

    }

}


/* =========================================
   AGREGAR AL CARRITO
   ========================================= */

function agregarAlCarrito(id) {

    const producto =
        productos.find(
            producto => producto.id === id
        );


    if (!producto || !producto.disponible) {

        return;

    }


    const productoExistente =
        carrito.find(
            item => item.id === id
        );


    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({

            id: producto.id,

            nombre: producto.nombre,

            precio: producto.precio,

            cantidad: 1

        });

    }


    actualizarCarrito();

}


/* =========================================
   ACTUALIZAR CARRITO
   ========================================= */

function actualizarCarrito() {

    const contenedor =
        document.getElementById("carrito-productos");


    const contador =
        document.getElementById("contador-carrito");


    const totalElemento =
        document.getElementById("total");


    /* Contar productos */

    const cantidadTotal =
        carrito.reduce(
            (total, item) =>
                total + item.cantidad,
            0
        );


    contador.textContent = cantidadTotal;


    /* Carrito vacío */

    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>

        `;

        totalElemento.textContent = "S/ 0.00";

        return;

    }


    /* Mostrar productos */

    contenedor.innerHTML = "";


    carrito.forEach(item => {

        const elemento =
            document.createElement("div");


        elemento.className = "carrito-item";


        elemento.innerHTML = `

            <div>

                <h4>
                    ${item.nombre}
                </h4>

                <small>
                    ${item.cantidad} x
                    S/ ${item.precio.toFixed(2)}
                </small>

            </div>

            <strong>
                S/
                ${(item.precio * item.cantidad).toFixed(2)}
            </strong>

            <button
                class="btn-eliminar"
                onclick="eliminarDelCarrito(${item.id})"
            >
                ✕
            </button>

        `;


        contenedor.appendChild(elemento);

    });


    /* Calcular total */

    const total =
        carrito.reduce(
            (suma, item) =>
                suma + item.precio * item.cantidad,
            0
        );


    totalElemento.textContent =
        `S/ ${total.toFixed(2)}`;

}


/* =========================================
   ELIMINAR DEL CARRITO
   ========================================= */

function eliminarDelCarrito(id) {

    const producto =
        carrito.find(
            item => item.id === id
        );


    if (!producto) {

        return;

    }


    if (producto.cantidad > 1) {

        producto.cantidad--;

    } else {

        carrito =
            carrito.filter(
                item => item.id !== id
            );

    }


    actualizarCarrito();

}


/* =========================================
   ABRIR CARRITO
   ========================================= */

function mostrarCarrito() {

    document
        .getElementById("carrito-panel")
        .classList.add("abierto");


    document
        .getElementById("overlay")
        .classList.add("activo");

}


/* =========================================
   CERRAR CARRITO
   ========================================= */

function cerrarCarrito() {

    document
        .getElementById("carrito-panel")
        .classList.remove("abierto");


    document
        .getElementById("overlay")
        .classList.remove("activo");

}


/* =========================================
   IR AL MENÚ
   ========================================= */

function irAlMenu() {

    document
        .getElementById("menu")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================
   CONTINUAR AL PAGO
   ========================================= */

function irAlPago() {

    if (carrito.length === 0) {

        alert(
            "Tu carrito está vacío. Agrega algún producto antes de continuar."
        );

        return;

    }


    alert(
        "En el siguiente paso construiremos la pantalla de pago con Yape, tarjeta y efectivo."
    );

}


/* =========================================
   INICIAR PÁGINA
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        mostrarProductos();

        actualizarCarrito();

    }
);
