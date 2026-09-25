/* =========================================================
   GOLDEN PIZZERIA
   SISTEMA COMPLETO DE PEDIDOS
   PAGO + SEGUIMIENTO + WHATSAPP
========================================================= */


/* =========================================================
   VARIABLES
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

    buttons.forEach(btn => {
        btn.classList.remove("active");
    });

    /*
       Intentamos detectar el botón presionado
    */

    if (typeof event !== "undefined" && event && event.currentTarget) {
        event.currentTarget.classList.add("active");
    }

    cards.forEach(card => {

        if (cat === "todas") {

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
   AGREGAR PRODUCTO
========================================================= */

function agregarPedido(producto, precio) {

    precio = Number(precio);

    pedido.push({
        producto: producto,
        precio: precio
    });

    total += precio;

    /*
       Animación del botón
    */

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
   ACTUALIZAR CARRITO
========================================================= */

function actualizarBarra() {

    const bar = document.getElementById("cart-bar");
    const count = document.getElementById("cart-count");
    const totalElem = document.getElementById("cart-total");

    if (!bar || !count || !totalElem) {
        return;
    }

    if (pedido.length > 0) {

        bar.classList.remove("hidden");

        count.innerText = pedido.length;

        totalElem.innerText =
            "S/ " + total.toFixed(2);

    } else {

        bar.classList.add("hidden");

    }

}


/* =========================================================
   VACIAR PEDIDO
========================================================= */

function vaciarPedido() {

    pedido = [];
    total = 0;

    actualizarBarra();

}


/* =========================================================
   ABRIR PANTALLA DE PAGO
========================================================= */

function abrirPago(evento) {

    /*
       Evitar que el botón envíe un formulario
    */

    if (evento) {
        evento.preventDefault();
        evento.stopPropagation();
    }

    console.log("GOLDEN PIZZERIA: abriendo pantalla de pago");


    /*
       Verificar carrito
    */

    if (pedido.length === 0) {

        alert("🛒 Tu pedido está vacío.");

        return false;

    }


    /*
       Buscar ventana de pago
    */

    const overlay =
        document.getElementById("payment-overlay");


    if (!overlay) {

        alert(
            "❌ No se encontró la pantalla de pago.\n\n" +
            "Verifica que exista id=\"payment-overlay\" en index.html."
        );

        console.error(
            "ERROR GOLDEN PIZZERIA: No existe #payment-overlay"
        );

        return false;

    }


    /*
       Mostrar resumen
    */

    mostrarResumenPago();


    /*
       Reiniciar método
    */

    metodoPagoSeleccionado = null;


    /*
       Quitar selección de botones
    */

    document
        .querySelectorAll(".payment-method")
        .forEach(btn => {

            btn.classList.remove("selected");

        });


    /*
       Ocultar secciones
    */

    document
        .querySelectorAll(".payment-section")
        .forEach(section => {

            section.classList.remove("active");

        });


    /*
       Limpiar comprobante anterior
    */

    const archivo =
        document.getElementById("receipt-file");

    const nombre =
        document.getElementById("receipt-name");


    if (archivo) {

        archivo.value = "";

    }


    if (nombre) {

        nombre.innerText = "";

        nombre.style.color = "";

    }


    /*
       =====================================================
       ABRIR LA VENTANA
       =====================================================
    */

    overlay.classList.remove("hidden");

    /*
       Forzar visibilidad.
       Esto evita problemas con CSS.
    */

    overlay.style.display = "flex";

    overlay.style.visibility = "visible";

    overlay.style.opacity = "1";

    overlay.style.zIndex = "99999";


    console.log(
        "GOLDEN PIZZERIA: pantalla de pago abierta"
    );


    return false;

}


/* =========================================================
   CERRAR PANTALLA DE PAGO
========================================================= */

function cerrarPago() {

    const overlay =
        document.getElementById("payment-overlay");

    if (!overlay) {
        return;
    }

    overlay.classList.add("hidden");

    /*
       Restauramos el estado visual
       para la próxima apertura.
    */

    overlay.style.display = "";

    overlay.style.visibility = "";

    overlay.style.opacity = "";

}


/* =========================================================
   MOSTRAR RESUMEN DEL PEDIDO
========================================================= */

function mostrarResumenPago() {

    const lista =
        document.getElementById("payment-summary-list");

    const totalPago =
        document.getElementById("payment-total");


    if (!lista || !totalPago) {

        console.error(
            "No se encontró el resumen de pago."
        );

        return;

    }


    if (pedido.length === 0) {

        lista.innerHTML =
            "<p>Tu pedido está vacío.</p>";

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
                align-items:center;
                gap:12px;
                margin-bottom:10px;
                padding-bottom:10px;
                border-bottom:1px solid rgba(255,255,255,.10);
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
        "S/ " + total.toFixed(2);

}


/* =========================================================
   SELECCIONAR MÉTODO DE PAGO
========================================================= */

function seleccionarPago(metodo) {

    metodoPagoSeleccionado = metodo;


    /*
       Quitar selección anterior
    */

    document
        .querySelectorAll(".payment-method")
        .forEach(btn => {

            btn.classList.remove("selected");

        });


    /*
       Ocultar todas las secciones
    */

    document
        .querySelectorAll(".payment-section")
        .forEach(section => {

            section.classList.remove("active");

        });


    /*
       YAPE
    */

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


    /*
       TARJETA
    */

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


    /*
       EFECTIVO
    */

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


    /*
       No existe el input
    */

    if (!archivo) {

        return false;

    }


    /*
       No hay archivo
    */

    if (
        !archivo.files ||
        archivo.files.length === 0
    ) {

        if (nombre) {

            nombre.innerText =
                "⚠️ Debes seleccionar tu comprobante.";

            nombre.style.color =
                "#ff6b6b";

        }


        if (etiqueta) {

            etiqueta.style.borderColor =
                "#D62828";

        }


        return false;

    }


    const archivoSeleccionado =
        archivo.files[0];


    /*
       Verificar que sea imagen
    */

    if (
        !archivoSeleccionado.type ||
        !archivoSeleccionado.type.startsWith("image/")
    ) {

        if (nombre) {

            nombre.innerText =
                "⚠️ El comprobante debe ser una imagen.";

            nombre.style.color =
                "#ff6b6b";

        }


        return false;

    }


    /*
       Comprobante correcto
    */

    if (nombre) {

        nombre.innerText =
            "✓ Comprobante seleccionado: " +
            archivoSeleccionado.name;

        nombre.style.color =
            "#9be7b1";

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

    /*
       Verificar productos
    */

    if (pedido.length === 0) {

        alert("🛒 Tu pedido está vacío.");

        return;

    }


    /*
       Verificar método de pago
    */

    if (!metodoPagoSeleccionado) {

        alert(
            "⚠️ Selecciona un método de pago antes de continuar."
        );

        return;

    }


    /*
       YAPE NECESITA COMPROBANTE
    */

    if (metodoPagoSeleccionado === "yape") {

        const comprobante =
            comprobarReciboYape();


        if (!comprobante) {

            alert(
                "⚠️ Para pagar con Yape debes adjuntar tu comprobante de pago."
            );

            return;

        }

    }


    /*
       Generar código
    */

    codigoPedidoActual =
        generarCodigoPedido();


    /*
       Cerrar pago
    */

    cerrarPago();


    /*
       Mostrar seguimiento
    */

    mostrarSeguimiento();


    /*
       Enviar pedido a WhatsApp
    */

    enviarWhatsAppConfirmado();

}


/* =========================================================
   GENERAR CÓDIGO DEL PEDIDO
========================================================= */

function generarCodigoPedido() {

    const ahora =
        new Date();


    const año =
        String(
            ahora.getFullYear()
        ).slice(-2);


    const mes =
        String(
            ahora.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            ahora.getDate()
        ).padStart(2, "0");


    const fecha =
        año + mes + dia;


    /*
       Contador diario
    */

    const clave =
        "golden_pizzeria_pedidos_" + fecha;


    let numero =
        Number(
            localStorage.getItem(clave) || 0
        );


    numero++;


    localStorage.setItem(
        clave,
        numero
    );


    const consecutivo =
        String(numero).padStart(3, "0");


    return "GP-" +
        fecha +
        "-" +
        consecutivo;

}


/* =========================================================
   NOMBRE DEL MÉTODO DE PAGO
========================================================= */

function obtenerNombrePago() {

    if (
        metodoPagoSeleccionado === "yape"
    ) {

        return "Yape";

    }


    if (
        metodoPagoSeleccionado === "tarjeta"
    ) {

        return "Tarjeta";

    }


    if (
        metodoPagoSeleccionado === "efectivo"
    ) {

        return "Efectivo";

    }


    return "No especificado";

}


/* =========================================================
   CALCULAR TIEMPO DE PREPARACIÓN
=========================================================

   Pizza solamente:
   10 minutos

   Pizza + bebida:
   12 minutos

========================================================= */

function calcularTiempoPedido() {

    let tieneBebida = false;


    pedido.forEach(item => {

        const nombre =
            String(item.producto).toLowerCase();


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


    if (!overlay) {

        console.error(
            "No existe #tracking-overlay"
        );

        return;

    }


    if (codigo) {

        codigo.innerText =
            codigoPedidoActual;

    }


    resetearSeguimiento();


    overlay.classList.remove("hidden");

    overlay.style.display = "flex";

    overlay.style.visibility = "visible";

    overlay.style.opacity = "1";

    overlay.style.zIndex = "99998";

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


    /*
       Detener temporizador
    */

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


    if (!overlay) {
        return;
    }


    overlay.classList.add("hidden");

    overlay.style.display = "";

    overlay.style.visibility = "";

    overlay.style.opacity = "";

}


/* =========================================================
   ESTADO: PREPARANDO
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

    if (!elemento) {
        return;
    }


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
        Math.floor(
            segundos / 60
        );


    const segundosRestantes =
        segundos % 60;


    elemento.innerText =
        minutos +
        ":" +
        String(
            segundosRestantes
        ).padStart(2, "0");

}


/* =========================================================
   ESTADO: LISTO
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
   ESTADO: CANCELADO
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
   ENVIAR PEDIDO A WHATSAPP
========================================================= */

function enviarWhatsAppConfirmado() {

    if (pedido.length === 0) {
        return;
    }


    let mensaje =
        "🍕 *NUEVO PEDIDO - GOLDEN PIZZERIA*\n\n";


    mensaje +=
        "📋 *Código:* " +
        codigoPedidoActual +
        "\n";


    mensaje +=
        "💳 *Método de pago:* " +
        obtenerNombrePago() +
        "\n\n";


    mensaje +=
        "🛒 *DETALLE DEL PEDIDO*\n";


    pedido.forEach((item, index) => {

        mensaje +=
            (index + 1) +
            ". " +
            item.producto +
            " - S/ " +
            item.precio.toFixed(2) +
            "\n";

    });


    mensaje +=
        "\n💰 *TOTAL: S/ " +
        total.toFixed(2) +
        "*\n";


    if (
        metodoPagoSeleccionado === "yape"
    ) {

        mensaje +=
            "\n📸 *Comprobante de Yape seleccionado por el cliente.*\n";

    }


    mensaje +=
        "\n🟡 *PEDIDO RECIBIDO*";


    /*
       Abrir WhatsApp
    */

    const url =
        "https://wa.me/" +
        NUMERO_WHATSAPP +
        "?text=" +
        encodeURIComponent(mensaje);


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

        alert(
            "🛒 Tu pedido está vacío."
        );

        return;

    }


    enviarWhatsAppConfirmado();

}


/* =========================================================
   CONTROL DEL COMPROBANTE
========================================================= */

document.addEventListener(
    "change",
    function(evento) {

        if (
            evento.target &&
            evento.target.id === "receipt-file"
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


        /*
           PANTALLA DE PAGO
        */

        const payment =
            document.getElementById(
                "payment-overlay"
            );


        if (payment) {

            payment.classList.add("hidden");

            payment.style.display = "";

            payment.style.visibility = "";

            payment.style.opacity = "";

        }


        /*
           SEGUIMIENTO
        */

        const tracking =
            document.getElementById(
                "tracking-overlay"
            );


        if (tracking) {

            tracking.classList.add("hidden");

            tracking.style.display = "";

            tracking.style.visibility = "";

            tracking.style.opacity = "";

        }


        /*
           MODAL DE PIZZA
        */

        const pizza =
            document.getElementById(
                "pizza-modal"
            );


        if (pizza) {

            pizza.classList.add("hidden");

        }


        console.log(
            "🍕 GOLDEN PIZZERIA: sistema cargado correctamente."
        );

    }
);
