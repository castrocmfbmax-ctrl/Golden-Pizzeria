let pedido = [];
let total = 0;

// Número oficial de la pizzería
const NUMERO_WHATSAPP = "51979707173";

// Variables del pedido
let metodoPagoSeleccionado = "";
let codigoPedidoActual = "";


// ==========================================
// FILTROS DEL MENÚ
// ==========================================

function filterCategory(cat) {

  const cards = document.querySelectorAll(".card");
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach(btn => btn.classList.remove("active"));

  if (event && event.currentTarget) {
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


// ==========================================
// AGREGAR PRODUCTO
// ==========================================

function agregarPedido(producto, precio) {

  pedido.push({
    producto: producto,
    precio: precio
  });

  total += precio;


  // Animación del botón
  const btn = event.currentTarget;

  if (btn) {

    const textoOriginal = btn.innerText;

    btn.innerText = "✓ ¡Añadido!";
    btn.style.background = "#f1c40f";
    btn.style.color = "#000";

    setTimeout(() => {

      btn.innerText = textoOriginal;
      btn.style.background = "";
      btn.style.color = "";

    }, 700);

  }


  actualizarBarra();

}


// ==========================================
// ACTUALIZAR CARRITO
// ==========================================

function actualizarBarra() {

  const bar = document.getElementById("cart-bar");
  const count = document.getElementById("cart-count");
  const totalElem = document.getElementById("cart-total");


  if (pedido.length > 0) {

    bar.classList.remove("hidden");

    count.innerText = pedido.length;

    totalElem.innerText =
      `S/ ${total.toFixed(2)}`;

  } else {

    bar.classList.add("hidden");

  }

}


// ==========================================
// VACIAR PEDIDO
// ==========================================

function vaciarPedido() {

  pedido = [];
  total = 0;

  actualizarBarra();

}


// ==========================================
// ABRIR MEDIOS DE PAGO
// ==========================================

function abrirPago() {

  if (pedido.length === 0) {

    alert("Tu pedido está vacío.");

    return;
  }


  const overlay =
    document.getElementById("pago-overlay");

  const resumen =
    document.getElementById("resumen-items");

  const totalPago =
    document.getElementById("pago-total");


  if (!overlay || !resumen || !totalPago) {

    alert(
      "La pantalla de pago todavía no está instalada en la página."
    );

    return;
  }


  resumen.innerHTML = "";


  pedido.forEach((item, index) => {

    const fila =
      document.createElement("div");

    fila.className = "resumen-item";


    fila.innerHTML = `
      <span>
        ${index + 1}. ${item.producto}
      </span>

      <strong>
        S/ ${item.precio.toFixed(2)}
      </strong>
    `;


    resumen.appendChild(fila);

  });


  totalPago.innerText =
    `S/ ${total.toFixed(2)}`;


  overlay.classList.remove("hidden");

}


// ==========================================
// CERRAR MEDIOS DE PAGO
// ==========================================

function cerrarPago() {

  const overlay =
    document.getElementById("pago-overlay");

  if (overlay) {

    overlay.classList.add("hidden");

  }

}


// ==========================================
// SELECCIONAR MEDIO DE PAGO
// ==========================================

function seleccionarPago(metodo) {

  metodoPagoSeleccionado = metodo;


  const informacion =
    document.getElementById("informacion-pago");

  const yapeBox =
    document.getElementById("yape-box");


  if (!informacion || !yapeBox) {
    return;
  }


  // Ocultar Yape inicialmente
  yapeBox.classList.add("hidden");


  // YAPE
  if (metodo === "yape") {

    informacion.innerHTML = `
      🟣 Has seleccionado
      <strong>Yape</strong>.
      <br>
      Realiza el pago y adjunta tu comprobante.
    `;

    yapeBox.classList.remove("hidden");

  }


  // TARJETA
  if (metodo === "tarjeta") {

    informacion.innerHTML = `
      💳 Has seleccionado
      <strong>Tarjeta</strong>.
      <br>
      Continúa con el proceso de pago con tarjeta.
    `;

  }


  // EFECTIVO
  if (metodo === "efectivo") {

    informacion.innerHTML = `
      💵 Has seleccionado
      <strong>Efectivo</strong>.
      <br>
      Realizarás el pago al recibir tu pedido.
    `;

  }

}


// ==========================================
// CONFIRMAR PEDIDO
// ==========================================

function confirmarPedido() {

  // Verificar medio de pago
  if (!metodoPagoSeleccionado) {

    alert(
      "Selecciona un medio de pago antes de continuar."
    );

    return;
  }


  // Verificar comprobante de Yape
  if (metodoPagoSeleccionado === "yape") {

    const comprobante =
      document.getElementById("comprobante-yape");


    if (!comprobante || !comprobante.files.length) {

      alert(
        "Debes adjuntar el comprobante de pago de Yape."
      );

      return;
    }

  }


  // Crear código
  codigoPedidoActual =
    generarCodigoPedido();


  const codigoElemento =
    document.getElementById("codigo-pedido");


  if (codigoElemento) {

    codigoElemento.innerText =
      codigoPedidoActual;

  }


  // Calcular tiempo
  calcularTiempoPedido();


  // Cerrar pago
  const pagoOverlay =
    document.getElementById("pago-overlay");


  if (pagoOverlay) {

    pagoOverlay.classList.add("hidden");

  }


  // Abrir seguimiento
  const seguimiento =
    document.getElementById("seguimiento-overlay");


  if (seguimiento) {

    seguimiento.classList.remove("hidden");

  }


  // Cambiar estado
  mostrarEstadoRecibido();

}


// ==========================================
// GENERAR CÓDIGO DE PEDIDO
// ==========================================

function generarCodigoPedido() {

  const fecha = new Date();


  const año =
    String(fecha.getFullYear()).slice(-2);


  const mes =
    String(fecha.getMonth() + 1)
      .padStart(2, "0");


  const dia =
    String(fecha.getDate())
      .padStart(2, "0");


  const numero =
    String(
      Math.floor(Math.random() * 900) + 100
    );


  return `GP-${año}${mes}${dia}-${numero}`;

}


// ==========================================
// CALCULAR TIEMPO DE PREPARACIÓN
// ==========================================

function calcularTiempoPedido() {

  let minutos = 10;


  const tieneBebida =
    pedido.some(item => {

      const nombre =
        item.producto.toLowerCase();


      return (

        nombre.includes("frappé") ||
        nombre.includes("frappe") ||

        nombre.includes("limonada") ||

        nombre.includes("chicha") ||

        nombre.includes("café") ||
        nombre.includes("cafe") ||

        nombre.includes("capuccino") ||

        nombre.includes("mate") ||

        nombre.includes("infusión") ||
        nombre.includes("infusion")

      );

    });


  // Si existe alguna bebida:
  // +2 minutos una sola vez

  if (tieneBebida) {

    minutos += 2;

  }


  const elemento =
    document.getElementById("minutos-pedido");


  if (elemento) {

    elemento.innerText =
      `${minutos} min`;

  }

}


// ==========================================
// ESTADO: PEDIDO RECIBIDO
// ==========================================

function mostrarEstadoRecibido() {

  const estado =
    document.getElementById("estado-pedido");

  const mensaje =
    document.getElementById("mensaje-pedido");

  const tiempo =
    document.getElementById("tiempo-pedido");


  if (estado) {

    estado.innerText =
      "🟡 PEDIDO RECIBIDO";

    estado.className =
      "estado-pedido recibido";

  }


  if (mensaje) {

    mensaje.innerText =
      "Tu pedido fue recibido correctamente. Esperando que nuestro personal comience la preparación.";

  }


  // Por ahora el tiempo todavía no se muestra
  // porque aparecerá cuando el personal pulse PREPARAR.

  if (tiempo) {

    tiempo.classList.add("hidden");

  }

}


// ==========================================
// ENVIAR PEDIDO CONFIRMADO A WHATSAPP
// ==========================================

function enviarWhatsAppConfirmado() {

  if (pedido.length === 0) {
    return;
  }


  let msg =
    "🍕 *NUEVO PEDIDO - GOLDEN PIZZERIA*\n\n";


  msg +=
    `📋 *Pedido:* ${codigoPedidoActual}\n\n`;


  pedido.forEach((item, i) => {

    msg +=
      `${i + 1}. ${item.producto} - S/ ${item.precio.toFixed(2)}\n`;

  });


  msg +=
    `\n💰 *Total:* S/ ${total.toFixed(2)}`;


  msg +=
    `\n💳 *Pago:* ${obtenerNombrePago()}`;


  msg +=
    "\n\n🟡 *Estado: PEDIDO RECIBIDO*";


  const url =
    `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(msg)}`;


  window.open(url, "_blank");

}


// ==========================================
// NOMBRE DEL MEDIO DE PAGO
// ==========================================

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

  return "No seleccionado";

}


// ==========================================
// FUNCIÓN ANTIGUA DE WHATSAPP
// ==========================================
// La dejamos para evitar errores si algún botón
// antiguo todavía la utiliza.

function enviarWhatsApp() {

  if (pedido.length === 0) {
    return;
  }


  let msg =
    "¡Hola Golden Pizzeria! 🍕 Quisiera realizar el siguiente pedido:\n\n";


  pedido.forEach((item, i) => {

    msg +=
      `${i + 1}. ${item.producto} - S/ ${item.precio.toFixed(2)}\n`;

  });


  msg +=
    `\n*Total a pagar:* S/ ${total.toFixed(2)}`;


  const url =
    `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(msg)}`;


  window.open(url, "_blank");

}
