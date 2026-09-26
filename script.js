/* =========================================================
   GOLDEN PIZZERIA - SISTEMA LÓGICO DEL CARRITO Y MODALES
========================================================= */

let carrito = [];
let metodoPagoSeleccionado = "Yape / Plin";
let pizzaActual = "";
let preciosPizzaActual = {};

/* --- AGREGAR Y MANEJAR PEDIDOS --- */
function agregarPedido(nombre, precio) {
    carrito.push({ nombre: nombre, precio: parseFloat(precio) });
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const cartBar = document.getElementById("cart-bar");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    if (carrito.length > 0) {
        if (cartBar) cartBar.classList.remove("hidden");
        let total = carrito.reduce((sum, item) => sum + item.precio, 0);
        if (cartCount) cartCount.innerText = `${carrito.length} ítem(s)`;
        if (cartTotal) cartTotal.innerText = `S/ ${total.toFixed(2)}`;
    } else {
        if (cartBar) cartBar.classList.add("hidden");
    }
}

function limpiarCarrito() {
    carrito = [];
    actualizarCarritoUI();
}

/* --- FILTROS DE CATEGORÍA Y BÚSQUEDA --- */
function filtrarCategoria(cat) {
    const cards = document.querySelectorAll(".card");
    const btns = document.querySelectorAll(".filter-btn");

    btns.forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");

    cards.forEach(card => {
        if (cat === 'todas') {
            card.style.display = "flex";
        } else if (card.classList.contains(cat)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

function filtrarPorNombre() {
    const input = document.getElementById("search-input").value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const title = card.querySelector("h3").innerText.toLowerCase();
        if (title.includes(input)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

/* --- MODAL PARA TAMAÑOS DE PIZZA --- */
function abrirModalPizza(nombre, precios) {
    pizzaActual = nombre;
    preciosPizzaActual = precios;

    const modal = document.getElementById("pizza-modal");
    const titulo = document.getElementById("pizza-modal-title");
    const container = document.getElementById("pizza-modal-sizes");

    if (!modal || !container) return;

    if (titulo) titulo.innerText = `Pizza ${nombre}`;

    container.innerHTML = `
        <button type="button" class="btn-size" style="padding:10px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="seleccionarTamanoPizza('Personal', ${precios.personal})">Personal - S/ ${precios.personal.toFixed(2)}</button>
        <button type="button" class="btn-size" style="padding:10px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="seleccionarTamanoPizza('Mediana', ${precios.mediana})">Mediana - S/ ${precios.mediana.toFixed(2)}</button>
        <button type="button" class="btn-size" style="padding:10px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="seleccionarTamanoPizza('Familiar', ${precios.familiar})">Familiar - S/ ${precios.familiar.toFixed(2)}</button>
    `;

    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

function seleccionarTamanoPizza(tamano, precio) {
    agregarPedido(`Pizza ${pizzaActual} (${tamano})`, precio);
    cerrarModalPizza();
}

function cerrarModalPizza() {
    const modal = document.getElementById("pizza-modal");
    if (modal) {
        modal.classList.add("hidden");
        modal.style.display = "none";
    }
}

/* --- MODAL PARA SABORES DE FRAPPÉ --- */
function abrirModalFrappe(tipo) {
    const modal = document.getElementById("pizza-modal");
    const titulo = document.getElementById("pizza-modal-title");
    const container = document.getElementById("pizza-modal-sizes");

    if (!modal || !container) return;

    let sabores = [];
    let precio = 0;

    if (tipo === 'fruta') {
        if (titulo) titulo.innerText = "Frappé de Fruta (S/ 10.00)";
        sabores = ["Maracuyá", "Fresa", "Mango", "Lúcuma"];
        precio = 10;
    } else if (tipo === 'especial') {
        if (titulo) titulo.innerText = "Frappé Especial (S/ 9.00)";
        sabores = ["Cappuccino", "Oreo"];
        precio = 9;
    }

    let htmlButtons = "";
    sabores.forEach(sabor => {
        htmlButtons += `<button type="button" class="btn-size" style="padding:12px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="seleccionarSaborFrappe('${sabor}', ${precio})">Sabor: ${sabor}</button>`;
    });

    container.innerHTML = htmlButtons;

    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

function seleccionarSaborFrappe(sabor, precio) {
    agregarPedido(`Frappé de ${sabor}`, precio);
    cerrarModalPizza();
}

/* --- MODAL DE PAGO Y CONFIRMACIÓN --- */
function abrirModalPago() {
    const modal = document.getElementById("payment-modal");
    const summaryList = document.getElementById("cart-summary-list");

    if (!modal) return;

    if (summaryList) {
        let html = "";
        carrito.forEach((item) => {
            html += `<div style="display:flex; justify-content:space-between; margin-bottom:5px; border-bottom:1px solid #222; padding-bottom:3px;">
                <span>• ${item.nombre}</span>
                <span style="color:#D4AF37">S/ ${item.precio.toFixed(2)}</span>
            </div>`;
        });
        summaryList.innerHTML = html;
    }

    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

function cerrarModalPago() {
    const modal = document.getElementById("payment-modal");
    if (modal) {
        modal.classList.add("hidden");
        modal.style.display = "none";
    }
}

function cambiarTipoEntrega() {
    const tipo = document.getElementById("tipo-entrega").value;
    const campoDireccion = document.getElementById("campo-direccion");
    if (campoDireccion) {
        campoDireccion.style.display = (tipo === "Delivery") ? "block" : "none";
    }
}

function seleccionarMetodo(metodo, elemento) {
    metodoPagoSeleccionado = metodo;
    const methods = document.querySelectorAll(".payment-method");
    methods.forEach(m => m.classList.remove("selected"));
    elemento.classList.add("selected");

    const payYape = document.getElementById("pay-yape");
    const payEfectivo = document.getElementById("pay-efectivo");

    if (metodo === 'Yape / Plin') {
        if (payYape) payYape.classList.add("active");
        if (payEfectivo) payEfectivo.classList.remove("active");
    } else {
        if (payYape) payYape.classList.remove("active");
        if (payEfectivo) payEfectivo.classList.add("active");
    }
}

/* --- ENVÍO DE ORDEN A WHATSAPP --- */
function enviarWhatsApp() {
    if (carrito.length === 0) return;

    const numeroWhatsApp = "51979707173";
    const tipoEntrega = document.getElementById("tipo-entrega").value;
    const direccion = document.getElementById("cliente-direccion").value.trim();
    const montoEfectivo = document.getElementById("monto-efectivo").value.trim();

    if (tipoEntrega === "Delivery" && !direccion) {
        alert("Por favor, ingresa tu dirección para el delivery.");
        return;
    }

    let textoDetalle = "";
    let total = 0;

    carrito.forEach((item) => {
        textoDetalle += `• ${item.nombre} - S/ ${item.precio.toFixed(2)}\n`;
        total += item.precio;
    });

    let mensaje = `*¡NUEVO PEDIDO - GOLDEN PIZZERIA!* 🍕\n\n`;
    mensaje += `*Detalle de la Orden:*\n${textoDetalle}\n`;
    mensaje += `*TOTAL:* S/ ${total.toFixed(2)}\n`;
    mensaje += `*Modo de Entrega:* ${tipoEntrega}\n`;

    if (tipoEntrega === "Delivery") {
        mensaje += `*Ubicación / Dirección:* ${direccion}\n`;
    }

    mensaje += `*Método de Pago:* ${metodoPagoSeleccionado}\n`;

    if (metodoPagoSeleccionado === "Efectivo" && montoEfectivo) {
        mensaje += `*Paga con:* S/ ${montoEfectivo}\n`;
    }

    mensaje += `\n*¡Ubicación sugerida:* AV ARGENTINA 1432*\n`;
    mensaje += `_Enviado desde la web oficial de Golden Pizzeria_`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}
