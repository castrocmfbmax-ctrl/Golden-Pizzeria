/* =========================================================
   GOLDEN PIZZERIA - SISTEMA LÓGICO Y SELECCIÓN DE FRAPPÉS
========================================================= */

let carrito = [];
let metodoPagoSeleccionado = "yape";
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
        if (cartCount) cartCount.innerText = carrito.length;
        if (cartTotal) cartTotal.innerText = `S/ ${total.toFixed(2)}`;
    } else {
        if (cartBar) cartBar.classList.add("hidden");
    }
}

function vaciarPedido() {
    carrito = [];
    actualizarCarritoUI();
}

/* --- FILTROS DE CATEGORÍA --- */
function filterCategory(cat) {
    const cards = document.querySelectorAll(".card");
    const btns = document.querySelectorAll(".filter-btn");

    btns.forEach(btn => btn.classList.remove("active"));
    if (event && event.target) {
        event.target.classList.add("active");
    }

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

/* --- MODAL DE TAMAÑOS DE PIZZA --- */
function abrirModalPizza(nombre, pPersonal, pMediana, pFamiliar) {
    pizzaActual = nombre;

    const modal = document.getElementById("pizza-modal");
    const titulo = document.getElementById("pizza-modal-title");
    const container = document.getElementById("pizza-modal-sizes");

    if (!modal || !container) return;

    if (titulo) titulo.innerText = `Pizza ${nombre}`;

    let htmlButtons = "";
    if (pPersonal !== null && pPersonal !== undefined) {
        htmlButtons += `<button type="button" class="btn-size" style="padding:12px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="seleccionarTamanoPizza('Personal', ${pPersonal})">Personal - S/ ${parseFloat(pPersonal).toFixed(2)}</button>`;
    }
    if (pMediana !== null && pMediana !== undefined) {
        htmlButtons += `<button type="button" class="btn-size" style="padding:12px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="seleccionarTamanoPizza('Mediana', ${pMediana})">Mediana - S/ ${parseFloat(pMediana).toFixed(2)}</button>`;
    }
    if (pFamiliar !== null && pFamiliar !== undefined) {
        htmlButtons += `<button type="button" class="btn-size" style="padding:12px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="seleccionarTamanoPizza('Familiar', ${pFamiliar})">Familiar - S/ ${parseFloat(pFamiliar).toFixed(2)}</button>`;
    }

    container.innerHTML = htmlButtons;
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

/* --- MODAL DE SABORES DE FRAPPÉ --- */
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

/* --- MODAL DE PAGO Y RASTREO --- */
function abrirPago(e) {
    if (e) e.preventDefault();
    const overlay = document.getElementById("payment-overlay");
    const summaryList = document.getElementById("payment-summary-list");
    const summaryTotal = document.getElementById("payment-total");

    if (!overlay) return;

    if (summaryList) {
        let html = "";
        let total = 0;
        carrito.forEach((item) => {
            html += `<div style="display:flex; justify-content:space-between; margin-bottom:5px; border-bottom:1px solid #222; padding-bottom:3px; font-size:0.85rem; color:#ccc;">
                <span>• ${item.nombre}</span>
                <span style="color:#D4AF37">S/ ${item.precio.toFixed(2)}</span>
            </div>`;
            total += item.precio;
        });
        summaryList.innerHTML = html;
        if (summaryTotal) summaryTotal.innerText = `Total: S/ ${total.toFixed(2)}`;
    }

    overlay.classList.remove("hidden");
    overlay.style.display = "flex";
    seleccionarPago('yape');
}

function cerrarPago() {
    const overlay = document.getElementById("payment-overlay");
    if (overlay) {
        overlay.classList.add("hidden");
        overlay.style.display = "none";
    }
}

function seleccionarPago(tipo) {
    metodoPagoSeleccionado = tipo;
    const secYape = document.getElementById("section-yape");
    const secTarjeta = document.getElementById("section-tarjeta");
    const secEfectivo = document.getElementById("section-efectivo");

    const btnYape = document.getElementById("payment-yape");
    const btnTarjeta = document.getElementById("payment-tarjeta");
    const btnEfectivo = document.getElementById("payment-efectivo");

    [btnYape, btnTarjeta, btnEfectivo].forEach(b => { if (b) b.classList.remove("selected"); });

    if (secYape) secYape.style.display = (tipo === 'yape') ? 'block' : 'none';
    if (secTarjeta) secTarjeta.style.display = (tipo === 'tarjeta') ? 'block' : 'none';
    if (secEfectivo) secEfectivo.style.display = (tipo === 'efectivo') ? 'block' : 'none';

    if (tipo === 'yape' && btnYape) btnYape.classList.add("selected");
    if (tipo === 'tarjeta' && btnTarjeta) btnTarjeta.classList.add("selected");
    if (tipo === 'efectivo' && btnEfectivo) btnEfectivo.classList.add("selected");
}

function confirmarPedido() {
    if (carrito.length === 0) return;

    const numeroWhatsApp = "51979707173";
    let textoDetalle = "";
    let total = 0;

    carrito.forEach((item) => {
        textoDetalle += `• ${item.nombre} - S/ ${item.precio.toFixed(2)}\n`;
        total += item.precio;
    });

    let mensaje = `*¡NUEVO PEDIDO - GOLDEN PIZZERIA!* 🍕\n\n`;
    mensaje += `*Detalle del Pedido:*\n${textoDetalle}\n`;
    mensaje += `*TOTAL:* S/ ${total.toFixed(2)}\n`;
    mensaje += `*Método de Pago:* ${metodoPagoSeleccionado.toUpperCase()}\n\n`;
    mensaje += `📍 *Ubicación del local:* AV ARGENTINA 1432\n`;
    mensaje += `_Pedido realizado desde la web de Golden Pizzeria_`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    cerrarPago();
    vaciarPedido();
}

function consultarEstadoCodigo() {
    const input = document.getElementById("input-tracking-code");
    if (input && input.value.trim() !== "") {
        const trackOverlay = document.getElementById("tracking-overlay");
        const orderCode = document.getElementById("order-code");
        if (orderCode) orderCode.innerText = input.value.trim().toUpperCase();
        if (trackOverlay) {
            trackOverlay.classList.remove("hidden");
            trackOverlay.style.display = "flex";
        }
    } else {
        alert("Por favor ingresa un código de pedido válido.");
    }
}

function cerrarTracking() {
    const trackOverlay = document.getElementById("tracking-overlay");
    if (trackOverlay) {
        trackOverlay.classList.add("hidden");
        trackOverlay.style.display = "none";
    }
}
