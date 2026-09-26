/* =========================================================
   GOLDEN PIZZERIA - SISTEMA COMPLETO, CARRITO Y SEGURIDAD
========================================================= */

let carrito = [];
let metodoPagoSeleccionado = "yape";
let pizzaActual = "";
let comprobanteAdjunto = null;

/* --- SISTEMA DE SEGURIDAD ANTI-TROLLS --- */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.keyCode === 123 || 
       (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || 
       (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
    }
});

/* --- LÓGICA DEL CARRITO Y MANEJO DE CANTIDADES --- */
function agregarPedido(nombre, precio) {
    let itemExistente = carrito.find(item => item.nombre === nombre);
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ nombre: nombre, precio: parseFloat(precio), cantidad: 1 });
    }
    actualizarCarritoUI();
}

function cambiarCantidad(index, delta) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    actualizarCarritoUI();
    const overlay = document.getElementById("payment-overlay");
    if (overlay && overlay.style.display === "flex") {
        renderResumenPago();
    }
}

function actualizarCarritoUI() {
    const cartBar = document.getElementById("cart-bar");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    let totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    let totalPrecio = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    if (totalItems > 0) {
        if (cartBar) {
            cartBar.classList.remove("hidden");
            cartBar.style.display = "flex";
        }
        if (cartCount) cartCount.innerText = totalItems;
        if (cartTotal) cartTotal.innerText = `S/ ${totalPrecio.toFixed(2)}`;
    } else {
        if (cartBar) {
            cartBar.classList.add("hidden");
            cartBar.style.display = "none";
        }
        cerrarPago();
    }
}

function vaciarPedido() {
    carrito = [];
    comprobanteAdjunto = null;
    const fileInput = document.getElementById("receipt-file");
    if (fileInput) fileInput.value = "";
    const receiptName = document.getElementById("receipt-name");
    if (receiptName) receiptName.innerText = "";
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
        if (cat === 'todas' || card.classList.contains(cat)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

/* --- MODAL DE SELECCIÓN DE TAMAÑOS --- */
function abrirModalPizza(nombre, pPersonal, pMediana, pFamiliar) {
    pizzaActual = nombre;
    const modal = document.getElementById("pizza-modal");
    const titulo = document.getElementById("pizza-modal-title");
    const container = document.getElementById("pizza-modal-sizes");

    if (!modal || !container) return;

    if (titulo) titulo.innerText = `🍕 ${nombre}`;

    let htmlButtons = "";
    if (pPersonal) htmlButtons += `<button type="button" class="filter-btn" style="padding:12px;" onclick="seleccionarTamanoPizza('Personal', ${pPersonal})">Personal - S/ ${parseFloat(pPersonal).toFixed(2)}</button>`;
    if (pMediana) htmlButtons += `<button type="button" class="filter-btn" style="padding:12px;" onclick="seleccionarTamanoPizza('Mediana', ${pMediana})">Mediana - S/ ${parseFloat(pMediana).toFixed(2)}</button>`;
    if (pFamiliar) htmlButtons += `<button type="button" class="filter-btn" style="padding:12px;" onclick="seleccionarTamanoPizza('Familiar', ${pFamiliar})">Familiar - S/ ${parseFloat(pFamiliar).toFixed(2)}</button>`;

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

/* --- MODAL DE FRAPPÉS --- */
function abrirModalFrappe() {
    const modal = document.getElementById("frappe-modal");
    if (modal) {
        modal.classList.remove("hidden");
        modal.style.display = "flex";
    }
}

function seleccionarFrappe(sabor, precio) {
    agregarPedido(`Frappé de ${sabor}`, precio);
    cerrarModalFrappe();
}

function cerrarModalFrappe() {
    const modal = document.getElementById("frappe-modal");
    if (modal) {
        modal.classList.add("hidden");
        modal.style.display = "none";
    }
}

/* --- COMPROBANTE YAPE --- */
function mostrarNombreArchivo(input) {
    const container = document.getElementById("receipt-name");
    if (input.files && input.files[0]) {
        comprobanteAdjunto = input.files[0];
        container.innerText = `✅ Adjunto: ${input.files[0].name}`;
        container.style.color = "#25d366";
    } else {
        comprobanteAdjunto = null;
        container.innerText = "❌ Adjunto obligatorio";
        container.style.color = "#ff4d4d";
    }
}

/* --- MODAL DE PAGO Y RESUMEN DE COMPRA --- */
function abrirPago(e) {
    if (e) e.preventDefault();
    const overlay = document.getElementById("payment-overlay");
    if (!overlay) return;

    renderResumenPago();
    overlay.classList.remove("hidden");
    overlay.style.display = "flex";
    seleccionarPago('yape');
}

function renderResumenPago() {
    const summaryList = document.getElementById("payment-summary-list");
    const summaryTotal = document.getElementById("payment-total");

    if (summaryList) {
        let html = "";
        let total = 0;
        carrito.forEach((item, index) => {
            let subtotal = item.precio * item.cantidad;
            total += subtotal;
            html += `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #222; padding-bottom:5px; font-size:0.85rem;">
                <span>• ${item.nombre}</span>
                <div>
                  <button class="qty-btn" onclick="cambiarCantidad(${index}, -1)">-</button>
                  <span style="color:#D4AF37; font-weight:bold;">${item.cantidad}</span>
                  <button class="qty-btn" onclick="cambiarCantidad(${index}, 1)">+</button>
                  <span style="color:#25d366; margin-left:8px;">S/ ${subtotal.toFixed(2)}</span>
                </div>
            </div>`;
        });
        summaryList.innerHTML = html;
        if (summaryTotal) summaryTotal.innerText = `TOTAL: S/ ${total.toFixed(2)}`;
    }
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

/* --- ENVÍO DIRECTO A WHATSAPP --- */
function confirmarPedido() {
    if (carrito.length === 0) return;

    const selectSede = document.getElementById("select-sede");
    const sedeSeleccionada = selectSede ? selectSede.value : "";

    if (!sedeSeleccionada) {
        alert("📍 Por favor selecciona tu sede de atención.");
        return;
    }

    if (metodoPagoSeleccionado === 'yape' && !comprobanteAdjunto) {
        alert("⚠️ Por favor adjunta el comprobante Yape / Plin.");
        return;
    }

    const numeroWhatsApp = "51979707173";
    let textoDetalle = "";
    let total = 0;

    carrito.forEach((item) => {
        let subtotal = item.precio * item.cantidad;
        textoDetalle += `• ${item.cantidad}x ${item.nombre} - S/ ${subtotal.toFixed(2)}\n`;
        total += subtotal;
    });

    let mensaje = `*¡NUEVO PEDIDO - GOLDEN PIZZERIA!* 🍕\n\n`;
    mensaje += `📍 *SEDE:* ${sedeSeleccionada}\n\n`;
    mensaje += `*Detalle del Pedido:*\n${textoDetalle}\n`;
    mensaje += `*TOTAL:* S/ ${total.toFixed(2)}\n`;
    mensaje += `*Método de Pago:* ${metodoPagoSeleccionado.toUpperCase()}\n`;
    
    if (metodoPagoSeleccionado === 'yape') {
        mensaje += `*Comprobante:* Adjuntado en el chat 📄\n`;
    }

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    cerrarPago();
    vaciarPedido();
}
