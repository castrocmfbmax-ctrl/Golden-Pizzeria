// ==========================================
// ESTRUCTURA DEL CARRITO Y ESTADO GLOBAL
// ==========================================
let carrito = [];
let tiempoRestante = 15 * 60; // 15 minutos de preparación
let tiempoTolerancia = 20 * 60; // 20 minutos de tolerancia
let temporizadorIntervalo = null;

document.addEventListener("DOMContentLoaded", () => {
  crearEstructuraModalesYCarrito();
});

// ==========================================
// 1. TEMPORIZADOR (INICIA TRAS EL PEDIDO)
// ==========================================
function iniciarTemporizadorCocina() {
  if (temporizadorIntervalo) clearInterval(temporizadorIntervalo);
  
  const timerBanner = document.getElementById("timer-banner");
  if (timerBanner) timerBanner.style.display = "flex";

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
      timerElement.innerText = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
      statusElement.innerText = "🔥 En horno a la piedra (15 min)";
      statusElement.style.color = "#ffca3a";
    } else if (tiempoTolerancia > 0) {
      tiempoTolerancia--;
      let minutos = Math.floor(tiempoTolerancia / 60);
      let segundos = tiempoTolerancia % 60;
      timerElement.innerText = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
      statusElement.innerText = "⏳ Tiempo de tolerancia (Máx 20 min)";
      statusElement.style.color = "#ff6b6b";
    } else {
      clearInterval(temporizadorIntervalo);
      timerElement.innerText = "00:00";
      statusElement.innerText = "⚠️ Tiempo cumplido. ¡Servir o entregar ya!";
      statusElement.style.color = "#ff4444";
    }
  }, 1000);
}

// ==========================================
// 2. FILTROS Y BÚSQUEDA
// ==========================================
function filterCategory(categoria) {
  const botones = document.querySelectorAll('.filter-btn');
  botones.forEach(btn => btn.classList.remove('active'));
  
  if (event && event.target) {
    event.target.classList.add('active');
  }

  const tarjetas = document.querySelectorAll('.product-grid .card');
  tarjetas.forEach(card => {
    if (categoria === 'todas' || card.classList.contains(categoria)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function buscarProducto() {
  const input = document.getElementById('search-input').value.toLowerCase();
  const tarjetas = document.querySelectorAll('.product-grid .card');

  tarjetas.forEach(card => {
    const titulo = card.querySelector('h3').innerText.toLowerCase();
    const descripcion = card.querySelector('p').innerText.toLowerCase();

    if (titulo.includes(input) || descripcion.includes(input)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// ==========================================
// 3. MODALES INTERACTIVOS Y EXTRAS
// ==========================================
let pizzaSeleccionadaActual = {};

function abrirModalPizza(nombre, precioPersonal, precioMediana, precioFamiliar) {
  pizzaSeleccionadaActual = { nombre, precioPersonal, precioMediana, precioFamiliar };
  
  document.getElementById('modal-title').innerText = `Pizza ${nombre}`;
  document.getElementById('modal-body').innerHTML = `
    <p style="margin-bottom:10px; color:#ccc;">1. Selecciona el tamaño:</p>
    <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:15px;">
      <button type="button" class="btn-modal-opcion" onclick="seleccionarTamanoPizza('Personal', ${precioPersonal})">🍕 Personal - S/ ${precioPersonal}.00</button>
      <button type="button" class="btn-modal-opcion" onclick="seleccionarTamanoPizza('Mediana', ${precioMediana})">🍕 Mediana - S/ ${precioMediana}.00</button>
      <button type="button" class="btn-modal-opcion" onclick="seleccionarTamanoPizza('Familiar', ${precioFamiliar})">🍕 Familiar - S/ ${precioFamiliar}.00</button>
    </div>
  `;
  
  document.getElementById('modal-custom').style.display = 'flex';
}

function seleccionarTamanoPizza(tamano, precioBase) {
  document.getElementById('modal-body').innerHTML = `
    <h4 style="color:#D4AF37; margin-bottom:10px;">Tamaño: ${tamano} (S/ ${precioBase}.00)</h4>
    <p style="margin-bottom:10px; color:#ccc;">2. ¿Deseas agregar adicionales? (+S/ 3.00 c/u)</p>
    
    <label style="display:block; margin-bottom:10px; cursor:pointer;">
      <input type="checkbox" id="extra-queso" value="3"> Extra Queso Mozzarella (+S/ 3.00)
    </label>
    <label style="display:block; margin-bottom:15px; cursor:pointer;">
      <input type="checkbox" id="extra-embutido" value="3"> Extra Embutido (+S/ 3.00)
    </label>

    <button class="btn-modal-opcion" style="text-align:center; background:#D4AF37; color:#000;" onclick="confirmarPizzaConExtras('${tamano}', ${precioBase})">
      🛒 AGREGAR AL PEDIDO
    </button>
  `;
}

function confirmarPizzaConExtras(tamano, precioBase) {
  const chkQueso = document.getElementById('extra-queso');
  const chkEmbutido = document.getElementById('extra-embutido');

  let extras = [];
  let precioFinal = precioBase;

  if (chkQueso && chkQueso.checked) {
    extras.push("Extra Queso");
    precioFinal += 3;
  }
  if (chkEmbutido && chkEmbutido.checked) {
    extras.push("Extra Embutido");
    precioFinal += 3;
  }

  let textoExtras = extras.length > 0 ? ` + [${extras.join(", ")}]` : '';
  const nombreCompleto = `Pizza ${pizzaSeleccionadaActual.nombre} (${tamano})${textoExtras}`;

  agregarPedido(nombreCompleto, precioFinal);
  cerrarModal();
}

function abrirModalPizzeta() {
  document.getElementById('modal-title').innerText = 'Pizzeta Individual (S/ 8.00)';
  document.getElementById('modal-body').innerHTML = `
    <p style="margin-bottom:15px; color:#ccc;">Elige tu sabor:</p>
    <div style="display:flex; flex-direction:column; gap:10px;">
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Pizzeta Americana', 8)">🍕 Pizzeta Americana</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Pizzeta Mozzarella', 8)">🍕 Pizzeta Mozzarella</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Pizzeta Pepperoni', 8)">🍕 Pizzeta Pepperoni</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Pizzeta Hawaina', 8)">🍕 Pizzeta Hawaina</button>
    </div>
  `;
  document.getElementById('modal-custom').style.display = 'flex';
}

function abrirModalCumpleanos(tipo) {
  if (tipo === 'pack') {
    document.getElementById('modal-title').innerText = 'Pack Cumpleañero (S/ 75.00)';
    document.getElementById('modal-body').innerHTML = `
      <p style="margin-bottom:15px; color:#ccc;">Incluye 2 Familiares + Gaseosa 1.5L + Sorpresa:</p>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Pack Cumpleañero Golden (2 Fam + Bebida)', 75)">🎉 Confirmar Pack Cumpleañero</button>
    `;
  } else if (tipo === 'especial') {
    document.getElementById('modal-title').innerText = 'Promo Cumpleañero Especial (S/ 48.00)';
    document.getElementById('modal-body').innerHTML = `
      <p style="margin-bottom:15px; color:#ccc;">Incluye 1 Familiar + Pan al Ajo + Bebida + Regalo:</p>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Promo Cumpleañero Especial', 48)">🎉 Confirmar Promo Especial</button>
    `;
  }
  document.getElementById('modal-custom').style.display = 'flex';
}

function abrirModalKids(tipoCombo) {
  let opcionesHTML = '';
  if (tipoCombo === 'mini') {
    opcionesHTML = `
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Combo Mini Mágica (Jamón y Queso)', 18)">🍕 Jamón y Queso + Bebida + Dulce - S/ 18.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Combo Mini Mágica (Salchicha)', 18)">🍕 Salchicha Frankfurter + Bebida + Dulce - S/ 18.00</button>
    `;
    document.getElementById('modal-title').innerText = 'Combo Mini Mágica';
  } else if (tipoCombo === 'junior') {
    opcionesHTML = `
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Caja Golden Junior (Pepperoni)', 22)">🍕 Pepperoni Sonriente + Pan al Ajo - S/ 22.00</button>
    `;
    document.getElementById('modal-title').innerText = 'Caja Golden Junior';
  }

  document.getElementById('modal-body').innerHTML = `
    <p style="margin-bottom:15px; color:#ccc;">Elige la opción infantil:</p>
    <div style="display:flex; flex-direction:column; gap:10px;">
      ${opcionesHTML}
    </div>
  `;

  document.getElementById('modal-custom').style.display = 'flex';
}

function abrirModalFrappe(tipo) {
  let opcionesHTML = '';
  if (tipo === 'fruta') {
    const frutas = ['Maracuyá', 'Fresa', 'Mango', 'Lúcuma'];
    frutas.forEach(fruta => {
      opcionesHTML += `<button type="button" class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Frappé de ${fruta}', 10)">🍧 Frappé de ${fruta} - S/ 10.00</button>`;
    });
    document.getElementById('modal-title').innerText = 'Frappé de Fruta';
  } else if (tipo === 'especial') {
    const especiales = ['Cappuccino', 'Galleta Oreo'];
    especiales.forEach(esp => {
      opcionesHTML += `<button type="button" class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Frappé de ${esp}', 9)">☕ Frappé de ${esp} - S/ 9.00</button>`;
    });
    document.getElementById('modal-title').innerText = 'Frappé Especial';
  }

  document.getElementById('modal-body').innerHTML = `
    <p style="margin-bottom:15px; color:#ccc;">Selecciona tu sabor favorito:</p>
    <div style="display:flex; flex-direction:column; gap:10px;">
      ${opcionesHTML}
    </div>
  `;

  document.getElementById('modal-custom').style.display = 'flex';
}

function confirmarAgregarGenerico(nombre, precio) {
  agregarPedido(nombre, precio);
  cerrarModal();
}

function cerrarModal() {
  document.getElementById('modal-custom').style.display = 'none';
}

// ==========================================
// 4. GESTIÓN DEL CARRITO
// ==========================================
function agregarPedido(nombre, precio) {
  const itemExistente = carrito.find(p => p.nombre === nombre);
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  actualizarCarritoUI();
  document.getElementById('drawer-carrito').classList.add('open');
}

function cambiarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }
  actualizarCarritoUI();
}

function actualizarCarritoUI() {
  const listaContenedor = document.getElementById('carrito-items');
  const contadorBadge = document.getElementById('carrito-count');
  const totalMonto = document.getElementById('carrito-total');

  listaContenedor.innerHTML = '';
  let total = 0;
  let totalItems = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    totalItems += item.cantidad;

    const itemHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #333;">
        <div>
          <div style="font-weight:bold; color:#D4AF37;">${item.nombre}</div>
          <div style="font-size:0.85rem; color:#aaa;">S/ ${item.precio}.00 c/u</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button onclick="cambiarCantidad(${index}, -1)" style="background:#333; color:white; border:none; border-radius:3px; padding:2px 8px; cursor:pointer;">-</button>
          <span>${item.cantidad}</span>
          <button onclick="cambiarCantidad(${index}, 1)" style="background:#333; color:white; border:none; border-radius:3px; padding:2px 8px; cursor:pointer;">+</button>
          <span style="font-weight:bold; margin-left:10px;">S/ ${subtotal}.00</span>
        </div>
      </div>
    `;
    listaContenedor.innerHTML += itemHTML;
  });

  contadorBadge.innerText = totalItems;
  totalMonto.innerText = `S/ ${total}.00`;
}

function enviarWhatsApp() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega productos primero.");
    return;
  }

  // Activa el temporizador del horno solo tras realizar el pedido
  iniciarTemporizadorCocina();

  let mensaje = "🍕 *¡NUEVO PEDIDO - GOLDEN PIZZERIA & CAFE!* 🍕\n\n";
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    mensaje += `• *${item.cantidad}x* ${item.nombre} - S/ ${subtotal}.00\n`;
  });

  mensaje += `\n💰 *TOTAL A PAGAR:* S/ ${total}.00\n`;
  mensaje += `📍 *Dirección de envío:* (Escribe tu dirección en Mariano Melgar / Arequipa)\n`;
  mensaje += `💳 *Método de pago:* Yape / Plin / Efectivo`;

  const numeroTelefono = "51979707173";
  const url = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// ==========================================
// 5. INYECCIÓN DINÁMICA DE MODAL Y CARRITO
// ==========================================
function crearEstructuraModalesYCarrito() {
  const styles = `
    .btn-modal-opcion {
      background: #1a120e;
      color: white;
      border: 1px solid #D4AF37;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      text-align: left;
      transition: background 0.2s;
    }
    .btn-modal-opcion:hover {
      background: #D4AF37;
      color: black;
    }
    .carrito-float-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #25D366;
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 20px;
      font-weight: bold;
      font-size: 1rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.8);
      cursor: pointer;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .drawer-carrito {
      position: fixed;
      top: 0;
      right: -350px;
      width: 320px;
      height: 100vh;
      background: #120c0a;
      color: white;
      box-shadow: -5px 0 20px rgba(0,0,0,0.9);
      z-index: 1001;
      transition: right 0.3s ease;
      display: flex;
      flex-direction: column;
      padding: 20px;
      border-left: 1px solid #D4AF37;
    }
    .drawer-carrito.open {
      right: 0;
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // Inyectar Modal Custom
  const modalHTML = `
    <div id="modal-custom" style="display:none; position:fixed; top:0; left:0; width:100%; height:100vh; background:rgba(0,0,0,0.85); z-index:2000; justify-content:center; align-items:center;">
      <div style="background:#140e0b; color:white; padding:25px; border-radius:12px; border:1px solid #D4AF37; width:90%; max-width:400px; position:relative; box-shadow:0 0 20px rgba(212,175,55,0.3);">
        <button onclick="cerrarModal()" style="position:absolute; top:10px; right:15px; background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
        <h2 id="modal-title" style="color:#D4AF37; margin-bottom:15px;"></h2>
        <div id="modal-body"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Inyectar Botón Flotante y Carrito Drawer
  const carritoHTML = `
    <button class="carrito-float-btn" onclick="document.getElementById('drawer-carrito').classList.toggle('open')">
      🛒 Ver Pedido (<span id="carrito-count">0</span>)
    </button>

    <div id="drawer-carrito" class="drawer-carrito">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:10px;">
        <h3 style="color:#D4AF37; margin:0;">🛒 TU PEDIDO</h3>
        <button onclick="document.getElementById('drawer-carrito').classList.remove('open')" style="background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
      </div>

      <div id="carrito-items" style="flex:1; overflow-y:auto; margin-top:10px;">
        <p style="color:#aaa; text-align:center; margin-top:20px;">Tu carrito está vacío.</p>
      </div>

      <div style="border-top:1px solid #333; padding-top:15px; margin-top:10px;">
        <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.2rem; margin-bottom:15px;">
          <span>Total:</span>
          <span id="carrito-total" style="color:#D4AF37;">S/ 0.00</span>
        </div>
        <button onclick="enviarWhatsApp()" style="width:100%; background:#25D366; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:1rem; display:flex; justify-content:center; align-items:center; gap:8px;">
          📲 Pedir por WhatsApp
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', carritoHTML);
}
