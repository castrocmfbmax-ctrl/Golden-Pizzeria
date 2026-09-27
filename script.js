// ==========================================
// ESTADO GLOBAL Y CONFIGURACIÓN
// ==========================================
let carrito = [];
let tiempoRestante = 15 * 60;
let tiempoTolerancia = 20 * 60;
let temporizadorIntervalo = null;
let pizzaSeleccionadaActual = {};

document.addEventListener("DOMContentLoaded", () => {
  crearEstructuraModalesYCarrito();
});

// ==========================================
// 1. TEMPORIZADOR DE HORNO
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
// 3. MODALES DE PIZZAS CON EXTRAS DIFERENCIADOS
// ==========================================
function abrirModalPizza(nombre, precioPersonal, precioMediana, precioFamiliar) {
  pizzaSeleccionadaActual = { nombre, precioPersonal, precioMediana, precioFamiliar };
  
  document.getElementById('modal-title').innerText = `Pizza ${nombre}`;
  document.getElementById('modal-body').innerHTML = `
    <p style="margin-bottom:10px; color:#ccc;">1. Selecciona el tamaño:</p>
    <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:15px;">
      <button type="button" class="btn-modal-opcion" onclick="seleccionarTamanoPizza('Personal', ${precioPersonal}, 2)">🍕 Personal - S/ ${precioPersonal}.00</button>
      <button type="button" class="btn-modal-opcion" onclick="seleccionarTamanoPizza('Mediana', ${precioMediana}, 3)">🍕 Mediana - S/ ${precioMediana}.00</button>
      <button type="button" class="btn-modal-opcion" onclick="seleccionarTamanoPizza('Familiar', ${precioFamiliar}, 4)">🍕 Familiar - S/ ${precioFamiliar}.00</button>
    </div>
  `;
  
  document.getElementById('modal-custom').style.display = 'flex';
}

function seleccionarTamanoPizza(tamano, precioBase, costoExtra) {
  document.getElementById('modal-body').innerHTML = `
    <h4 style="color:#D4AF37; margin-bottom:10px;">Tamaño: ${tamano} (S/ ${precioBase}.00)</h4>
    <p style="margin-bottom:10px; color:#ccc;">2. ¿Deseas adicionales opcionales? (+S/ ${costoExtra}.00 c/u):</p>
    
    <label style="display:block; margin-bottom:10px; cursor:pointer;">
      <input type="checkbox" id="extra-queso" value="${costoExtra}"> Extra Queso Mozzarella (+S/ ${costoExtra}.00)
    </label>
    <label style="display:block; margin-bottom:15px; cursor:pointer;">
      <input type="checkbox" id="extra-embutido" value="${costoExtra}"> Extra Embutido (+S/ ${costoExtra}.00)
    </label>

    <button class="btn-modal-opcion" style="text-align:center; background:#D4AF37; color:#000;" onclick="confirmarPizzaConExtras('${tamano}', ${precioBase}, ${costoExtra})">
      🛒 AGREGAR AL PEDIDO
    </button>
  `;
}

function confirmarPizzaConExtras(tamano, precioBase, costoExtra) {
  const chkQueso = document.getElementById('extra-queso');
  const chkEmbutido = document.getElementById('extra-embutido');

  let extras = [];
  let precioFinal = precioBase;

  if (chkQueso && chkQueso.checked) {
    extras.push("Extra Queso");
    precioFinal += costoExtra;
  }
  if (chkEmbutido && chkEmbutido.checked) {
    extras.push("Extra Embutido");
    precioFinal += costoExtra;
  }

  let textoExtras = extras.length > 0 ? ` + [${extras.join(", ")}]` : '';
  const nombreCompleto = `Pizza ${pizzaSeleccionadaActual.nombre} (${tamano})${textoExtras}`;

  agregarPedido(nombreCompleto, precioFinal);
  cerrarModal();
}

function abrirModalPizzeta() {
  document.getElementById('modal-title').innerText = '🍕 Pizzetas Crujientes';
  document.getElementById('modal-body').innerHTML = `
    <p style="margin-bottom:15px; color:#ccc;">Selecciona tu sabor individual:</p>
    <div style="display:flex; flex-direction:column; gap:10px;">
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Pizzeta Americana', 5)">🍕 Pizzeta Americana - S/ 5.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Pizzeta Hawaiana', 6)">🍕 Pizzeta Hawaiana - S/ 6.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Pizzeta Pepperoni', 7)">🍕 Pizzeta Pepperoni - S/ 7.00</button>
    </div>
  `;
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

function abrirModalReserva() {
  document.getElementById('modal-title').innerText = '🪑 Reservar Mesa en Local';
  document.getElementById('modal-body').innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px;">
      <label style="font-size:0.85rem; color:#D4AF37;">Nombres y Apellidos *</label>
      <input type="text" id="res-nombre" placeholder="Ej. Juan Pérez" class="input-form">

      <label style="font-size:0.85rem; color:#D4AF37;">Teléfono / WhatsApp Perú *</label>
      <input type="tel" id="res-telefono" placeholder="9XXXXXXXX" maxlength="9" class="input-form">

      <label style="font-size:0.85rem; color:#D4AF37;">Selecciona la Sede *</label>
      <select id="res-sede" class="input-form">
        <option value="MIGUEL GRAU 736">Sede Miguel Grau 736</option>
        <option value="CESAR VALLEJO 100">Sede César Vallejo 100 (4 mesas)</option>
        <option value="ARGENTINA 1432">Sede Argentina 1432 (6 mesas)</option>
      </select>

      <label style="font-size:0.85rem; color:#D4AF37;">Número de Personas</label>
      <input type="number" id="res-personas" min="1" max="12" value="2" class="input-form">

      <label style="font-size:0.85rem; color:#D4AF37;">Hora aproximada de llegada</label>
      <input type="time" id="res-hora" class="input-form">

      <button class="btn-modal-opcion" style="text-align:center; background:#25D366; color:#fff; margin-top:10px;" onclick="enviarReservaWhatsApp()">
        📲 CONFIRMAR RESERVA POR WHATSAPP
      </button>
    </div>
  `;
  document.getElementById('modal-custom').style.display = 'flex';
}

function enviarReservaWhatsApp() {
  const nombre = document.getElementById('res-nombre').value.trim();
  const telefono = document.getElementById('res-telefono').value.trim();
  const sede = document.getElementById('res-sede').value;
  const personas = document.getElementById('res-personas').value;
  const hora = document.getElementById('res-hora').value;

  if (!nombre || nombre.length < 3) {
    alert("Por favor ingresa tu Nombre y Apellido completo.");
    return;
  }

  const regexPerú = /^9\d{8}$/;
  if (!regexPerú.test(telefono)) {
    alert("Por favor ingresa un número de teléfono válido para Perú (9 dígitos comenzando con 9).");
    return;
  }

  let mensaje = `🪑 *¡NUEVA RESERVA DE MESA - GOLDEN PIZZERIA!* 🪑\n\n`;
  mensaje += `👤 *Cliente:* ${nombre}\n`;
  mensaje += `📞 *Teléfono:* ${telefono}\n`;
  mensaje += `📍 *Sede reservada:* ${sede}\n`;
  mensaje += `👥 *Número de personas:* ${personas}\n`;
  mensaje += `⏰ *Hora aproximada:* ${hora || 'Por confirmar'}\n`;

  const numeroTelefono = "51979707173";
  const url = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
  cerrarModal();
}

function confirmarAgregarGenerico(nombre, precio) {
  agregarPedido(nombre, precio);
  cerrarModal();
}

function cerrarModal() {
  document.getElementById('modal-custom').style.display = 'none';
}

// ==========================================
// 4. CARRITO CON MÁS (+) Y MENOS (-) Y ELIMINAR
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

function eliminarProducto(index) {
  carrito.splice(index, 1);
  actualizarCarritoUI();
}

function actualizarCarritoUI() {
  const listaContenedor = document.getElementById('carrito-items');
  const contadorBadge = document.getElementById('carrito-count');
  const totalMonto = document.getElementById('carrito-total');

  listaContenedor.innerHTML = '';
  let total = 0;
  let totalItems = 0;

  if (carrito.length === 0) {
    listaContenedor.innerHTML = `<p style="color:#aaa; text-align:center; margin-top:20px;">Tu carrito está vacío.</p>`;
  } else {
    carrito.forEach((item, index) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      totalItems += item.cantidad;

      const itemHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #333;">
          <div style="flex:1; padding-right:8px;">
            <div style="font-weight:bold; color:#D4AF37; font-size:0.9rem;">${item.nombre}</div>
            <div style="font-size:0.8rem; color:#aaa;">S/ ${item.precio}.00 c/u</div>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <button onclick="cambiarCantidad(${index}, -1)" style="background:#2a1b14; color:#D4AF37; border:1px solid #D4AF37; border-radius:4px; width:26px; height:26px; cursor:pointer; font-weight:bold;">-</button>
            <span style="font-weight:bold; font-size:0.95rem;">${item.cantidad}</span>
            <button onclick="cambiarCantidad(${index}, 1)" style="background:#2a1b14; color:#D4AF37; border:1px solid #D4AF37; border-radius:4px; width:26px; height:26px; cursor:pointer; font-weight:bold;">+</button>
            <span style="font-weight:bold; margin-left:6px; font-size:0.9rem;">S/ ${subtotal}.00</span>
            <button onclick="eliminarProducto(${index})" style="background:none; border:none; color:#ff4444; font-size:1.1rem; cursor:pointer; margin-left:4px;" title="Eliminar">🗑️</button>
          </div>
        </div>
      `;
      listaContenedor.innerHTML += itemHTML;
    });
  }

  contadorBadge.innerText = totalItems;
  totalMonto.innerText = `S/ ${total}.00`;
}

// ==========================================
// 5. ENVÍO POR WHATSAPP CON DATOS ANTI-TROLLS Y YAPE OBLIGATORIO
// ==========================================
function enviarWhatsApp() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega productos primero.");
    return;
  }

  const nombre = document.getElementById('cliente-nombre').value.trim();
  const telefono = document.getElementById('cliente-telefono').value.trim();
  const metodoPago = document.getElementById('cliente-metodo-pago').value;
  const direccion = document.getElementById('cliente-direccion').value.trim();

  if (!nombre || nombre.length < 3) {
    alert("🛡️ SEGURIDAD: Debes ingresar tu Nombre y Apellido completo.");
    return;
  }

  const regexPerú = /^9\d{8}$/;
  if (!regexPerú.test(telefono)) {
    alert("🛡️ SEGURIDAD: Ingresa un número de teléfono válido en Perú (9 dígitos comenzando con 9).");
    return;
  }

  if (!direccion) {
    alert("Ingresa tu dirección exacta de entrega.");
    return;
  }

  if (metodoPago === 'Yape' || metodoPago === 'Plin') {
    alert("⚠️ ATENCIÓN OBLIGATORIA: Al abrir WhatsApp debes adjuntar la CAPTURA DE PANTALLA del comprobante de YAPE/PLIN para procesar tu pedido.");
  }

  iniciarTemporizadorCocina();

  let mensaje = "🍕 *¡NUEVO PEDIDO - GOLDEN PIZZERIA & CAFE!* 🍕\n\n";
  mensaje += "🛡️ *DATOS DEL CLIENTE VERIFICADO:*\n";
  mensaje += `• *Nombre y Apellidos:* ${nombre}\n`;
  mensaje += `• *Teléfono:* ${telefono}\n`;
  mensaje += `• *Dirección:* ${direccion}\n`;
  mensaje += `• *Método de Pago:* ${metodoPago}\n`;

  if (metodoPago === 'Yape' || metodoPago === 'Plin') {
    mensaje += `📌 *(Adjuntando captura de comprobante en la conversación)*\n`;
  }

  mensaje += "\n🛒 *DETALLE DEL PEDIDO:*\n";
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    mensaje += `• *${item.cantidad}x* ${item.nombre} - S/ ${subtotal}.00\n`;
  });

  mensaje += `\n💰 *TOTAL A PAGAR:* S/ ${total}.00\n`;

  const numeroTelefono = "51979707173";
  const url = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// ==========================================
// 6. INYECCIÓN DE FORMULARIO DE CLIENTE Y ESTILOS DINÁMICOS
// ==========================================
function crearEstructuraModalesYCarrito() {
  const styles = `
    .input-form {
      width: 100%;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #D4AF37;
      background: #18100c;
      color: white;
      font-size: 0.9rem;
      outline: none;
    }
    .btn-modal-opcion {
      background: #1a120e;
      color: white;
      border: 1px solid #D4AF37;
      padding: 11px;
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
      box-shadow: 0 4px 15px rgba(0,0,0,0.9);
      cursor: pointer;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .drawer-carrito {
      position: fixed;
      top: 0;
      right: -370px;
      width: 350px;
      height: 100vh;
      background: #100b08;
      color: white;
      box-shadow: -5px 0 20px rgba(0,0,0,0.95);
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
    <div id="modal-custom" style="display:none; position:fixed; top:0; left:0; width:100%; height:100vh; background:rgba(0,0,0,0.88); z-index:2000; justify-content:center; align-items:center;">
      <div style="background:#140e0b; color:white; padding:25px; border-radius:12px; border:1px solid #D4AF37; width:90%; max-width:420px; position:relative; box-shadow:0 0 20px rgba(212,175,55,0.3); max-height:90vh; overflow-y:auto;">
        <button onclick="cerrarModal()" style="position:absolute; top:10px; right:15px; background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
        <h2 id="modal-title" style="color:#D4AF37; margin-bottom:15px; font-size:1.4rem;"></h2>
        <div id="modal-body"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Inyectar Botón Flotante y Carrito con Formulario Anti-trolls
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

      <!-- FORMULARIO ANTI-TROLLS Y CONFIRMACIÓN DE PAGO -->
      <div style="border-top:1px solid #333; padding-top:12px; margin-top:10px; display:flex; flex-direction:column; gap:8px;">
        <div style="font-size:0.8rem; color:#D4AF37; font-weight:bold;">🛡️ DATOS OBLIGATORIOS (ANTI-TROLLS):</div>
        
        <input type="text" id="cliente-nombre" placeholder="Nombres y Apellidos *" class="input-form">
        <input type="tel" id="cliente-telefono" placeholder="Teléfono Perú (9XXXXXXXX) *" maxlength="9" class="input-form">
        <input type="text" id="cliente-direccion" placeholder="Dirección de Entrega *" class="input-form">
        
        <select id="cliente-metodo-pago" class="input-form">
          <option value="Yape">Yape (Captura obligatoria)</option>
          <option value="Plin">Plin (Captura obligatoria)</option>
          <option value="Efectivo">Efectivo contraentrega</option>
        </select>

        <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.1rem; margin:6px 0;">
          <span>Total:</span>
          <span id="carrito-total" style="color:#D4AF37;">S/ 0.00</span>
        </div>

        <button onclick="enviarWhatsApp()" style="width:100%; background:#25D366; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:0.95rem; display:flex; justify-content:center; align-items:center; gap:8px;">
          📲 Pedir por WhatsApp
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', carritoHTML);
}
