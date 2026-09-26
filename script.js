// ==========================================
// ESTRUCTURA DEL CARRITO Y ESTADO GLOBAL
// ==========================================
let carrito = [];

// Cargar librerías/estilos al iniciar
document.addEventListener("DOMContentLoaded", () => {
  crearEstructuraModalesYCarrito();
});

// ==========================================
// 1. FUNCIONALIDAD DE FILTROS Y BUSCADOR
// ==========================================
function filterCategory(categoria) {
  // Cambiar estado activo en los botones de filtro
  const botones = document.querySelectorAll('.filter-btn');
  botones.forEach(btn => btn.classList.remove('active'));
  
  if (event && event.target) {
    event.target.classList.add('active');
  }

  const tarjetas = document.querySelectorAll('.product-grid .card');
  tarjetas.forEach(card => {
    if (categoria === 'todas' || card.classList.contains(categoria)) {
      card.style.display = 'block';
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
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// ==========================================
// 2. MODALES INTERACTIVOS (PIZZAS Y FRAPPÉS)
// ==========================================
let pizzaSeleccionadaActual = {};

function abrirModalPizza(nombre, precioPersonal, precioMediana, precioFamiliar) {
  pizzaSeleccionadaActual = { nombre, precioPersonal, precioMediana, precioFamiliar };
  
  let opcionesHTML = '';
  
  if (precioPersonal !== null) {
    opcionesHTML += `<button type="button" class="btn-modal-opcion" onclick="confirmarAgregarPizza('Personal', ${precioPersonal})">🍕 Personal - S/ ${precioPersonal}.00</button>`;
  }
  if (precioMediana !== null) {
    opcionesHTML += `<button type="button" class="btn-modal-opcion" onclick="confirmarAgregarPizza('Mediana', ${precioMediana})">🍕 Mediana - S/ ${precioMediana}.00</button>`;
  }
  if (precioFamiliar !== null) {
    opcionesHTML += `<button type="button" class="btn-modal-opcion" onclick="confirmarAgregarPizza('Familiar', ${precioFamiliar})">🍕 Familiar - S/ ${precioFamiliar}.00</button>`;
  }

  document.getElementById('modal-title').innerText = `Pizza ${nombre}`;
  document.getElementById('modal-body').innerHTML = `
    <p style="margin-bottom:15px; color:#ccc;">Selecciona el tamaño que deseas:</p>
    <div style="display:flex; flex-direction:column; gap:10px;">
      ${opcionesHTML}
    </div>
  `;
  
  document.getElementById('modal-custom').style.display = 'flex';
}

function confirmarAgregarPizza(tamano, precio) {
  const nombreCompleto = `Pizza ${pizzaSeleccionadaActual.nombre} (${tamano})`;
  agregarPedido(nombreCompleto, precio);
  cerrarModal();
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
// 3. GESTIÓN DEL CARRITO DE COMPRAS
// ==========================================
function agregarPedido(nombre, precio) {
  const itemExistente = carrito.find(p => p.nombre === nombre);
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  actualizarCarritoUI();
  
  // Abrir carrito automáticamente al agregar
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

  let mensaje = "🍕 *¡NUEVO PEDIDO - GOLDEN PIZZERIA & CAFE!* 🍕\n\n";
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    mensaje += `• *${item.cantidad}x* ${item.nombre} - S/ ${subtotal}.00\n`;
  });

  mensaje += `\n💰 *TOTAL A PAGAR:* S/ ${total}.00\n`;
  mensaje += `📍 *Dirección de envío:* (Escribe tu dirección aquí en Arequipa)\n`;
  mensaje += `💳 *Método de pago:* Yape / Plin / Efectivo`;

  const numeroTelefono = "51979707173";
  const url = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// ==========================================
// 4. CREAR ELEMENTOS DINÁMICOS DE INTERFAZ
// ==========================================
function crearEstructuraModalesYCarrito() {
  // Inyectar estilos CSS específicos si no están en style.css
  const styles = `
    .filter-btn {
      background: #141816;
      color: #D4AF37;
      border: 1px solid #D4AF37;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
    }
    .filter-btn.active, .filter-btn:hover {
      background: #D4AF37;
      color: #000;
    }
    .btn-add {
      width: 100%;
      background: #D4AF37;
      color: #000;
      border: none;
      padding: 10px;
      font-weight: bold;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
      transition: transform 0.2s;
    }
    .btn-add:hover {
      transform: scale(1.02);
      background: #f1c40f;
    }
    .btn-modal-opcion {
      background: #1a1e1b;
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
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
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
      background: #141816;
      color: white;
      box-shadow: -5px 0 15px rgba(0,0,0,0.7);
      z-index: 1001;
      transition: right 0.3s ease;
      display: flex;
      flex-direction: column;
      padding: 20px;
    }
    .drawer-carrito.open {
      right: 0;
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // Inyectar HTML para Modal Custom
  const modalHTML = `
    <div id="modal-custom" style="display:none; position:fixed; top:0; left:0; width:100%; height:100vh; background:rgba(0,0,0,0.8); z-index:2000; justify-content:center; align-items:center;">
      <div style="background:#141816; color:white; padding:25px; border-radius:12px; border:1px solid #D4AF37; width:90%; max-width:400px; position:relative;">
        <button onclick="cerrarModal()" style="position:absolute; top:10px; right:15px; background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
        <h2 id="modal-title" style="color:#D4AF37; margin-bottom:15px;"></h2>
        <div id="modal-body"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Inyectar Botón Flotante y Drawer del Carrito
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
