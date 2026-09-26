/* =========================================================
   GOLDEN PIZZERIA - CONFIGURACIÓN DE SEDES Y NÚMEROS
========================================================= */

const CONFIG_SEDES = {
    "mariano_melgar": {
        nombre: "Av. Argentina 1432 - Mariano Melgar",
        telefonoWhatsapp: "51994710034",
        numeroYape: "994 710 034"
    },
    "paucarpata_vallejo": {
        nombre: "Calle Cesar Vallejo 100 - BADEN (Paucarpata)",
        telefonoWhatsapp: "51932439922",
        numeroYape: "932 439 922"
    },
    "paucarpata_grau": {
        nombre: "Av. Miguel Grau 736 - Paucarpata",
        telefonoWhatsapp: "51992911116",
        numeroYape: "992 911 116"
    }
};

let carrito = [];
let metodoPagoSeleccionado = "yape";
let pizzaActual = "";

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

/* --- ACTUALIZAR DATOS SEGÚN SEDE --- */
function actualizarDatosSede() {
    const claveSede = document.getElementById("select-sede").value;
    const datosSede = CONFIG_SEDES[claveSede];
    const lblYape = document.getElementById("yape-numero-pantalla");
    if (lblYape && datosSede) {
        lblYape.innerText = datosSede.numeroYape;
    }
}

/* --- CONTROLAR CAMPO DIRECCIÓN --- */
function toggleDireccionField() {
    const modalidad = document.querySelector('input[name="tipo_entrega"]:checked').value;
    const campoDireccion = document.getElementById("campo-direccion");
    if (campoDireccion) {
        campoDireccion.style.display = (modalidad === "Delivery") ? "block" : "none";
    }
}

/* --- MODAL DE PAGO --- */
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

    actualizarDatosSede();
    toggleDireccionField();
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

function mostrarNombreArchivo(input) {
    const container = document.getElementById("receipt-name");
    if (input.files && input.files[0]) {
        container.innerText = `📄 Comprobante listo: ${input.files[0].name}`;
    } else {
        container.innerText = "";
    }
}

/* --- CONFIRMACIÓN Y ENVÍO A WHATSAPP DE LA SEDE CORRESPONDIENTE --- */
function confirmarPedido() {
    if (carrito.length === 0) return;

    const claveSede = document.getElementById("select-sede").value;
    const datosSede = CONFIG_SEDES[claveSede];

    const tipoEntrega = document.querySelector('input[name="tipo_entrega"]:checked').value;
    const direccionInput = document.getElementById("input-direccion").value.trim();

    if (tipoEntrega === "Delivery" && direccionInput === "") {
        alert("Por favor, ingresa tu dirección para el envío por delivery.");
        return;
    }

    let textoDetalle = "";
    let total = 0;

    carrito.forEach((item) => {
        textoDetalle += `• ${item.nombre} - S/ ${item.precio.toFixed(2)}\n`;
        total += item.precio;
    });

    let mensaje = `*¡NUEVO PEDIDO - GOLDEN PIZZERIA!* 🍕\n\n`;
    mensaje += `📍 *SEDE:* ${datosSede.nombre}\n`;
    mensaje += `🛵 *MODALIDAD:* ${tipoEntrega}\n`;

    if (tipoEntrega === "Delivery") {
        mensaje += `🏠 *DIRECCIÓN:* ${direccionInput}\n`;
    }

    mensaje += `\n*Detalle del Pedido:*\n${textoDetalle}\n`;
    mensaje += `*TOTAL:* S/ ${total.toFixed(2)}\n`;
    mensaje += `*Método de Pago:* ${metodoPagoSeleccionado.toUpperCase()}\n\n`;
    mensaje += `_Pedido generado desde la página web_`;

    const url = `https://wa.me/${datosSede.telefonoWhatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    cerrarPago();
    vaciarPedido();
}
