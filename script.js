/* =========================================================
   GOLDEN PIZZERIA
   SISTEMA DE PEDIDOS + PAGO + SEGUIMIENTO
========================================================= */


/* =========================================================
   VARIABLES PRINCIPALES
========================================================= */

let pedido = [];
let total = 0;

let metodoPagoSeleccionado = null;
let codigoPedidoActual = null;
let temporizador = null;

const NUMERO_WHATSAPP = "51979707173";


/* =========================================================
   FILTRO DEL MENÚ
========================================================= */

function filterCategory(cat) {

    const cards = document.querySelectorAll(".card");
    const buttons = document.querySelectorAll(".filter-btn");

    /* Quitar activo de todos */
    buttons.forEach(btn => {
        btn.classList.remove("active");
    });

    /* Detectar botón que se pulsó */
    const botonActual = window.event?.currentTarget;

    if (botonActual) {
        botonActual.classList.add("active");
    }

    cards.forEach(card => {

        if (cat === "todas") {

            /*
                TODAS LAS PIZZAS:
                mostramos únicamente las categorías de pizza
            */

            if (
                card.classList.contains("clasicas") ||
                card.classList.contains("unicas") ||
                card.classList.contains("casa") ||
                card.classList.contains("especiales")
            ) {

                card.style.display = "flex";

            } else {

                card.style.display = "none";

            }

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
   AGREGAR PRODUCTO AL PEDIDO
========================================================= */

function agregarPedido(producto, precio) {

    pedido.push({
        producto: producto,
        precio: Number(precio)
    });

    total += Number(precio);

    /* Animación del botón */
    const boton = window.event?.currentTarget;

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
   ACTUALIZAR CARRITO
========================================================= */

function actualizarBarra() {

    const bar = document.getElementById("cart-bar");
    const count = document.getElementById("cart-count");
    const totalElem = document.getElementById("cart-total");

    if (!bar || !count || !totalElem) return;

    if (pedido.length > 0) {

        bar.classList.remove("hidden");

        count.innerText = pedido.length;

        totalElem.innerText =
            `S/ ${total.toFixed(2)}`;

    } else {

        bar.classList.add("hidden");

    }

}


/* =========================================================
   VACIAR PEDIDO
========================================================= */

function vaciarPedido() {

    if (pedido.length === 0) return;

    pedido = [];
    total = 0;

    actualizarBarra();

}


/* =========================================================
   ABRIR PANTALLA DE PAGO
========================================================= */

function abrirPago() {

    if (pedido.length === 0) {

        alert("🛒 Tu pedido está vacío.");

        return;

    }

    const overlay =
        document.getElementById("payment-overlay");

    if (!overlay) {

        alert("No se encontró la pantalla de pago.");

        return;

    }

    /* Reiniciar método de pago */
    metodoPagoSeleccionado = null;

    /* Quitar selección */
    document.querySelectorAll(".payment-method").forEach(btn => {

        btn.classList.remove("selected");

    });

    /* Ocultar secciones */
    document.querySelectorAll(".payment-section").forEach(section => {

        section.classList.remove("active");

    });

    /* Crear resumen */
    mostrarResumenPago();

    /* Reiniciar comprobante */
    const archivo =
        document.getElementById("receipt-file");

    const nombre =
        document.getElementById("receipt-name");

    if (archivo) {
        archivo.value = "";
    }

    if (nombre) {
        nombre.innerText = "";
    }

    /* Mostrar pantalla */
    overlay.classList.remove("hidden");

}


/* =========================================================
   CERRAR PANTALLA DE PAGO
========================================================= */

function cerrarPago() {

    const overlay =
        document.getElementById("payment-overlay");

    if (overlay) {

        overlay.classList.add("hidden");

    }

}


/* =========================================================
   MOSTRAR RESUMEN DEL PEDIDO
========================================================= */

function mostrarResumenPago() {

    const lista =
        document.getElementById("payment-summary-list");

    const totalPago =
        document.getElementById("payment-total");

    if (!lista || !totalPago) return;

    if (pedido.length === 0) {

        lista.innerHTML =
            "Tu pedido está vacío.";

        totalPago.innerText =
            "S/ 0.00";

        return;

    }

    let html = "";

    pedido.forEach((item, index) => {

        html += `
            <div style="
                display:flex;
                justify-content:space-between;
                gap:10px;
                margin-bottom:8px;
                padding-bottom:8px;
                border-bottom:1px solid rgba(255,255,255,.08);
            ">

                <span>
                    ${index + 1}. ${item.producto}
                </span>

                <strong>
                    S/ ${item.precio.toFixed(2)}
                </strong>

            </div>
        `;

    });

    lista.innerHTML = html;

    totalPago.innerText =
        `S/ ${total.toFixed(2)}`;

}


/* =========================================================
   SELECCIONAR MÉTODO DE PAGO
========================================================= */

function seleccionarPago(metodo) {

    metodoPagoSeleccionado = metodo;

    /* Quitar selección */
    document.querySelectorAll(".payment-method").forEach(btn => {

        btn.classList.remove("selected");

    });

    /* Ocultar todas las secciones */
    document.querySelectorAll(".payment-section").forEach(section => {

        section.classList.remove("active");

    });


    /* YAPE */
    if (metodo === "yape") {

        const boton =
            document.getElementById("payment-yape");

        const seccion =
            document.getElementById("section-yape");

        if (boton) {
            boton.classList.add("selected");
        }

        if (seccion) {
            seccion.classList.add("active");
        }

    }


    /* TARJETA */
    if (metodo === "tarjeta") {

        const boton =
            document.getElementById("payment-tarjeta");

        const seccion =
            document.getElementById("section-tarjeta");

        if (boton) {
            boton.classList.add("selected");
        }

        if (seccion) {
            seccion.classList.add("active");
        }

    }


    /* EFECTIVO */
    if (metodo === "efectivo") {

        const boton =
            document.getElementById("payment-efectivo");

        const seccion =
            document.getElementById("section-efectivo");

        if (boton) {
            boton.classList.add("selected");
        }

        if (seccion) {
            seccion.classList.add("active");
        }

    }

}


/* =========================================================
   COMPROBANTE DE YAPE
========================================================= */

function comprobarReciboYape() {

    const archivo =
        document.getElementById("receipt-file");

    const nombre =
        document.getElementById("receipt-name");

    const etiqueta =
        document.querySelector(".receipt-label");


    /* No existe */
    if (!archivo) {

        return false;

    }


    /* No se seleccionó archivo */
    if (
        !archivo.files ||
        archivo.files.length === 0
    ) {

        if (nombre) {

            nombre.innerText =
                "⚠️ Debes seleccionar tu comprobante.";

            nombre.style.color = "#ff6b6b";

        }

        if (etiqueta) {

            etiqueta.style.borderColor =
                "#D62828";

        }

        return false;

    }


    const archivoSeleccionado =
        archivo.files[0];


    /* Verificar que sea imagen */
    if (
        !archivoSeleccionado.type ||
        !archivoSeleccionado.type.startsWith("image/")
    ) {

        if (nombre) {

            nombre.innerText =
                "⚠️ El comprobante debe ser una imagen.";

            nombre.style.color = "#ff6b6b";

        }

        return false;

    }


    /* Correcto */
    if (nombre) {

        nombre.innerText =
            "✓ Comprobante seleccionado: " +
            archivoSeleccionado.name;

        nombre.style.color = "#9be7b1";

    }

    if (etiqueta) {

        etiqueta.style.borderColor =
            "#18A558";

    }

    return true;

}


/* =========================================================
   CONFIRMAR PEDIDO
========================================================= */

function confirmarPedido() {

    /* Verificar que haya productos */
    if (pedido.length === 0) {

        alert("🛒 Tu pedido está vacío.");

        return;

    }


    /* Verificar método */
    if (!metodoPagoSeleccionado) {

        alert(
            "⚠️ Selecciona un método de pago antes de continuar."
        );

        return;

    }


    /* =====================================================
       REGLA IMPORTANTE:
       YAPE = COMPROBANTE OBLIGATORIO
    ===================================================== */

    if (metodoPagoSeleccionado === "yape") {

        const comprobanteValido =
            comprobarReciboYape();

        if (!comprobanteValido) {

            alert(
                "⚠️ Para pagar con Yape debes adjuntar tu comprobante de pago."
            );

            return;

        }

    }


    /* Generar código */
    codigoPedidoActual =
        generarCodigoPedido();


    /* Cerrar pago */
    cerrarPago();


    /* Abrir seguimiento */
    mostrarSeguimiento();


    /* Enviar información a WhatsApp */
    enviarWhatsAppConfirmado();

}


/* =========================================================
   GENERAR CÓDIGO DEL PEDIDO
   FORMATO:
   GP-YYMMDD-001
========================================================= */

function generarCodigoPedido() {

    const ahora = new Date();

    const año =
        String(ahora.getFullYear()).slice(-2);

    const mes =
        String(ahora.getMonth() + 1).padStart(2, "0");

    const dia =
        String(ahora.getDate()).padStart(2, "0");


    const fecha =
        `${año}${mes}${dia}`;


    /* Contador diario guardado en el navegador */
    const clave =
        `golden_pizzeria_pedidos_${fecha}`;


    let numero =
        Number(localStorage.getItem(clave) || 0);


    numero++;


    localStorage.setItem(
        clave,
        numero
    );


    const consecutivo =
        String(numero).padStart(3, "0");


    return `GP-${fecha}-${consecutivo}`;

}


/* =========================================================
   OBTENER NOMBRE DEL MÉTODO DE PAGO
========================================================= */

function obtenerNombrePago() {

    if (metodoPagoSeleccionado === "yape") {

        return "Yape";

    }

    if (metodoPagoSeleccionado === "tarjeta") {

        return "Tarjeta";

    }

    if (metodoPagoSeleccionado === "efectivo") {

        return "Efectivo";

    }

    return "No especificado";

}


/* =========================================================
   CALCULAR TIEMPO DE PREPARACIÓN
=========================================================

   Pizza solamente:
   10 minutos

   Pizza + bebida/frappé:
   12 minutos

   La bebida agrega solamente +2 minutos
   una vez por pedido.
========================================================= */

function calcularTiempoPedido() {

    let tieneBebida = false;


    pedido.forEach(item => {

        const nombre =
            item.producto.toLowerCase();


        if (
            nombre.includes("frappé") ||
            nombre.includes("frappe") ||
            nombre.includes("limonada") ||
            nombre.includes("chicha") ||
            nombre.includes("café") ||
            nombre.includes("cafe") ||
            nombre.includes("té") ||
            nombre.includes("te filtrante") ||
            nombre.includes("infusiones")
        ) {

            tieneBebida = true;

        }

    });


    if (tieneBebida) {

        return 12;

    }


    return 10;

}


/* =========================================================
   MOSTRAR SEGUIMIENTO
========================================================= */

function mostrarSeguimiento() {

    const overlay =
        document.getElementById("tracking-overlay");

    const codigo =
        document.getElementById("order-code");


    if (!overlay) return;


    /* Código */
    if (codigo) {

        codigo.innerText =
            codigoPedidoActual;

    }


    /* Estado inicial */
    resetearSeguimiento();


    /* Mostrar */
    overlay.classList.remove("hidden");

}


/* =========================================================
   REINICIAR SEGUIMIENTO
========================================================= */

function resetearSeguimiento() {

    const recibido =
        document.getElementById("tracking-recibido");

    const preparando =
        document.getElementById("tracking-preparando");

    const listo =
        document.getElementById("tracking-listo");

    const cancelado =
        document.getElementById("tracking-cancelado");

    const timer =
        document.getElementById("preparation-timer");


    if (recibido) {

        recibido.classList.add("active");

    }

    if (preparando) {

        preparando.classList.remove("active");

    }

    if (listo) {

        listo.classList.remove("active");

    }

    if (cancelado) {

        cancelado.classList.remove("active");

    }

    if (timer) {

        timer.style.display = "none";

    }


    /* Detener temporizador anterior */
    if (temporizador) {

        clearInterval(temporizador);

        temporizador = null;

    }

}


/* =========================================================
   CERRAR SEGUIMIENTO
========================================================= */

function cerrarTracking() {

    const overlay =
        document.getElementById("tracking-overlay");

    if (overlay) {

        overlay.classList.add("hidden");

    }

}


/* =========================================================
   MOSTRAR ESTADO PREPARANDO
=========================================================

   Esta función queda preparada para el futuro
   panel del personal.

   Cuando el personal cambie el pedido a
   PREPARANDO, se podrá llamar:

   mostrarEstadoPreparando();
========================================================= */

function mostrarEstadoPreparando() {

    const recibido =
        document.getElementById("tracking-recibido");

    const preparando =
        document.getElementById("tracking-preparando");

    const listo =
        document.getElementById("tracking-listo");

    const cancelado =
        document.getElementById("tracking-cancelado");

    const timer =
        document.getElementById("preparation-timer");

    const timerValue =
        document.getElementById("timer-value");


    if (recibido) {

        recibido.classList.remove("active");

    }

    if (preparando) {

        preparando.classList.add("active");

    }

    if (listo) {

        listo.classList.remove("active");

    }

    if (cancelado) {

        cancelado.classList.remove("active");

    }


    const minutos =
        calcularTiempoPedido();


    if (timer) {

        timer.style.display = "block";

    }


    iniciarTemporizador(
        minutos,
        timerValue
    );

}


/* =========================================================
   TEMPORIZADOR
========================================================= */

function iniciarTemporizador(
    minutos,
    elemento
) {

    if (!elemento) return;


    if (temporizador) {

        clearInterval(temporizador);

    }


    let segundos =
        minutos * 60;


    actualizarTextoTemporizador(
        segundos,
        elemento
    );


    temporizador =
        setInterval(() => {

            segundos--;


            if (segundos <= 0) {

                clearInterval(temporizador);

                temporizador = null;

                elemento.innerText =
                    "¡Listo!";

                return;

            }


            actualizarTextoTemporizador(
                segundos,
                elemento
            );


        }, 1000);

}


/* =========================================================
   TEXTO DEL TEMPORIZADOR
========================================================= */

function actualizarTextoTemporizador(
    segundos,
    elemento
) {

    const minutos =
        Math.floor(segundos / 60);

    const segundosRestantes =
        segundos % 60;


    elemento.innerText =
        `${minutos}:${String(segundosRestantes).padStart(2, "0")}`;

}


/* =========================================================
   MOSTRAR PEDIDO LISTO
========================================================= */

function mostrarEstadoListo() {

    const recibido =
        document.getElementById("tracking-recibido");

    const preparando =
        document.getElementById("tracking-preparando");

    const listo =
        document.getElementById("tracking-listo");

    const cancelado =
        document.getElementById("tracking-cancelado");

    const timer =
        document.getElementById("preparation-timer");


    if (recibido) {

        recibido.classList.remove("active");

    }

    if (preparando) {

        preparando.classList.remove("active");

    }

    if (listo) {

        listo.classList.add("active");

    }

    if (cancelado) {

        cancelado.classList.remove("active");

    }


    if (timer) {

        timer.style.display = "none";

    }


    if (temporizador) {

        clearInterval(temporizador);

        temporizador = null;

    }

}


/* =========================================================
   MOSTRAR PEDIDO CANCELADO
========================================================= */

function mostrarEstadoCancelado() {

    const recibido =
        document.getElementById("tracking-recibido");

    const preparando =
        document.getElementById("tracking-preparando");

    const listo =
        document.getElementById("tracking-listo");

    const cancelado =
        document.getElementById("tracking-cancelado");

    const timer =
        document.getElementById("preparation-timer");


    if (recibido) {

        recibido.classList.remove("active");

    }

    if (preparando) {

        preparando.classList.remove("active");

    }

    if (listo) {

        listo.classList.remove("active");

    }

    if (cancelado) {

        cancelado.classList.add("active");

    }


    if (timer) {

        timer.style.display = "none";

    }


    if (temporizador) {

        clearInterval(temporizador);

        temporizador = null;

    }

}


/* =========================================================
   ENVIAR PEDIDO POR WHATSAPP
========================================================= */

function enviarWhatsAppConfirmado() {

    if (pedido.length === 0) return;


    let mensaje =
        "🍕 *NUEVO PEDIDO - GOLDEN PIZZERIA*%0A%0A";


    mensaje +=
        `📋 *Código:* ${codigoPedidoActual}%0A`;


    mensaje +=
        `💳 *Método de pago:* ${obtenerNombrePago()}%0A%0A`;


    mensaje +=
        "🛒 *DETALLE DEL PEDIDO*%0A";


    pedido.forEach((item, index) => {

        mensaje +=
            `${index + 1}. ${item.producto} - S/ ${item.precio.toFixed(2)}%0A`;

    });


    mensaje +=
        `%0A💰 *TOTAL: S/ ${total.toFixed(2)}*%0A`;


    if (metodoPagoSeleccionado === "yape") {

        mensaje +=
            "%0A📸 El cliente indica que adjuntó su comprobante de Yape.";

    }


    mensaje +=
        "%0A%0A🟡 *PEDIDO RECIBIDO*";


    const url =
        `https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`;


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   COMPATIBILIDAD CON BOTÓN ANTIGUO
========================================================= */

function enviarWhatsApp() {

    if (pedido.length === 0) {

        alert("🛒 Tu pedido está vacío.");

        return;

    }


    enviarWhatsAppConfirmado();

}


/* =========================================================
   CONTROL DEL COMPROBANTE
========================================================= */

document.addEventListener(
    "change",
    function(event) {

        if (
            event.target &&
            event.target.id === "receipt-file"
        ) {

            comprobarReciboYape();

        }

    }
);


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        actualizarBarra();


        /* Asegurar que la pantalla de pago
           comience cerrada */

        const payment =
            document.getElementById("payment-overlay");

        if (payment) {

            payment.classList.add("hidden");

        }


        /* Seguimiento cerrado */

        const tracking =
            document.getElementById("tracking-overlay");

        if (tracking) {

            tracking.classList.add("hidden");

        }


        /* Modal de pizza cerrado */

        const pizza =
            document.getElementById("pizza-modal");

        if (pizza) {

            pizza.classList.add("hidden");

        }

    }
);
