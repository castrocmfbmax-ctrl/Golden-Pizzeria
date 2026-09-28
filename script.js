// ==========================================
// GOLDEN PIZZERIA - SCRIPT.JS COMPLETO
// ==========================================

// ==========================================
// 1. ESTADO GLOBAL
// ==========================================

let carrito = [];

let tiempoRestante = 15 * 60;
let tiempoTolerancia = 20 * 60;
let temporizadorIntervalo = null;

let pizzaSeleccionadaActual = {};

const SEDES_GOLDEN = {
  "Av. Miguel Grau 736": {
    telefono: "992911116",
    mesas: 4
  },
  "Calle César Vallejo 100": {
    telefono: "932399922",
    mesas: 4
  },
  "Av. Argentina 1432": {
    telefono: "994710034",
    mesas: 6
  }
};

const NUMERO_YAPE = "979 707 173";
const CLAVE_RESERVAS = "golden_reservas";
const CLAVE_PEDIDO_ACTUAL = "golden_pedido_actual";
const CLAVE_SECUENCIA = "golden_secuencia_pedidos";

document.addEventListener("DOMContentLoaded", () => {
  crearEstructuraModalesYCarrito();
});


// ==========================================
// 2. TEMPORIZADOR
// ==========================================

function iniciarTemporizadorCocina() {

  if (temporizadorIntervalo) {
    clearInterval(temporizadorIntervalo);
  }

  const timerBanner = document.getElementById("timer-banner");

  if (timerBanner) {
    timerBanner.style.display = "flex";
  }

  const timerElement = document.getElementById("timer-display");
  const statusElement = document.getElementById("timer-status");

  if (!timerElement) return;

  tiempoRestante = 15 * 60;
  tiempoTolerancia = 20 * 60;

  temporizadorIntervalo = setInterval(() => {

    if (tiempoRestante > 0) {

      tiempoRestante--;

      let minutos = Math.floor(tiempoRestante / 60);
      let segundos = tiempoRestante % 60;

      timerElement.innerText =
        `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;

      if (statusElement) {
        statusElement.innerText = "🔥 En horno a la piedra (15 min)";
        statusElement.style.color = "#ffca3a";
      }

    } else if (tiempoTolerancia > 0) {

      tiempoTolerancia--;

      let minutos = Math.floor(tiempoTolerancia / 60);
      let segundos = tiempoTolerancia % 60;

      timerElement.innerText =
        `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;

      if (statusElement) {
        statusElement.innerText = "⏳ Tiempo de tolerancia (Máx 20 min)";
        statusElement.style.color = "#ff6b6b";
      }

    } else {

      clearInterval(temporizadorIntervalo);

      timerElement.innerText = "00:00";

      if (statusElement) {
        statusElement.innerText =
          "⚠️ Tiempo cumplido. ¡Servir o entregar ya!";

        statusElement.style.color = "#ff4444";
      }
    }

  }, 1000);
}


function detenerTemporizadorCocina() {

  if (temporizadorIntervalo) {
    clearInterval(temporizadorIntervalo);
    temporizadorIntervalo = null;
  }

  const timerBanner = document.getElementById("timer-banner");

  if (timerBanner) {
    timerBanner.style.display = "none";
  }
}


// ==========================================
// 3. FILTROS Y BÚSQUEDA
// ==========================================

function filterCategory(categoria) {

  const botones = document.querySelectorAll(".filter-btn");

  botones.forEach(btn => btn.classList.remove("active"));

  if (typeof event !== "undefined" && event && event.target) {
    event.target.classList.add("active");
  }

  const tarjetas = document.querySelectorAll(".product-grid .card");

  tarjetas.forEach(card => {

    if (
      categoria === "todas" ||
      card.classList.contains(categoria)
    ) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }

  });
}


function buscarProducto() {

  const inputElement = document.getElementById("search-input");

  if (!inputElement) return;

  const input = inputElement.value.toLowerCase();

  const tarjetas =
    document.querySelectorAll(".product-grid .card");

  tarjetas.forEach(card => {

    const tituloElement = card.querySelector("h3");
    const descripcionElement = card.querySelector("p");

    const titulo =
      tituloElement ? tituloElement.innerText.toLowerCase() : "";

    const descripcion =
      descripcionElement
        ? descripcionElement.innerText.toLowerCase()
        : "";

    if (
      titulo.includes(input) ||
      descripcion.includes(input)
    ) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }

  });
}


// ==========================================
// 4. MODAL DE PIZZAS
// ==========================================

function abrirModalPizza(
  nombre,
  precioPersonal,
  precioMediana,
  precioFamiliar
) {

  pizzaSeleccionadaActual = {
    nombre,
    precioPersonal,
    precioMediana,
    precioFamiliar
  };

  const titulo = document.getElementById("modal-title");
  const cuerpo = document.getElementById("modal-body");
  const modal = document.getElementById("modal-custom");

  if (!titulo || !cuerpo || !modal) return;

  titulo.innerText = `Pizza ${nombre}`;

  cuerpo.innerHTML = `
    <p style="margin-bottom:10px; color:#ccc;">
      1. Selecciona el tamaño:
    </p>

    <div style="
      display:flex;
      flex-direction:column;
      gap:8px;
      margin-bottom:15px;
    ">

      <button
        type="button"
        class="btn-modal-opcion"
        onclick="seleccionarTamanoPizza('Personal', ${precioPersonal})"
      >
        🍕 Personal - S/ ${precioPersonal}.00
      </button>

      <button
        type="button"
        class="btn-modal-opcion"
        onclick="seleccionarTamanoPizza('Mediana', ${precioMediana})"
      >
        🍕 Mediana - S/ ${precioMediana}.00
      </button>

      <button
        type="button"
        class="btn-modal-opcion"
        onclick="seleccionarTamanoPizza('Familiar', ${precioFamiliar})"
      >
        🍕 Familiar - S/ ${precioFamiliar}.00
      </button>

    </div>
  `;

  modal.style.display = "flex";
}


// ==========================================
// 5. EXTRAS DE PIZZA
// ==========================================

function obtenerPrecioExtraPizza(tamano) {

  if (tamano === "Personal") {
    return 2;
  }

  if (tamano === "Mediana") {
    return 3;
  }

  if (tamano === "Familiar") {
    return 4;
  }

  return 0;
}


function seleccionarTamanoPizza(tamano, precioBase) {

  const precioExtra = obtenerPrecioExtraPizza(tamano);

  const cuerpo = document.getElementById("modal-body");

  if (!cuerpo) return;

  cuerpo.innerHTML = `

    <h4 style="
      color:#D4AF37;
      margin-bottom:10px;
    ">
      Tamaño: ${tamano} (S/ ${precioBase}.00)
    </h4>

    <p style="
      margin-bottom:10px;
      color:#ccc;
    ">
      2. ¿Deseas agregar adicionales?
    </p>

    <label style="
      display:block;
      margin-bottom:10px;
      cursor:pointer;
    ">

      <input
        type="checkbox"
        id="extra-queso"
        value="${precioExtra}"
      >

      Extra Queso Mozzarella
      (+S/ ${precioExtra}.00)

    </label>

    <label style="
      display:block;
      margin-bottom:15px;
      cursor:pointer;
    ">

      <input
        type="checkbox"
        id="extra-embutido"
        value="${precioExtra}"
      >

      Extra Embutido
      (+S/ ${precioExtra}.00)

    </label>

    <button
      class="btn-modal-opcion"
      style="
        text-align:center;
        background:#D4AF37;
        color:#000;
      "
      onclick="
        confirmarPizzaConExtras(
          '${tamano}',
          ${precioBase}
        )
      "
    >
      🛒 AGREGAR AL PEDIDO
    </button>

  `;
}


function confirmarPizzaConExtras(tamano, precioBase) {

  const chkQueso =
    document.getElementById("extra-queso");

  const chkEmbutido =
    document.getElementById("extra-embutido");

  const precioExtra =
    obtenerPrecioExtraPizza(tamano);

  let extras = [];

  let precioFinal = Number(precioBase);

  if (chkQueso && chkQueso.checked) {

    extras.push("Extra Queso");

    precioFinal += precioExtra;
  }

  if (chkEmbutido && chkEmbutido.checked) {

    extras.push("Extra Embutido");

    precioFinal += precioExtra;
  }

  let textoExtras =
    extras.length > 0
      ? ` + [${extras.join(", ")}]`
      : "";

  const nombreCompleto =
    `Pizza ${pizzaSeleccionadaActual.nombre} (${tamano})${textoExtras}`;

  agregarPedido(
    nombreCompleto,
    precioFinal
  );

  cerrarModal();
}


// ==========================================
// 6. PIZZETAS
// ==========================================

function abrirModalPizzeta() {

  const titulo =
    document.getElementById("modal-title");

  const cuerpo =
    document.getElementById("modal-body");

  const modal =
    document.getElementById("modal-custom");

  if (!titulo || !cuerpo || !modal) return;

  titulo.innerText = "Pizzetas";

  cuerpo.innerHTML = `

    <p style="
      margin-bottom:15px;
      color:#ccc;
    ">
      Elige tu sabor:
    </p>

    <div style="
      display:flex;
      flex-direction:column;
      gap:10px;
    ">

      <button
        class="btn-modal-opcion"
        onclick="
          confirmarAgregarGenerico(
            'Pizzeta Americana',
            5
          )
        "
      >
        🍕 Pizzeta Americana - S/ 5.00
      </button>

      <button
        class="btn-modal-opcion"
        onclick="
          confirmarAgregarGenerico(
            'Pizzeta Hawaiana',
            6
          )
        "
      >
        🍕 Pizzeta Hawaiana - S/ 6.00
      </button>

      <button
        class="btn-modal-opcion"
        onclick="
          confirmarAgregarGenerico(
            'Pizzeta Pepperoni',
            7
          )
        "
      >
        🍕 Pizzeta Pepperoni - S/ 7.00
      </button>

    </div>

  `;

  modal.style.display = "flex";
}


// ==========================================
// 7. CUMPLEAÑOS
// ==========================================

function abrirModalCumpleanos(tipo) {

  const titulo =
    document.getElementById("modal-title");

  const cuerpo =
    document.getElementById("modal-body");

  const modal =
    document.getElementById("modal-custom");

  if (!titulo || !cuerpo || !modal) return;

  if (tipo === "pack") {

    titulo.innerText =
      "Pack Cumpleañero";

    cuerpo.innerHTML = `

      <p style="
        margin-bottom:15px;
        color:#ccc;
      ">
        Incluye 2 Familiares + Gaseosa 1.5L + Sorpresa.
      </p>

      <button
        class="btn-modal-opcion"
        onclick="
          confirmarAgregarGenerico(
            'Pack Cumpleañero Golden',
            75
          )
        "
      >
        🎉 Confirmar Pack Cumpleañero - S/ 75.00
      </button>

    `;

  } else if (tipo === "especial") {

    titulo.innerText =
      "Promo Cumpleañero Especial";

    cuerpo.innerHTML = `

      <p style="
        margin-bottom:15px;
        color:#ccc;
      ">
        Incluye 1 Familiar + Pan al Ajo + Bebida + Regalo.
      </p>

      <button
        class="btn-modal-opcion"
        onclick="
          confirmarAgregarGenerico(
            'Promo Cumpleañero Especial',
            48
          )
        "
      >
        🎉 Confirmar Promo Especial - S/ 48.00
      </button>

    `;
  }

  modal.style.display = "flex";
}


// ==========================================
// 8. KIDS
// ==========================================

function abrirModalKids(tipoCombo) {

  const titulo =
    document.getElementById("modal-title");

  const cuerpo =
    document.getElementById("modal-body");

  const modal =
    document.getElementById("modal-custom");

  if (!titulo || !cuerpo || !modal) return;

  let opcionesHTML = "";

  if (tipoCombo === "mini") {

    titulo.innerText =
      "Combo Mini Mágica";

    opcionesHTML = `

      <button
        class="btn-modal-opcion"
        onclick="
          confirmarAgregarGenerico(
            'Combo Mini Mágica (Jamón y Queso)',
            18
          )
        "
      >
        🍕 Jamón y Queso + Bebida + Dulce - S/ 18.00
      </button>

      <button
        class="btn-modal-opcion"
        onclick="
          confirmarAgregarGenerico(
            'Combo Mini Mágica (Salchicha)',
            18
          )
        "
      >
        🍕 Salchicha Frankfurter + Bebida + Dulce - S/ 18.00
      </button>

    `;

  } else if (tipoCombo === "junior") {

    titulo.innerText =
      "Caja Golden Junior";

    opcionesHTML = `

      <button
        class="btn-modal-opcion"
        onclick="
          confirmarAgregarGenerico(
            'Caja Golden Junior (Pepperoni)',
            22
          )
        "
      >
        🍕 Pepperoni Sonriente + Pan al Ajo - S/ 22.00
      </button>

    `;
  }

  cuerpo.innerHTML = `

    <p style="
      margin-bottom:15px;
      color:#ccc;
    ">
      Elige la opción infantil:
    </p>

    <div style="
      display:flex;
      flex-direction:column;
      gap:10px;
    ">

      ${opcionesHTML}

    </div>
  `;

  modal.style.display = "flex";
}


// ==========================================
// 9. FRAPPÉS
// ==========================================

function abrirModalFrappe(tipo) {

  const titulo =
    document.getElementById("modal-title");

  const cuerpo =
    document.getElementById("modal-body");

  const modal =
    document.getElementById("modal-custom");

  if (!titulo || !cuerpo || !modal) return;

  let opcionesHTML = "";

  if (tipo === "fruta") {

    const frutas = [
      "Maracuyá",
      "Fresa",
      "Mango",
      "Lúcuma"
    ];

    frutas.forEach(fruta => {

      opcionesHTML += `

        <button
          type="button"
          class="btn-modal-opcion"
          onclick="
            confirmarAgregarGenerico(
              'Frappé de ${fruta}',
              10
            )
          "
        >
          🍧 Frappé de ${fruta} - S/ 10.00
        </button>

      `;
    });

    titulo.innerText =
      "Frappé de Fruta";

  } else if (tipo === "especial") {

    const especiales = [
      "Cappuccino",
      "Galleta Oreo"
    ];

    especiales.forEach(esp => {

      opcionesHTML += `

        <button
          type="button"
          class="btn-modal-opcion"
          onclick="
            confirmarAgregarGenerico(
              'Frappé de ${esp}',
              9
            )
          "
        >
          ☕ Frappé de ${esp} - S/ 9.00
        </button>

      `;
    });

    titulo.innerText =
      "Frappé Especial";
  }

  cuerpo.innerHTML = `

    <p style="
      margin-bottom:15px;
      color:#ccc;
    ">
      Selecciona tu sabor favorito:
    </p>

    <div style="
      display:flex;
      flex-direction:column;
      gap:10px;
    ">

      ${opcionesHTML}

    </div>
  `;

  modal.style.display = "flex";
}


// ==========================================
// 10. PRODUCTOS GENÉRICOS
// ==========================================

function confirmarAgregarGenerico(nombre, precio) {

  agregarPedido(
    nombre,
    precio
  );

  cerrarModal();
}


function cerrarModal() {

  const modal =
    document.getElementById("modal-custom");

  if (modal) {
    modal.style.display = "none";
  }
}


// ==========================================
// 11. CARRITO
// ==========================================

function agregarPedido(nombre, precio) {

  const itemExistente =
    carrito.find(
      p => p.nombre === nombre
    );

  if (itemExistente) {

    itemExistente.cantidad += 1;

  } else {

    carrito.push({
      nombre: nombre,
      precio: Number(precio),
      cantidad: 1
    });
  }

  actualizarCarritoUI();

  const drawer =
    document.getElementById("drawer-carrito");

  if (drawer) {
    drawer.classList.add("open");
  }
}


function cambiarCantidad(index, delta) {

  if (!carrito[index]) return;

  carrito[index].cantidad += delta;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }

  actualizarCarritoUI();
}


function vaciarCarrito() {

  carrito = [];

  actualizarCarritoUI();
}


function obtenerTotalCarrito() {

  return carrito.reduce(
    (total, item) =>
      total + item.precio * item.cantidad,
    0
  );
}


function actualizarCarritoUI() {

  const listaContenedor =
    document.getElementById("carrito-items");

  const contadorBadge =
    document.getElementById("carrito-count");

  const totalMonto =
    document.getElementById("carrito-total");

  if (!listaContenedor) return;

  listaContenedor.innerHTML = "";

  let total = 0;
  let totalItems = 0;

  carrito.forEach((item, index) => {

    const subtotal =
      item.precio * item.cantidad;

    total += subtotal;

    totalItems += item.cantidad;

    const itemHTML = `

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:10px 0;
        border-bottom:1px solid #333;
      ">

        <div>

          <div style="
            font-weight:bold;
            color:#D4AF37;
          ">
            ${item.nombre}
          </div>

          <div style="
            font-size:0.85rem;
            color:#aaa;
          ">
            S/ ${item.precio.toFixed(2)} c/u
          </div>

        </div>

        <div style="
          display:flex;
          align-items:center;
          gap:8px;
        ">

          <button
            onclick="cambiarCantidad(${index}, -1)"
            style="
              background:#333;
              color:white;
              border:none;
              border-radius:3px;
              padding:2px 8px;
              cursor:pointer;
            "
          >
            -
          </button>

          <span>
            ${item.cantidad}
          </span>

          <button
            onclick="cambiarCantidad(${index}, 1)"
            style="
              background:#333;
              color:white;
              border:none;
              border-radius:3px;
              padding:2px 8px;
              cursor:pointer;
            "
          >
            +
          </button>

          <span style="
            font-weight:bold;
            margin-left:10px;
          ">
            S/ ${subtotal.toFixed(2)}
          </span>

        </div>

      </div>
    `;

    listaContenedor.innerHTML += itemHTML;
  });

  if (carrito.length === 0) {

    listaContenedor.innerHTML = `

      <p style="
        color:#aaa;
        text-align:center;
        margin-top:20px;
      ">
        Tu carrito está vacío.
      </p>

    `;
  }

  if (contadorBadge) {
    contadorBadge.innerText =
      totalItems;
  }

  if (totalMonto) {
    totalMonto.innerText =
      `S/ ${total.toFixed(2)}`;
  }
}


// ==========================================
// 12. DATOS DEL CLIENTE
// ==========================================

function validarTelefonoPeru(telefono) {

  const limpio =
    String(telefono)
      .replace(/\s+/g, "")
      .replace(/-/g, "");

  return /^9\d{8}$/.test(limpio);
}


function escaparHTML(texto) {

  return String(texto || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ==========================================
// 13. CHECKOUT
// ==========================================

function abrirCheckout() {

  if (carrito.length === 0) {

    alert(
      "Tu carrito está vacío. Agrega productos primero."
    );

    return;
  }

  const modalExistente =
    document.getElementById("checkout-golden");

  if (modalExistente) {
    modalExistente.remove();
  }

  const total =
    obtenerTotalCarrito();

  const modalHTML = `

    <div
      id="checkout-golden"
      style="
        display:flex;
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.90);
        z-index:5000;
        justify-content:center;
        align-items:center;
        padding:15px;
        overflow-y:auto;
      "
    >

      <div
        style="
          width:100%;
          max-width:520px;
          background:#140e0b;
          color:white;
          border:1px solid #D4AF37;
          border-radius:14px;
          padding:24px;
          position:relative;
          box-shadow:0 0 30px rgba(212,175,55,.25);
          max-height:95vh;
          overflow-y:auto;
        "
      >

        <button
          onclick="cerrarCheckout()"
          style="
            position:absolute;
            right:15px;
            top:10px;
            background:none;
            border:none;
            color:white;
            font-size:28px;
            cursor:pointer;
          "
        >
          &times;
        </button>

        <h2 style="
          color:#D4AF37;
          margin-bottom:5px;
        ">
          Confirmar pedido
        </h2>

        <p style="
          color:#aaa;
          margin-bottom:20px;
        ">
          Completa tus datos para finalizar.
        </p>


        <label>Nombre *</label>

        <input
          id="cliente-nombres"
          type="text"
          placeholder="Nombres"
          autocomplete="given-name"
          style="${estiloInputCheckout()}"
        >


        <label>Apellidos *</label>

        <input
          id="cliente-apellidos"
          type="text"
          placeholder="Apellidos"
          autocomplete="family-name"
          style="${estiloInputCheckout()}"
        >


        <label>Celular peruano *</label>

        <input
          id="cliente-telefono"
          type="tel"
          inputmode="numeric"
          maxlength="9"
          placeholder="9XXXXXXXX"
          style="${estiloInputCheckout()}"
        >


        <label>Sede *</label>

        <select
          id="cliente-sede"
          onchange="actualizarCheckoutSede()"
          style="${estiloInputCheckout()}"
        >

          <option value="">
            Selecciona una sede
          </option>

          <option value="Av. Miguel Grau 736">
            Av. Miguel Grau 736
          </option>

          <option value="Calle César Vallejo 100">
            Calle César Vallejo 100
          </option>

          <option value="Av. Argentina 1432">
            Av. Argentina 1432
          </option>

        </select>


        <label>Modalidad *</label>

        <div style="
          display:flex;
          gap:8px;
          margin-bottom:15px;
        ">

          <button
            type="button"
            id="btn-modalidad-local"
            onclick="seleccionarModalidadPedido('local')"
            style="${estiloBotonSeleccionCheckout()}"
          >
            🏪 Recoger en local
          </button>

          <button
            type="button"
            id="btn-modalidad-delivery"
            onclick="seleccionarModalidadPedido('delivery')"
            style="${estiloBotonSeleccionCheckout()}"
          >
            🛵 Delivery
          </button>

        </div>

        <input
          type="hidden"
          id="cliente-modalidad"
          value=""
        >


        <div id="datos-delivery" style="display:none;">

          <label>Dirección *</label>

          <input
            id="cliente-direccion"
            type="text"
            placeholder="Dirección de entrega"
            style="${estiloInputCheckout()}"
          >

          <label>Referencia *</label>

          <input
            id="cliente-referencia"
            type="text"
            placeholder="Referencia para encontrar el domicilio"
            style="${estiloInputCheckout()}"
          >

        </div>


        <label>Forma de pago *</label>

        <div style="
          display:flex;
          flex-direction:column;
          gap:8px;
          margin-bottom:15px;
        ">

          <button
            type="button"
            onclick="seleccionarPagoPedido('Efectivo')"
            id="pago-efectivo"
            style="${estiloBotonSeleccionCheckout()}"
          >
            💵 Efectivo
          </button>

          <button
            type="button"
            onclick="seleccionarPagoPedido('Tarjeta')"
            id="pago-tarjeta"
            style="${estiloBotonSeleccionCheckout()}"
          >
            💳 Tarjeta
          </button>

          <button
            type="button"
            onclick="seleccionarPagoPedido('Yape')"
            id="pago-yape"
            style="${estiloBotonSeleccionCheckout()}"
          >
            📱 Yape
          </button>

        </div>

        <input
          type="hidden"
          id="cliente-pago"
          value=""
        >


        <div
          id="info-pago-yape"
          style="
            display:none;
            background:#211812;
            border:1px solid #D4AF37;
            border-radius:8px;
            padding:12px;
            margin-bottom:15px;
          "
        >

          <strong style="color:#D4AF37;">
            📱 Pago por Yape
          </strong>

          <p style="
            margin-top:8px;
            color:#ddd;
          ">
            Número Yape:
            <strong>${NUMERO_YAPE}</strong>
          </p>

          <p style="
            margin-top:8px;
            color:#aaa;
            font-size:.9rem;
          ">
            Debes adjuntar obligatoriamente
            la captura de tu comprobante.
          </p>

          <input
            id="comprobante-yape"
            type="file"
            accept="image/*"
            style="
              margin-top:10px;
              width:100%;
              color:white;
            "
          >

        </div>


        <div style="
          border-top:1px solid #333;
          margin-top:15px;
          padding-top:15px;
        ">

          <div style="
            display:flex;
            justify-content:space-between;
            font-size:1.2rem;
            font-weight:bold;
          ">

            <span>
              Total:
            </span>

            <span style="
              color:#D4AF37;
            ">
              S/ ${total.toFixed(2)}
            </span>

          </div>

        </div>


        <button
          onclick="confirmarPedidoCompleto()"
          style="
            width:100%;
            margin-top:18px;
            padding:14px;
            border:none;
            border-radius:8px;
            background:#25D366;
            color:white;
            font-weight:bold;
            font-size:1rem;
            cursor:pointer;
          "
        >
          ✅ CONFIRMAR PEDIDO
        </button>

      </div>

    </div>
  `;

  document.body.insertAdjacentHTML(
    "beforeend",
    modalHTML
  );
}


function estiloInputCheckout() {

  return `
    width:100%;
    padding:11px;
    margin-top:5px;
    margin-bottom:13px;
    border-radius:7px;
    border:1px solid #555;
    background:#0d0a08;
    color:white;
    outline:none;
  `;
}


function estiloBotonSeleccionCheckout() {

  return `
    flex:1;
    padding:11px;
    border:1px solid #D4AF37;
    border-radius:7px;
    background:#1a120e;
    color:white;
    cursor:pointer;
    font-weight:bold;
  `;
}


function cerrarCheckout() {

  const modal =
    document.getElementById(
      "checkout-golden"
    );

  if (modal) {
    modal.remove();
  }
}


function actualizarCheckoutSede() {

  const select =
    document.getElementById(
      "cliente-sede"
    );

  if (!select) return;

  const sede =
    select.value;

  const modalidad =
    document.getElementById(
      "cliente-modalidad"
    );

  if (
    modalidad &&
    modalidad.value === "local" &&
    sede
  ) {

    const datos =
      SEDES_GOLDEN[sede];

    if (datos) {

      // La información se mantiene
      // disponible para la confirmación.
    }
  }
}


function seleccionarModalidadPedido(modalidad) {

  const campo =
    document.getElementById(
      "cliente-modalidad"
    );

  const delivery =
    document.getElementById(
      "datos-delivery"
    );

  if (!campo || !delivery) return;

  campo.value = modalidad;

  if (modalidad === "delivery") {

    delivery.style.display = "block";

  } else {

    delivery.style.display = "none";
  }
}


function seleccionarPagoPedido(pago) {

  const campo =
    document.getElementById(
      "cliente-pago"
    );

  const yape =
    document.getElementById(
      "info-pago-yape"
    );

  if (!campo || !yape) return;

  campo.value = pago;

  if (pago === "Yape") {

    yape.style.display = "block";

  } else {

    yape.style.display = "none";
  }

  const botones = [
    "pago-efectivo",
    "pago-tarjeta",
    "pago-yape"
  ];

  botones.forEach(id => {

    const boton =
      document.getElementById(id);

    if (!boton) return;

    boton.style.background =
      "#1a120e";

    boton.style.color =
      "white";
  });

  const mapa = {
    "Efectivo": "pago-efectivo",
    "Tarjeta": "pago-tarjeta",
    "Yape": "pago-yape"
  };

  const botonActivo =
    document.getElementById(
      mapa[pago]
    );

  if (botonActivo) {

    botonActivo.style.background =
      "#D4AF37";

    botonActivo.style.color =
      "#000";
  }
}


// ==========================================
// 14. CÓDIGO DE PEDIDO
// ==========================================

function generarCodigoPedido() {

  const ahora = new Date();

  const yy =
    String(ahora.getFullYear()).slice(-2);

  const mm =
    String(
      ahora.getMonth() + 1
    ).padStart(2, "0");

  const dd =
    String(
      ahora.getDate()
    ).padStart(2, "0");

  const fecha =
    `${yy}${mm}${dd}`;

  let datos = {};

  try {

    datos =
      JSON.parse(
        localStorage.getItem(
          CLAVE_SECUENCIA
        )
      ) || {};

  } catch (error) {

    datos = {};
  }

  if (datos.fecha !== fecha) {

    datos = {
      fecha: fecha,
      numero: 0
    };
  }

  datos.numero += 1;

  localStorage.setItem(
    CLAVE_SECUENCIA,
    JSON.stringify(datos)
  );

  return `
    GP-${fecha}-${String(datos.numero).padStart(3, "0")}
  `;
}


// ==========================================
// 15. CONFIRMAR PEDIDO
// ==========================================

function confirmarPedidoCompleto() {

  if (carrito.length === 0) {

    alert(
      "Tu carrito está vacío."
    );

    return;
  }

  const nombres =
    document.getElementById(
      "cliente-nombres"
    )?.value.trim();

  const apellidos =
    document.getElementById(
      "cliente-apellidos"
    )?.value.trim();

  const telefono =
    document.getElementById(
      "cliente-telefono"
    )?.value.trim();

  const sede =
    document.getElementById(
      "cliente-sede"
    )?.value;

  const modalidad =
    document.getElementById(
      "cliente-modalidad"
    )?.value;

  const pago =
    document.getElementById(
      "cliente-pago"
    )?.value;

  if (!nombres) {

    alert(
      "Ingresa tus nombres."
    );

    return;
  }

  if (!apellidos) {

    alert(
      "Ingresa tus apellidos."
    );

    return;
  }

  if (!validarTelefonoPeru(telefono)) {

    alert(
      "Ingresa un número de celular peruano válido de 9 dígitos que empiece con 9."
    );

    return;
  }

  if (!sede || !SEDES_GOLDEN[sede]) {

    alert(
      "Selecciona una sede."
    );

    return;
  }

  if (!modalidad) {

    alert(
      "Selecciona si recogerás en local o deseas delivery."
    );

    return;
  }

  let direccion = "";
  let referencia = "";

  if (modalidad === "delivery") {

    direccion =
      document.getElementById(
        "cliente-direccion"
      )?.value.trim();

    referencia =
      document.getElementById(
        "cliente-referencia"
      )?.value.trim();

    if (!direccion) {

      alert(
        "La dirección de delivery es obligatoria."
      );

      return;
    }

    if (!referencia) {

      alert(
        "La referencia de delivery es obligatoria."
      );

      return;
    }
  }

  if (!pago) {

    alert(
      "Selecciona una forma de pago."
    );

    return;
  }

  let nombreComprobante = "";

  if (pago === "Yape") {

    const comprobante =
      document.getElementById(
        "comprobante-yape"
      );

    if (
      !comprobante ||
      !comprobante.files ||
      comprobante.files.length === 0
    ) {

      alert(
        "Para pagar con Yape debes seleccionar la captura del comprobante."
      );

      return;
    }

    nombreComprobante =
      comprobante.files[0].name;
  }

  const codigo =
    generarCodigoPedido();

  const total =
    obtenerTotalCarrito();

  const pedido = {

    codigo: codigo,

    cliente: {

      nombres: nombres,

      apellidos: apellidos,

      telefono: telefono

    },

    sede: sede,

    modalidad: modalidad,

    direccion: direccion,

    referencia: referencia,

    pago: pago,

    comprobanteYape:
      nombreComprobante,

    productos:
      JSON.parse(
        JSON.stringify(carrito)
      ),

    total: total,

    estado:
      "PEDIDO RECIBIDO",

    fecha:
      new Date().toISOString()

  };

  localStorage.setItem(
    CLAVE_PEDIDO_ACTUAL,
    JSON.stringify(pedido)
  );

  enviarWhatsAppPorSede(
    pedido
  );

  cerrarCheckout();

  const drawer =
    document.getElementById(
      "drawer-carrito"
    );

  if (drawer) {
    drawer.classList.remove("open");
  }

  alert(
    `Pedido ${codigo} registrado correctamente.\n\nAhora se abrirá WhatsApp para enviar los datos del pedido a la sede seleccionada.`
  );
}


// ==========================================
// 16. WHATSAPP SEGÚN SEDE
// ==========================================

function enviarWhatsAppPorSede(pedido) {

  const datosSede =
    SEDES_GOLDEN[pedido.sede];

  if (!datosSede) {

    alert(
      "No se encontró el número de WhatsApp de la sede."
    );

    return;
  }

  let mensaje =
    "🍕 *NUEVO PEDIDO - GOLDEN PIZZERIA* 🍕\n\n";

  mensaje +=
    `🧾 *PEDIDO:* ${pedido.codigo}\n\n`;

  mensaje +=
    "👤 *DATOS DEL CLIENTE*\n";

  mensaje +=
    `• Nombres: ${pedido.cliente.nombres}\n`;

  mensaje +=
    `• Apellidos: ${pedido.cliente.apellidos}\n`;

  mensaje +=
    `• Celular: ${pedido.cliente.telefono}\n\n`;

  mensaje +=
    "📍 *SEDE*\n";

  mensaje +=
    `${pedido.sede}\n\n`;

  mensaje +=
    "🛵 *MODALIDAD*\n";

  if (pedido.modalidad === "delivery") {

    mensaje +=
      "Delivery\n";

    mensaje +=
      `• Dirección: ${pedido.direccion}\n`;

    mensaje +=
      `• Referencia: ${pedido.referencia}\n\n`;

  } else {

    mensaje +=
      "Recojo en local\n\n";
  }

  mensaje +=
    "🛒 *DETALLE DEL PEDIDO*\n";

  pedido.productos.forEach(item => {

    const subtotal =
      item.precio * item.cantidad;

    mensaje +=
      `• ${item.cantidad}x ${item.nombre} - S/ ${subtotal.toFixed(2)}\n`;
  });

  mensaje +=
    `\n💰 *TOTAL:* S/ ${pedido.total.toFixed(2)}\n\n`;

  mensaje +=
    `💳 *FORMA DE PAGO:* ${pedido.pago}\n`;

  if (pedido.pago === "Yape") {

    mensaje +=
      `📱 Yape: ${NUMERO_YAPE}\n`;

    mensaje +=
      `📎 Comprobante seleccionado: ${pedido.comprobanteYape}\n`;

    mensaje +=
      "⚠️ *El cliente debe adjuntar manualmente la captura en este chat de WhatsApp.*\n";

  } else if (pedido.pago === "Efectivo") {

    mensaje +=
      "💵 Pago en efectivo al aproximarse al local.\n";

  } else if (pedido.pago === "Tarjeta") {

    mensaje +=
      "💳 Pago con tarjeta al aproximarse al local.\n";
  }

  mensaje +=
    "\n🟡 *ESTADO: PEDIDO RECIBIDO*";

  const numeroTelefono =
    "51" + datosSede.telefono;

  const url =
    `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;

  window.open(
    url,
    "_blank"
  );
}


// ==========================================
// 17. FUNCIÓN PRINCIPAL DEL BOTÓN WHATSAPP
// ==========================================

function enviarWhatsApp() {

  if (carrito.length === 0) {

    alert(
      "Tu carrito está vacío. Agrega productos primero."
    );

    return;
  }

  abrirCheckout();
}


// ==========================================
// 18. RESERVAS DE MESA
// ==========================================

function abrirModalReserva() {

  const existente =
    document.getElementById(
      "reserva-golden"
    );

  if (existente) {
    existente.remove();
  }

  const html = `

    <div
      id="reserva-golden"
      style="
        display:flex;
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.90);
        z-index:5100;
        justify-content:center;
        align-items:center;
        padding:15px;
        overflow-y:auto;
      "
    >

      <div
        style="
          width:100%;
          max-width:480px;
          background:#140e0b;
          color:white;
          border:1px solid #D4AF37;
          border-radius:14px;
          padding:24px;
          position:relative;
          max-height:95vh;
          overflow-y:auto;
        "
      >

        <button
          onclick="cerrarReserva()"
          style="
            position:absolute;
            right:15px;
            top:10px;
            background:none;
            border:none;
            color:white;
            font-size:28px;
            cursor:pointer;
          "
        >
          &times;
        </button>

        <h2 style="
          color:#D4AF37;
          margin-bottom:5px;
        ">
          🍽️ Reservar mesa
        </h2>

        <p style="
          color:#aaa;
          margin-bottom:20px;
        ">
          Completa tus datos para reservar.
        </p>


        <label>Nombre *</label>

        <input
          id="reserva-nombres"
          type="text"
          placeholder="Nombres"
          style="${estiloInputCheckout()}"
        >


        <label>Apellidos *</label>

        <input
          id="reserva-apellidos"
          type="text"
          placeholder="Apellidos"
          style="${estiloInputCheckout()}"
        >


        <label>Celular peruano *</label>

        <input
          id="reserva-telefono"
          type="tel"
          maxlength="9"
          inputmode="numeric"
          placeholder="9XXXXXXXX"
          style="${estiloInputCheckout()}"
        >


        <label>Sede *</label>

        <select
          id="reserva-sede"
          onchange="actualizarDisponibilidadReserva()"
          style="${estiloInputCheckout()}"
        >

          <option value="">
            Selecciona una sede
          </option>

          <option value="Av. Miguel Grau 736">
            Av. Miguel Grau 736 - 4 mesas
          </option>

          <option value="Calle César Vallejo 100">
            Calle César Vallejo 100 - 4 mesas
          </option>

          <option value="Av. Argentina 1432">
            Av. Argentina 1432 - 6 mesas
          </option>

        </select>


        <label>Fecha *</label>

        <input
          id="reserva-fecha"
          type="date"
          onchange="actualizarDisponibilidadReserva()"
          style="${estiloInputCheckout()}"
        >


        <label>Hora *</label>

        <input
          id="reserva-hora"
          type="time"
          onchange="actualizarDisponibilidadReserva()"
          style="${estiloInputCheckout()}"
        >


        <div
          id="reserva-disponibilidad"
          style="
            background:#211812;
            border-radius:8px;
            padding:10px;
            margin-bottom:15px;
            color:#aaa;
          "
        >
          Selecciona sede, fecha y hora.
        </div>


        <button
          onclick="confirmarReserva()"
          style="
            width:100%;
            padding:14px;
            border:none;
            border-radius:8px;
            background:#D4AF37;
            color:#000;
            font-weight:bold;
            cursor:pointer;
          "
        >
          🍽️ CONFIRMAR RESERVA
        </button>

      </div>

    </div>
  `;

  document.body.insertAdjacentHTML(
    "beforeend",
    html
  );
}


function cerrarReserva() {

  const modal =
    document.getElementById(
      "reserva-golden"
    );

  if (modal) {
    modal.remove();
  }
}


function obtenerReservas() {

  try {

    return JSON.parse(
      localStorage.getItem(
        CLAVE_RESERVAS
      )
    ) || [];

  } catch (error) {

    return [];
  }
}


function guardarReservas(reservas) {

  localStorage.setItem(
    CLAVE_RESERVAS,
    JSON.stringify(reservas)
  );
}


function actualizarDisponibilidadReserva() {

  const sede =
    document.getElementById(
      "reserva-sede"
    )?.value;

  const fecha =
    document.getElementById(
      "reserva-fecha"
    )?.value;

  const hora =
    document.getElementById(
      "reserva-hora"
    )?.value;

  const resultado =
    document.getElementById(
      "reserva-disponibilidad"
    );

  if (!resultado) return;

  if (!sede || !fecha || !hora) {

    resultado.innerHTML =
      "Selecciona sede, fecha y hora.";

    return;
  }

  const datosSede =
    SEDES_GOLDEN[sede];

  if (!datosSede) return;

  const reservas =
    obtenerReservas();

  const ocupadas =
    reservas.filter(
      reserva =>
        reserva.sede === sede &&
        reserva.fecha === fecha &&
        reserva.hora === hora
    ).length;

  const disponibles =
    datosSede.mesas - ocupadas;

  if (disponibles > 0) {

    resultado.innerHTML = `

      <span style="color:#2ecc71;">
        🟢 Hay ${disponibles} mesa(s) disponible(s).
      </span>

    `;

  } else {

    resultado.innerHTML = `

      <span style="color:#ff6b6b;">
        🔴 No hay mesas disponibles para ese horario.
      </span>

    `;
  }
}


function confirmarReserva() {

  const nombres =
    document.getElementById(
      "reserva-nombres"
    )?.value.trim();

  const apellidos =
    document.getElementById(
      "reserva-apellidos"
    )?.value.trim();

  const telefono =
    document.getElementById(
      "reserva-telefono"
    )?.value.trim();

  const sede =
    document.getElementById(
      "reserva-sede"
    )?.value;

  const fecha =
    document.getElementById(
      "reserva-fecha"
    )?.value;

  const hora =
    document.getElementById(
      "reserva-hora"
    )?.value;

  if (!nombres) {

    alert(
      "Ingresa tus nombres."
    );

    return;
  }

  if (!apellidos) {

    alert(
      "Ingresa tus apellidos."
    );

    return;
  }

  if (!validarTelefonoPeru(telefono)) {

    alert(
      "Ingresa un celular peruano válido."
    );

    return;
  }

  if (!sede) {

    alert(
      "Selecciona una sede."
    );

    return;
  }

  if (!fecha) {

    alert(
      "Selecciona una fecha."
    );

    return;
  }

  if (!hora) {

    alert(
      "Selecciona una hora."
    );

    return;
  }

  const datosSede =
    SEDES_GOLDEN[sede];

  const reservas =
    obtenerReservas();

  const ocupadas =
    reservas.filter(
      reserva =>
        reserva.sede === sede &&
        reserva.fecha === fecha &&
        reserva.hora === hora
    ).length;

  if (ocupadas >= datosSede.mesas) {

    alert(
      "Lo sentimos, ya no quedan mesas disponibles para ese horario."
    );

    return;
  }

  const numeroMesa =
    ocupadas + 1;

  const reserva = {

    id:
      "RES-" +
      Date.now(),

    nombres:
      nombres,

    apellidos:
      apellidos,

    telefono:
      telefono,

    sede:
      sede,

    fecha:
      fecha,

    hora:
      hora,

    mesa:
      numeroMesa,

    estado:
      "RESERVADA",

    creada:
      new Date().toISOString()
  };

  reservas.push(
    reserva
  );

  guardarReservas(
    reservas
  );

  const numeroTelefono =
    "51" + datosSede.telefono;

  let mensaje =
    "🍽️ *RESERVA DE MESA - GOLDEN PIZZERIA* 🍽️\n\n";

  mensaje +=
    `👤 *Cliente:* ${nombres} ${apellidos}\n`;

  mensaje +=
    `📱 *Celular:* ${telefono}\n`;

  mensaje +=
    `📍 *Sede:* ${sede}\n`;

  mensaje +=
    `📅 *Fecha:* ${fecha}\n`;

  mensaje +=
    `⏰ *Hora:* ${hora}\n`;

  mensaje +=
    `🪑 *Mesa:* ${numeroMesa}\n`;

  mensaje +=
    "\n🟢 *RESERVA SOLICITADA*";

  const url =
    `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;

  cerrarReserva();

  window.open(
    url,
    "_blank"
  );

  alert(
    `Reserva registrada para ${fecha} a las ${hora}.`
  );
}


// ==========================================
// 19. ESTRUCTURA DINÁMICA
// ==========================================

function crearEstructuraModalesYCarrito() {

  const styles = `

    .btn-modal-opcion {

      background:#1a120e;
      color:white;
      border:1px solid #D4AF37;
      padding:12px;
      border-radius:8px;
      cursor:pointer;
      font-weight:bold;
      text-align:left;
      transition:background .2s;

    }

    .btn-modal-opcion:hover {

      background:#D4AF37;
      color:black;

    }

    .carrito-float-btn {

      position:fixed;
      bottom:20px;
      right:20px;
      background:#25D366;
      color:white;
      border:none;
      border-radius:50px;
      padding:12px 20px;
      font-weight:bold;
      font-size:1rem;
      box-shadow:0 4px 15px rgba(0,0,0,.8);
      cursor:pointer;
      z-index:1000;
      display:flex;
      align-items:center;
      gap:10px;

    }

    .drawer-carrito {

      position:fixed;
      top:0;
      right:-350px;
      width:320px;
      height:100vh;
      background:#120c0a;
      color:white;
      box-shadow:-5px 0 20px rgba(0,0,0,.9);
      z-index:1001;
      transition:right .3s ease;
      display:flex;
      flex-direction:column;
      padding:20px;
      border-left:1px solid #D4AF37;

    }

    .drawer-carrito.open {
      right:0;
    }

  `;

  const styleSheet =
    document.createElement("style");

  styleSheet.innerText =
    styles;

  document.head.appendChild(
    styleSheet
  );


  // ========================================
  // MODAL PIZZA
  // ========================================

  if (!document.getElementById("modal-custom")) {

    const modalHTML = `

      <div
        id="modal-custom"
        style="
          display:none;
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100vh;
          background:rgba(0,0,0,.85);
          z-index:2000;
          justify-content:center;
          align-items:center;
        "
      >

        <div
          style="
            background:#140e0b;
            color:white;
            padding:25px;
            border-radius:12px;
            border:1px solid #D4AF37;
            width:90%;
            max-width:400px;
            position:relative;
            box-shadow:0 0 20px rgba(212,175,55,.3);
          "
        >

          <button
            onclick="cerrarModal()"
            style="
              position:absolute;
              top:10px;
              right:15px;
              background:none;
              border:none;
              color:white;
              font-size:1.5rem;
              cursor:pointer;
            "
          >
            &times;
          </button>

          <h2
            id="modal-title"
            style="
              color:#D4AF37;
              margin-bottom:15px;
            "
          ></h2>

          <div id="modal-body"></div>

        </div>

      </div>

    `;

    document.body.insertAdjacentHTML(
      "beforeend",
      modalHTML
    );
  }


  // ========================================
  // CARRITO
  // ========================================

  if (!document.getElementById("drawer-carrito")) {

    const carritoHTML = `

      <button
        class="carrito-float-btn"
        onclick="
          document
            .getElementById('drawer-carrito')
            .classList
            .toggle('open')
        "
      >

        🛒 Ver Pedido
        (<span id="carrito-count">0</span>)

      </button>


      <div
        id="drawer-carrito"
        class="drawer-carrito"
      >

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          border-bottom:1px solid #333;
          padding-bottom:10px;
        ">

          <h3 style="
            color:#D4AF37;
            margin:0;
          ">
            🛒 TU PEDIDO
          </h3>

          <button
            onclick="
              document
                .getElementById('drawer-carrito')
                .classList
                .remove('open')
            "
            style="
              background:none;
              border:none;
              color:white;
              font-size:1.5rem;
              cursor:pointer;
            "
          >
            &times;
          </button>

        </div>


        <div
          id="carrito-items"
          style="
            flex:1;
            overflow-y:auto;
            margin-top:10px;
          "
        >

          <p style="
            color:#aaa;
            text-align:center;
            margin-top:20px;
          ">
            Tu carrito está vacío.
          </p>

        </div>


        <div style="
          border-top:1px solid #333;
          padding-top:15px;
          margin-top:10px;
        ">

          <div style="
            display:flex;
            justify-content:space-between;
            font-weight:bold;
            font-size:1.2rem;
            margin-bottom:15px;
          ">

            <span>
              Total:
            </span>

            <span
              id="carrito-total"
              style="
                color:#D4AF37;
              "
            >
              S/ 0.00
            </span>

          </div>


          <button
            onclick="enviarWhatsApp()"
            style="
              width:100%;
              background:#25D366;
              color:white;
              border:none;
              padding:12px;
              border-radius:8px;
              font-weight:bold;
              cursor:pointer;
              font-size:1rem;
              display:flex;
              justify-content:center;
              align-items:center;
              gap:8px;
            "
          >

            📲 Pedir por WhatsApp

          </button>


          <button
            onclick="vaciarCarrito()"
            style="
              width:100%;
              margin-top:8px;
              background:#333;
              color:white;
              border:none;
              padding:9px;
              border-radius:8px;
              cursor:pointer;
            "
          >
            🗑️ Vaciar pedido
          </button>

        </div>

      </div>

    `;

    document.body.insertAdjacentHTML(
      "beforeend",
      carritoHTML
    );
  }


  actualizarCarritoUI();
}


// ==========================================
// 20. CERRAR MODALES AL HACER CLIC AFUERA
// ==========================================

document.addEventListener(
  "click",
  function(event) {

    const modal =
      document.getElementById(
        "modal-custom"
      );

    if (
      modal &&
      event.target === modal
    ) {

      cerrarModal();
    }

    const reserva =
      document.getElementById(
        "reserva-golden"
      );

    if (
      reserva &&
      event.target === reserva
    ) {

      cerrarReserva();
    }

    const checkout =
      document.getElementById(
        "checkout-golden"
      );

    if (
      checkout &&
      event.target === checkout
    ) {

      cerrarCheckout();
    }

  }
);
