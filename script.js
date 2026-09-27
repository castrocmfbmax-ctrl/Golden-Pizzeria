/* =========================================================
   GOLDEN PIZZERIA - SISTEMA COMPLETO CON CONTROL DE SEDES
========================================================= */

const CONFIG_SEDES = {
    "mariano_melgar": {
        nombre: "Av. Argentina 1432 - Mariano Melgar",
        telefonoWhatsapp: "51994710034",
        numeroYape: "994 710 034",
        mesas: 6
    },
    "paucarpata_vallejo": {
        nombre: "Calle Cesar Vallejo 100 - BADEN (Paucarpata)",
        telefonoWhatsapp: "51932439922",
        numeroYape: "932 439 922",
        mesas: 4
    },
    "paucarpata_grau": {
        nombre: "Av. Miguel Grau 736 - Paucarpata",
        telefonoWhatsapp: "51992911116",
        numeroYape: "992 911 116",
        mesas: 4
    }
};

let carrito = [];
let metodoPagoSeleccionado = "yape";
let pizzaActual = "";
let tamanoSeleccionadoTemp = null;
let precioBaseTemp = 0;
let costoExtraQuesoTemp = 0;
let costoExtraEmbutidoTemp = 0;
let ubicacionGpsLink = "";

/* --- AGREGAR Y MANEJAR CANTIDADES --- */
function agregarPedido(nombre, precio, detallesExtra = "") {
    const nombreCompleto = detallesExtra ? nombre + " (" + detallesExtra + ")" : nombre;
    const itemExistente = carrito.find(item => item.nombre === nombreCompleto);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ nombre: nombreCompleto, precio: parseFloat(precio), cantidad: 1 });
    }
    actualizarCarritoUI();
}

function cambiarCantidad(index, cambio) {
    if (carrito[index]) {
        carrito[index].cantidad += cambio;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
    }
    actualizarCarritoUI();
    renderizarListaModal();
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
    renderizarListaModal();
}

function actualizarCarritoUI() {
    const cartBar = document.getElementById("cart-bar");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrecio = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    if (totalItems > 0) {
        if (cartBar) cartBar.classList.remove("hidden");
        if (cartCount) cartCount.innerText = totalItems;
        if (cartTotal) cartTotal.innerText = "S/ " + totalPrecio.toFixed(2);
    } else {
        if (cartBar) cartBar.classList.add("hidden");
        cerrarPago();
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
    if (window.event && window.event.target) {
        window.event.target.classList.add("active");
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

/* --- MODAL DE PIZZETAS (3 SABORES) --- */
function abrirModalPizzetas() {
    pizzaActual = "Pizzeta";
    const modal = document.getElementById("pizza-modal");
    const titulo = document.getElementById("pizza-modal-title");
    const container = document.getElementById("pizza-modal-sizes");
    const extraContainer = document.getElementById("extra-options-container");
    const btnConfirmContainer = document.getElementById("pizza-modal-confirm-btn");

    if (!modal || !container) return;

    if (titulo) titulo.innerText = "🍕🎯 Elegir Sabor de Pizzeta";
    if (extraContainer) extraContainer.style.display = "none";
    if (btnConfirmContainer) btnConfirmContainer.innerHTML = "";

    let html = `
        <button type="button" class="btn-size" style="padding:12px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="seleccionarPizzetaDirecta('Americana', 5)">Pizzeta Americana - S/ 5.00</button>
        <button type="button" class="btn-size" style="padding:12px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="seleccionarPizzetaDirecta('Hawaiana', 6)">Pizzeta Hawaiana - S/ 6.00</button>
        <button type="button" class="btn-size" style="padding:12px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="seleccionarPizzetaDirecta('Pepperoni', 7)">Pizzeta Pepperoni - S/ 7.00</button>
    `;

    container.innerHTML = html;
    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

function seleccionarPizzetaDirecta(sabor, precio) {
    agregarPedido("Pizzeta " + sabor, precio);
    cerrarModalPizza();
}

/* --- MODAL DE TAMAÑOS DE PIZZA Y EXTRAS OPCIONALES --- */
function abrirModalPizza(nombre, pPersonal, pMediana, pFamiliar) {
    pizzaActual = nombre;
    tamanoSeleccionadoTemp = null;

    const modal = document.getElementById("pizza-modal");
    const titulo = document.getElementById("pizza-modal-title");
    const container = document.getElementById("pizza-modal-sizes");
    const extraContainer = document.getElementById("extra-options-container");
    const btnConfirmContainer = document.getElementById("pizza-modal-confirm-btn");

    if (!modal || !container) return;

    if (titulo) titulo.innerText = "🍕 Pizza " + nombre;
    if (extraContainer) extraContainer.style.display = "none";

    document.getElementById("chk-extra-queso").checked = false;
    document.getElementById("chk-extra-embutido").checked = false;

    let htmlButtons = "";
    if (pPersonal !== null && pPersonal !== undefined) {
        htmlButtons += `<button type="button" class="btn-size" style="padding:12px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="prepararTamanoPizza('Personal', ${pPersonal}, 2, 2)">Personal - S/ ${parseFloat(pPersonal).toFixed(2)}</button>`;
    }
    if (pMediana !== null && pMediana !== undefined) {
        htmlButtons += `<button type="button" class="btn-size" style="padding:12px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="prepararTamanoPizza('Mediana', ${pMediana}, 3, 3)">Mediana - S/ ${parseFloat(pMediana).toFixed(2)}</button>`;
    }
    if (pFamiliar !== null && pFamiliar !== undefined) {
        htmlButtons += `<button type="button" class="btn-size" style="padding:12px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="prepararTamanoPizza('Familiar', ${pFamiliar}, 4, 4)">Familiar - S/ ${parseFloat(pFamiliar).toFixed(2)}</button>`;
    }

    container.innerHTML = htmlButtons;
    if (btnConfirmContainer) btnConfirmContainer.innerHTML = "";

    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

function prepararTamanoPizza(tamano, precioBase, costoQueso, costoEmbutido) {
    tamanoSeleccionadoTemp = tamano;
    precioBaseTemp = precioBase;
    costoExtraQuesoTemp = costoQueso;
    costoExtraEmbutidoTemp = costoEmbutido;

    document.getElementById("lbl-precio-queso").innerText = "+S/ " + costoQueso + ".00";
    document.getElementById("lbl-precio-embutido").innerText = "+S/ " + costoEmbutido + ".00";

    document.getElementById("extra-options-container").style.display = "block";

    const btnConfirmContainer = document.getElementById("pizza-modal-confirm-btn");
    btnConfirmContainer.innerHTML = `<button type="button" class="btn-add" style="width:100%; padding:12px;" onclick="confirmarAgregarPizzaConExtras()">+ Agregar Pizza ${tamano} al Pedido</button>`;
}

function confirmarAgregarPizzaConExtras() {
    let precioFinal = precioBaseTemp;
    let extrasTxt = [];

    const quiereQueso = document.getElementById("chk-extra-queso").checked;
    const quiereEmbutido = document.getElementById("chk-extra-embutido").checked;

    if (quiereQueso) {
        precioFinal += costoExtraQuesoTemp;
        extrasTxt.push("Extra Queso");
    }
    if (quiereEmbutido) {
        precioFinal += costoExtraEmbutidoTemp;
        extrasTxt.push("Extra Embutido");
    }

    const detalleStr = extrasTxt.length > 0 ? extrasTxt.join(" + ") : "";
    agregarPedido("Pizza " + pizzaActual + " (" + tamanoSeleccionadoTemp + ")", precioFinal, detalleStr);
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
    const extraContainer = document.getElementById("extra-options-container");
    const btnConfirmContainer = document.getElementById("pizza-modal-confirm-btn");

    if (!modal || !container) return;

    if (extraContainer) extraContainer.style.display = "none";
    if (btnConfirmContainer) btnConfirmContainer.innerHTML = "";

    let sabores = [];
    let precio = 0;

    if (tipo === 'fruta') {
        if (titulo) titulo.innerText = "🍧 Frappé de Fruta (S/ 10.00)";
        sabores = ["Maracuyá", "Fresa", "Mango", "Lúcuma"];
        precio = 10;
    } else if (tipo === 'especial') {
        if (titulo) titulo.innerText = "☕ Frappé Especial (S/ 9.00)";
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
    agregarPedido("Frappé de " + sabor, precio);
    cerrarModalPizza();
}

/* --- RESERVAS DE MESA --- */
function abrirModalReserva() {
    const modal = document.getElementById("reserva-modal");
    if (modal) {
        modal.classList.remove("hidden");
        modal.style.display = "flex";
    }
}

function cerrarModalReserva() {
    const modal = document.getElementById("reserva-modal");
    if (modal) {
        modal.classList.add("hidden");
        modal.style.display = "none";
    }
}

function confirmarReservaMesa() {
    const nombre = document.getElementById("reserva-nombre").value.trim();
    const telefono = document.getElementById("reserva-telefono").value.trim();
    const fecha = document.getElementById("reserva-fecha").value;
    const hora = document.getElementById("reserva-hora").value;
    const personas = document.getElementById("reserva-personas").value;
    const claveSede = document.getElementById("reserva-sede").value;
    const datosSede = CONFIG_SEDES[claveSede];

    if (!nombre || !telefono || !fecha || !hora) {
        alert("Por favor completa todos los campos de la reserva.");
        return;
    }

    const regexTelefonoPeru = /^9\d{8}$/;
    if (!regexTelefonoPeru.test(telefono)) {
        alert("Ingresa un número de celular válido en Perú (9 dígitos).");
        return;
    }

    let msg = "*RESERVA DE MESA EN LOCAL - GOLDEN PIZZERIA* 🪑\n\n";
    msg += "👤 *CLIENTE:* " + nombre + "\n";
    msg += "📱 *CELULAR:* " + telefono + "\n";
    msg += "📍 *SEDE:* " + datosSede.nombre + "\n";
    msg += "📅 *FECHA:* " + fecha + "\n";
    msg += "⏰ *HORA:* " + hora + "\n";
    msg += "👥 *PERSONAS:* " + personas + " personas\n";

    const url = "https://wa.me/" + datosSede.telefonoWhatsapp + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
    cerrarModalReserva();
}

/* --- CAPTURA DE NAVEGACIÓN GPS --- */
function obtenerUbicacionGPS() {
    const status = document.getElementById("gps-status");
    if (navigator.geolocation) {
        status.innerText = "Obteniendo ubicación...";
        navigator.geolocation.getCurrentPosition(function(pos) {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            ubicacionGpsLink = "https://www.google.com/maps?q=" + lat + "," + lon;
            status.innerText = "✅ Ubicación GPS capturada exitosamente.";
        }, function() {
            status.innerText = "❌ No se pudo obtener la ubicación automáticamente.";
        });
    } else {
        status.innerText = "Geolocalización no soportada en este navegador.";
    }
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

/* --- RENDERIZAR DETALLE CON BOTONES + Y - --- */
function renderizarListaModal() {
    const summaryList = document.getElementById("payment-summary-list");
    const summaryTotal = document.getElementById("payment-total");

    if (!summaryList) return;

    let html = "";
    let total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        html += `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; background:rgba(35,20,12,0.6); padding:8px 10px; border-radius:8px; border:1px solid #444;">
            <div style="flex:1;">
                <div style="font-size:0.85rem; color:#f5e6d3; font-weight:bold;">${item.nombre}</div>
                <div style="font-size:0.75rem; color:#D4AF37;">S/ ${item.precio.toFixed(2)} c/u</div>
            </div>
            
            <div style="display:flex; align-items:center; gap:8px;">
                <button type="button" onclick="cambiarCantidad(${index}, -1)" style="background:#d62828; color:white; border:none; width:26px; height:26px; border-radius:6px; font-weight:bold; cursor:pointer;">-</button>
                <span style="font-size:0.9rem; font-weight:bold; color:white; min-width:18px; text-align:center;">${item.cantidad}</span>
                <button type="button" onclick="cambiarCantidad(${index}, 1)" style="background:#25d366; color:white; border:none; width:26px; height:26px; border-radius:6px; font-weight:bold; cursor:pointer;">+</button>
                <button type="button" onclick="eliminarProducto(${index})" style="background:transparent; color:#aaa; border:none; font-size:1.1rem; cursor:pointer; margin-left:5px;">🗑️</button>
            </div>
        </div>`;
    });

    summaryList.innerHTML = html;
    if (summaryTotal) summaryTotal.innerText = "Total: S/ " + total.toFixed(2);
}

/* --- MODAL DE PAGO --- */
function abrirPago(e) {
    if (e) e.preventDefault();
    const overlay = document.getElementById("payment-overlay");

    if (!overlay) return;

    renderizarListaModal();
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
        container.innerText = "📄 Captura adjunta: " + input.files[0].name;
    } else {
        container.innerText = "";
    }
}

/* --- TEMPORIZADOR DE 35 MINUTOS --- */
function iniciarTemporizador() {
    const widget = document.getElementById("timer-widget");
    const display = document.getElementById("timer-display");
    if (!widget || !display) return;

    widget.classList.remove("hidden");
    let tiempoRestante = 35 * 60; // 35 minutos en segundos

    const intervalo = setInterval(() => {
        let min = Math.floor(tiempoRestante / 60);
        let seg = tiempoRestante % 60;
        display.innerText = (min < 10 ? "0" : "") + min + ":" + (seg < 10 ? "0" : "") + seg;

        if (tiempoRestante <= 0) {
            clearInterval(intervalo);
            display.innerText = "00:00";
            alert("⚠️ ATENCIÓN: Han transcurrido los 35 minutos. Recuerda que tu pizza puede perder temperatura.");
        }
        tiempoRestante--;
    }, 1000);
}

/* --- VALIDACIÓN ANTI-TROLLS Y ENVÍO A WHATSAPP --- */
function confirmarPedido() {
    if (carrito.length === 0) return;

    const nombreCliente = document.getElementById("input-nombre").value.trim();
    const telefonoCliente = document.getElementById("input-telefono").value.trim();

    if (nombreCliente === "") {
        alert("🛡️ SEGURIDAD ANTI-TROLLS: Por favor ingresa tu Nombre y Apellido obligatoriamente.");
        document.getElementById("input-nombre").focus();
        return;
    }

    const regexTelefonoPeru = /^9\d{8}$/;
    if (!regexTelefonoPeru.test(telefonoCliente)) {
        alert("🛡️ SEGURIDAD ANTI-TROLLS: Ingresa un celular válido de Perú (9 dígitos, inicia en 9).");
        document.getElementById("input-telefono").focus();
        return;
    }

    // Yape Obligatorio
    if (metodoPagoSeleccionado === "yape") {
        const fileInput = document.getElementById("receipt-file");
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("📸 ADJUNTAR COMPROBANTE OBLIGATORIO: Por favor sube la captura de pantalla de tu pago por Yape / Plin.");
            return;
        }
    }

    const claveSede = document.getElementById("select-sede").value;
    const datosSede = CONFIG_SEDES[claveSede];
    const tipoEntrega = document.querySelector('input[name="tipo_entrega"]:checked').value;

    const direccionInput = document.getElementById("input-direccion").value.trim();
    const referenciaInput = document.getElementById("input-referencia").value.trim();

    if (tipoEntrega === "Delivery") {
        if (!direccionInput || !referenciaInput) {
            alert("Para Delivery es obligatorio ingresar la Dirección y la Referencia.");
            return;
        }
    }

    let textoDetalle = "";
    let total = 0;

    carrito.forEach((item) => {
        const subtotal = item.precio * item.cantidad;
        textoDetalle += "• (" + item.cantidad + "x) " + item.nombre + " - S/ " + subtotal.toFixed(2) + "\n";
        total += subtotal;
    });

    let mensaje = "*¡NUEVO PEDIDO - GOLDEN PIZZERIA!* 🍕\n\n";
    mensaje += "👤 *CLIENTE:* " + nombreCliente + "\n";
    mensaje += "📱 *CELULAR:* " + telefonoCliente + "\n";
    mensaje += "📍 *SEDE:* " + datosSede.nombre + "\n";
    mensaje += "🛵 *MODALIDAD:* " + tipoEntrega + "\n";

    if (tipoEntrega === "Delivery") {
        mensaje += "🏠 *DIRECCIÓN:* " + direccionInput + "\n";
        mensaje += "📌 *REFERENCIA:* " + referenciaInput + "\n";
        if (ubicacionGpsLink) {
            mensaje += "🗺️ *UBICACIÓN GPS:* " + ubicacionGpsLink + "\n";
        }
    }

    mensaje += "\n*Detalle del Pedido:*\n" + textoDetalle + "\n";
    mensaje += "*TOTAL:* S/ " + total.toFixed(2) + "\n";
    mensaje += "*Método de Pago:* " + metodoPagoSeleccionado.toUpperCase() + "\n\n";
    mensaje += "_Adjunto la captura del pago a continuación en este chat_";

    const url = "https://wa.me/" + datosSede.telefonoWhatsapp + "?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");

    cerrarPago();
    iniciarTemporizador();
    vaciarPedido();
}
