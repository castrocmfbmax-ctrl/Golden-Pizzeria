/* =========================================================
   GOLDEN PIZZERIA - SISTEMA COMPLETO Y CORREGIDO
========================================================= */

let pedido = [];
let total = 0;

let metodoPagoSeleccionado = null;
let codigoPedidoActual = null;
let pizzaEnModal = null;

let temporizador = null;

const NUMERO_WHATSAPP = "51979707173";

/* =========================================================
   MODAL DE SELECCIÓN DE TAMAÑO DE PIZZA
========================================================= */
function abrirModalPizza(nombre, precioPersonal, precioMediana, precioFamiliar) {
    pizzaEnModal = nombre;

    const modal = document.getElementById("pizza-modal");
    const titulo = document.getElementById("pizza-modal-title");
    const container = document.getElementById("pizza-modal-sizes");

    if (!modal || !container) {
        const precio = precioMediana || precioPersonal || precioFamiliar;
        agregarPedido(`${nombre} (Mediana)`, precio);
        return;
    }

    if (titulo) titulo.innerText = nombre;

    let htmlButtons = "";

    if (precioPersonal !== null && precioPersonal !== undefined) {
        htmlButtons += `<button type="button" class="btn-size" style="padding:10px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="seleccionarTamano('Personal', ${precioPersonal})">Personal • S/ ${precioPersonal.toFixed(2)}</button>`;
    }
    if (precioMediana !== null && precioMediana !== undefined) {
        htmlButtons += `<button type="button" class="btn-size" style="padding:10px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="seleccionarTamano('Mediana', ${precioMediana})">Mediana • S/ ${precioMediana.toFixed(2)}</button>`;
    }
    if (precioFamiliar !== null && precioFamiliar !== undefined) {
        htmlButtons += `<button type="button" class="btn-size" style="padding:10px; background:#191e1b; border:1px solid #D4AF37; color:white; border-radius:8px; font-weight:bold; cursor:pointer;" onclick="seleccionarTamano('Familiar', ${precioFamiliar})">Familiar • S/ ${precioFamiliar.toFixed(2)}</button>`;
    }

    container.innerHTML = htmlButtons;

    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

function seleccionarTamano(tamano, precio) {
    if (pizzaEnModal) {
        agregarPedido(`${pizzaEnModal} (${tamano})`, precio);
    }
    cerrarModalPizza();
}

function cerrarModalPizza() {
    const modal = document.getElementById("pizza-modal");
    if (modal) {
        modal.classList.add("hidden");
        modal.style.display = "none";
    }
    pizzaEnModal = null;
}

/* =========================================================
   FILTRO DEL MENÚ CORREGIDO
========================================================= */
function filterCategory(cat) {
    const cards = document.querySelectorAll(".card");
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(btn => btn.classList.remove("active"));

    if (typeof event !== "undefined" && event && event.currentTarget) {
        event.currentTarget.classList.add("active");
    }

    cards.forEach(card => {
        if (cat === "todas") {
            card.style.display = "flex";
        } else {
            if (card.classList.contains(cat)) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        }
    });
}

/* =========================================================
   AGREGAR PRODUCTO
========================================================= */
function agregarPedido(producto, precio) {
    precio = Number(precio);

    pedido.push({ producto: producto, precio: precio });
    total += precio;

    let boton = null;
    if (typeof event !== "undefined" && event && event.currentTarget) {
        boton = event.currentTarget;
    }

    if (boton) {
        const textoOriginal = boton.innerText;
        boton.innerText = "✓ ¡AÑADIDO!";
        boton.style.background = "#D4AF37";
        boton.style.color = "#000";

        setTimeout(() => {
            boton.innerText = textoOriginal;
            boton.style.background = "";
            boton.style.color = "";
        }, 700);
    }

    actualizarBarra();
}

/* =========================================================
   CARRITO Y PAGO
========================================================= */
function actualizarBarra() {
    const bar = document.getElementById("cart-bar");
    const count = document.getElementById("cart-count");
    const totalElem = document.getElementById("cart-total");

    if (!bar || !count || !totalElem) return;

    if (pedido.length > 0) {
        bar.classList.remove("hidden");
        count.innerText = pedido.length;
        totalElem.innerText = "S/ " + total.toFixed(2);
    } else {
        bar.classList.add("hidden");
    }
}

function vaciarPedido() {
    pedido = [];
    total = 0;
    actualizarBarra();
}

function abrirPago(evento) {
    if (evento) {
        evento.preventDefault();
        evento.stopPropagation();
    }

    if (pedido.length === 0) {
        alert("🛒 Tu pedido está vacío.");
        return false;
    }

    const overlay = document.getElementById("payment-overlay");
    if (!overlay) return false;

    mostrarResumenPago();
    metodoPagoSeleccionado = null;

    document.querySelectorAll(".payment-method").forEach(btn => btn.classList.remove("selected"));
    document.querySelectorAll(".payment-section").forEach(section => section.classList.remove("active"));

    const archivo = document.getElementById("receipt-file");
    const nombre = document.getElementById("receipt-name");
    if (archivo) archivo.value = "";
    if (nombre) { nombre.innerText = ""; nombre.style.color = ""; }

    overlay.classList.remove("hidden");
    overlay.style.display = "flex";
    return false;
}

function cerrarPago() {
    const overlay = document.getElementById("payment-overlay");
    if (overlay) overlay.classList.add("hidden");
}

function mostrarResumenPago() {
    const lista = document.getElementById("payment-summary-list");
    const totalPago = document.getElementById("payment-total");
    if (!lista || !totalPago) return;

    let html = "";
    pedido.forEach((item, index) => {
        html += `<div style="display:flex; justify-between; margin-bottom:8px;"><span>${index + 1}. ${item.producto}</span><strong>S/ ${item.precio.toFixed(2)}</strong></div>`;
    });

    lista.innerHTML = html;
    totalPago.innerText = "S/ " + total.toFixed(2);
}

function seleccionarPago(metodo) {
    metodoPagoSeleccionado = metodo;
    document.querySelectorAll(".payment-method").forEach(btn => btn.classList.remove("selected"));
    document.querySelectorAll(".payment-section").forEach(sec => sec.classList.remove("active"));

    if (metodo === "yape") {
        document.getElementById("payment-yape")?.classList.add("selected");
        document.getElementById("section-yape")?.classList.add("active");
    } else if (metodo === "tarjeta") {
        document.getElementById("payment-tarjeta")?.classList.add("selected");
        document.getElementById("section-tarjeta")?.classList.add("active");
    } else if (metodo === "efectivo") {
        document.getElementById("payment-efectivo")?.classList.add("selected");
        document.getElementById("section-efectivo")?.classList.add("active");
    }
}

function comprobarReciboYape() {
    const archivo = document.getElementById("receipt-file");
    const nombre = document.getElementById("receipt-name");

    if (!archivo || !archivo.files || archivo.files.length === 0) return false;
    const item = archivo.files[0];

    if (nombre) {
        nombre.innerText = "✓ Comprobante: " + item.name;
        nombre.style.color = "#9be7b1";
    }
    return true;
}

function confirmarPedido() {
    if (pedido.length === 0) return;
    if (!metodoPagoSeleccionado) { alert("⚠️ Selecciona un método de pago."); return; }
    if (metodoPagoSeleccionado === "yape" && !comprobarReciboYape()) {
        alert("⚠️ Adjunta tu comprobante de Yape.");
        return;
    }

    codigoPedidoActual = generarCodigoPedido();
    cerrarPago();
    mostrarSeguimiento();
    enviarWhatsAppConfirmado();
}

function generarCodigoPedido() {
    const ahora = new Date();
    const fecha = String(ahora.getFullYear()).slice(-2) + String(ahora.getMonth() + 1).padStart(2, "0") + String(ahora.getDate()).padStart(2, "0");
    const clave = "golden_pizzeria_pedidos_" + fecha;
    let numero = Number(localStorage.getItem(clave) || 0) + 1;
    localStorage.setItem(clave, numero);
    return "GP-" + fecha + "-" + String(numero).padStart(3, "0");
}

function obtenerNombrePago() {
    if (metodoPagoSeleccionado === "yape") return "Yape";
    if (metodoPagoSeleccionado === "tarjeta") return "Tarjeta";
    if (metodoPagoSeleccionado === "efectivo") return "Efectivo";
    return "No especificado";
}

/* =========================================================
   SEGUIMIENTO Y CONSULTA DE CÓDIGO
========================================================= */
function mostrarSeguimiento() {
    const overlay = document.getElementById("tracking-overlay");
    const codigo = document.getElementById("order-code");

    if (codigo) codigo.innerText = codigoPedidoActual;

    resetearSeguimiento();
    mostrarEstadoPreparando();

    if (overlay) {
        overlay.classList.remove("hidden");
        overlay.style.display = "flex";
    }
}

function consultarEstadoCodigo() {
    const val = document.getElementById("input-tracking-code")?.value.trim();
    if (!val) { alert("Ingresa tu código de pedido."); return; }

    codigoPedidoActual = val;
    mostrarSeguimiento();
}

function resetearSeguimiento() {
    document.getElementById("tracking-recibido")?.classList.add("active");
    document.getElementById("tracking-preparando")?.classList.remove("active");
    document.getElementById("tracking-listo")?.classList.remove("active");
    document.getElementById("tracking-cancelado")?.classList.remove("active");
    document.getElementById("preparation-timer").style.display = "none";

    if (temporizador) { clearInterval(temporizador); temporizador = null; }
}

function cerrarTracking() {
    const overlay = document.getElementById("tracking-overlay");
    if (overlay) overlay.classList.add("hidden");
}

function mostrarEstadoPreparando() {
    document.getElementById("tracking-recibido")?.classList.remove("active");
    document.getElementById("tracking-preparando")?.classList.add("active");

    const timer = document.getElementById("preparation-timer");
    const timerValue = document.getElementById("timer-value");
    if (timer) timer.style.display = "block";

    iniciarTemporizador(10, timerValue);
}

function iniciarTemporizador(minutos, elemento) {
    if (!elemento) return;
    if (temporizador) clearInterval(temporizador);

    let segundos = minutos * 60;
    actualizarTextoTemporizador(segundos, elemento);

    temporizador = setInterval(() => {
        segundos--;
        if (segundos <= 0) {
            clearInterval(temporizador);
            temporizador = null;
            elemento.innerText = "¡Listo!";
            return;
        }
        actualizarTextoTemporizador(segundos, elemento);
    }, 1000);
}

function actualizarTextoTemporizador(segundos, elemento) {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    elemento.innerText = m + ":" + String(s).padStart(2, "0");
}

function enviarWhatsAppConfirmado() {
    if (pedido.length === 0) return;

    let mensaje = "🍕 *NUEVO PEDIDO - GOLDEN PIZZERIA*\n\n";
    mensaje += "📋 *Código:* " + codigoPedidoActual + "\n";
    mensaje += "💳 *Método de pago:* " + obtenerNombrePago() + "\n\n";
    mensaje += "🛒 *DETALLE DEL PEDIDO*\n";

    pedido.forEach((item, index) => {
        mensaje += (index + 1) + ". " + item.producto + " - S/ " + item.precio.toFixed(2) + "\n";
    });

    mensaje += "\n💰 *TOTAL: S/ " + total.toFixed(2) + "*\n";

    const url = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", function() {
    actualizarBarra();
    document.getElementById("payment-overlay")?.classList.add("hidden");
    document.getElementById("tracking-overlay")?.classList.add("hidden");
    document.getElementById("pizza-modal")?.classList.add("hidden");
});
