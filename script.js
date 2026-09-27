let carrito = [];
let tiempoPreparacion = 15 * 60; // 15 min de preparación
let tiempoTolerancia = 20 * 60;  // 20 min de tolerancia
let temporizadorIntervalo = null;
let pizzaSeleccionadaActual = {};

document.addEventListener("DOMContentLoaded", () => {
  crearEstructuraModalesYCarrito();
});

// TEMPORIZADOR EN LA ESQUINA INFERIOR IZQUIERDA
function iniciarTemporizadorCocina() {
  if (temporizadorIntervalo) clearInterval(temporizadorIntervalo);
  
  const timerWidget = document.getElementById("timer-corner-widget");
  if (timerWidget) timerWidget.style.display = "flex";

  const timerElement = document.getElementById("timer-display");
  const statusElement = document.getElementById("timer-status");
  const warningElement = document.getElementById("timer-warning");

  if (!timerElement) return;

  tiempoPreparacion = 15 * 60;
  tiempoTolerancia = 20 * 60;

  temporizadorIntervalo = setInterval(() => {
    if (tiempoPreparacion > 0) {
      tiempoPreparacion--;
      let minutos = Math.floor(tiempoPreparacion / 60);
      let segundos = tiempoPreparacion % 60;
      timerElement.innerText = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
      statusElement.innerText = "🔥 En preparación en horno a leña";
      statusElement.style.color = "#ffca3a";
      warningElement.innerText = "⚠️ 15 min para salir del horno. ¡Se prepara al instante!";
    } else if (tiempoTolerancia > 0) {
      tiempoTolerancia--;
      let minutos = Math.floor(tiempoTolerancia / 60);
      let segundos = tiempoTolerancia % 60;
      timerElement.innerText = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
      statusElement.innerText = "⏳ Margen para retirar en local (Max 20 min)";
      statusElement.style.color = "#ff6b6b";
      warningElement.innerText = "⚠️ RECUERDA APROXIMARTE A TIEMPO AL LOCAL, DE LO CONTRARIO TU PIZZA PODRÍA ESTAR TIBIA O FRÍA.";
    } else {
      clearInterval(temporizadorIntervalo);
      timerElement.innerText = "00:00";
      statusElement.innerText = "⚠️ Tiempo límite alcanzado";
      statusElement.style.color = "#ff4444";
      warningElement.innerText = "⚠️ Tu pedido está listo en mostrador. Por favor acércate a recogerlo.";
    }
  }, 1000);
}

function minimizarTemporizador() {
  const status = document.getElementById("timer-status");
  const warning = document.getElementById("timer-warning");
  if (warning.style.display === "none") {
    warning.style.display = "block";
    status.style.display = "block";
  } else {
    warning.style.display = "none";
    status.style.display = "none";
  }
}

// FILTRADO Y BÚSQUEDA
function filterCategory(categoria, evt) {
  const botones = document.querySelectorAll('.filter-btn');
  botones.forEach(btn => btn.classList.remove('active'));
  
  if (evt && evt.target) {
    evt.target.classList.add('active');
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

// MODALES DE OPCIONES CON PRECIOS Y EXTRAS SEGÚN CARTA 2025
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
    <p style="margin-bottom:10px; color:#ccc;">2. ¿Deseas adicionales de Carta? (+S/ ${costoExtra}.00 c/u):</p>
    
    <label style="display:block; margin-bottom:10px; cursor:pointer;">
      <input type="checkbox" id="extra-queso" value="${costoExtra}"> Extraqueso (+S/ ${costoExtra}.00)
    </label>
    <label style="display:block; margin-bottom:15px; cursor:pointer;">
      <input type="checkbox" id="extra-embutido" value="${costoExtra}"> Extraembutido (+S/ ${costoExtra}.00)
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
    extras.push("Extraqueso");
    precioFinal += costoExtra;
  }
  if (chkEmbutido && chkEmbutido.checked) {
    extras.push("Extraembutido");
    precioFinal += costoExtra;
  }

  let textoExtras = extras.length > 0 ? ` + [${extras.join(", ")}]` : '';
  const nombreCompleto = `Pizza ${pizzaSeleccionadaActual.nombre} (${tamano})${textoExtras}`;

  agregarPedido(nombreCompleto, precioFinal);
  cerrarModal();
}

function abrirModalCuatroEstaciones() {
  document.getElementById('modal-title').innerText = 'Pizza Cuatro Estaciones';
  document.getElementById('modal-body').innerHTML = `
    <p style="margin-bottom:10px; color:#ccc;">Selecciona el tamaño:</p>
    <div style="display:flex; flex-direction:column; gap:10px;">
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Pizza Cuatro Estaciones (Mediana)', 36)">🍕 Mediana - S/ 36.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Pizza Cuatro Estaciones (Familiar)', 46)">🍕 Familiar - S/ 46.00</button>
    </div>
  `;
  document.getElementById('modal-custom').style.display = 'flex';
}

function abrirModalMixtasEspeciales() {
  document.getElementById('modal-title').innerText = 'Mixtas Especiales';
  document.getElementById('modal-body').innerHTML = `
    <p style="margin-bottom:10px; color:#ccc;">Elija la combinación deseada:</p>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <button class="btn-modal-opcion" onclick="seleccionarTamanoMixtas('Pepperoni con pollo y piña con durazno')">1. Pepperoni/pollo + Piña/durazno</button>
      <button class="btn-modal-opcion" onclick="seleccionarTamanoMixtas('Chorizo ahumado con carne y piña con durazno')">2. Chorizo/carne + Piña/durazno</button>
      <button class="btn-modal-opcion" onclick="seleccionarTamanoMixtas('Jamón Inglés con pollo y piña con durazno')">3. Jamón/pollo + Piña/durazno</button>
      <button class="btn-modal-opcion" onclick="seleccionarTamanoMixtas('Cavanosi con carne y piña con durazno')">4. Cavanosi/carne + Piña/durazno</button>
      <button class="btn-modal-opcion" onclick="seleccionarTamanoMixtas('Salame con carne y pollo con durazno')">5. Salame/carne + Pollo/durazno</button>
    </div>
  `;
  document.getElementById('modal-custom').style.display = 'flex';
}

function seleccionarTamanoMixtas(combinacion) {
  document.getElementById('modal-body').innerHTML = `
    <h4 style="color:#D4AF37; margin-bottom:10px;">${combinacion}</h4>
    <p style="margin-bottom:10px; color:#ccc;">Selecciona el tamaño:</p>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Mixta Especial: ${combinacion} (Personal)', 25)">Personal - S/ 25.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Mixta Especial: ${combinacion} (Mediana)', 35)">Mediana - S/ 35.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Mixta Especial: ${combinacion} (Familiar)', 45)">Familiar - S/ 45.00</button>
    </div>
  `;
}

function abrirModalBebidaCasa(bebida) {
  document.getElementById('modal-title').innerText = bebida;
  
  let opciones = '';
  if (bebida === 'Limonada') {
    opciones = `
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Limonada Al Tiempo (1/2L)', 7)">🍹 1/2 Litro Al Tiempo - S/ 7.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Limonada Al Tiempo (1L)', 12)">🍹 1 Litro Al Tiempo - S/ 12.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Limonada Frozen (1/2L)', 9)">❄️ 1/2 Litro Frozen - S/ 9.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Limonada Frozen (1L)', 14)">❄️ 1 Litro Frozen - S/ 14.00</button>
    `;
  } else {
    opciones = `
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Chicha Morada Al Tiempo (1/2L)', 6)">🍷 1/2 Litro Al Tiempo - S/ 6.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Chicha Morada Al Tiempo (1L)', 10)">🍷 1 Litro Al Tiempo - S/ 10.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Chicha Morada Frozen (1/2L)', 8)">❄️ 1/2 Litro Frozen - S/ 8.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Chicha Morada Frozen (1L)', 12)">❄️ 1 Litro Frozen - S/ 12.00</button>
    `;
  }

  document.getElementById('modal-body').innerHTML = `
    <p style="margin-bottom:12px; color:#ccc;">Selecciona presentación y temperatura:</p>
    <div style="display:flex; flex-direction:column; gap:8px;">
      ${opciones}
    </div>
  `;
  document.getElementById('modal-custom').style.display = 'flex';
}

function abrirModalGaseosa(tipo) {
  document.getElementById('modal-title').innerText = 'Gaseosas Heladas';
  let opciones = '';

  if (tipo === 'personal') {
    opciones = `
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Inca Kola Personal', 4.5)">🥤 Inca Kola Personal - S/ 4.50</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Coca Cola Personal', 4.5)">🥤 Coca Cola Personal - S/ 4.50</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Fanta Personal', 4.5)">🥤 Fanta Personal - S/ 4.50</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Kola Escocesa 440ml', 4.0)">🥤 Kola Escocesa 440ml - S/ 4.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Kola Escocesa 600ml', 5.0)">🥤 Kola Escocesa 600ml - S/ 5.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Pepsi 1/2 Litro', 4.0)">🥤 Pepsi 1/2 Litro - S/ 4.00</button>
    `;
  } else if (tipo === 'mediana') {
    opciones = `
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Inca Kola 1 Litro', 8)">🥤 Inca Kola 1L - S/ 8.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Coca Cola 1 Litro', 8)">🥤 Coca Cola 1L - S/ 8.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Pepsi 1 Litro', 8)">🥤 Pepsi 1L - S/ 8.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Kola Escocesa 1.5L', 10)">🥤 Kola Escocesa 1.5L - S/ 10.00</button>
    `;
  } else if (tipo === 'familiar') {
    opciones = `
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Inca Kola 2 Litros', 13)">🥤 Inca Kola 2L - S/ 13.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Coca Cola 2 Litros', 13)">🥤 Coca Cola 2L - S/ 13.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Kola Escocesa 2 Litros', 13)">🥤 Kola Escocesa 2L - S/ 13.00</button>
    `;
  }

  document.getElementById('modal-body').innerHTML = `
    <p style="margin-bottom:12px; color:#ccc;">Selecciona la marca:</p>
    <div style="display:flex; flex-direction:column; gap:8px;">
      ${opciones}
    </div>
  `;
  document.getElementById('modal-custom').style.display = 'flex';
}

function abrirModalMate() {
  document.getElementById('modal-title').innerText = 'Infusiones y Mates';
  document.getElementById('modal-body').innerHTML = `
    <p style="margin-bottom:12px; color:#ccc;">Selecciona tu hierba preferida:</p>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Mate de Manzanilla', 2)">☕ Mate de Manzanilla - S/ 2.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Mate de Anís', 2)">☕ Mate de Anís - S/ 2.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Mate de Coca', 2)">☕ Mate de Coca - S/ 2.00</button>
      <button class="btn-modal-opcion" onclick="confirmarAgregarGenerico('Mate de Muña', 2)">☕ Mate de Muña - S/ 2.00</button>
    </div>
  `;
  document.getElementById('modal-custom').style.display = 'flex';
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

// CAMBIO DINÁMICO DE CAMPOS SEGÚN DELIVERY O RECOJO
function toggleTipoEntrega() {
  const tipo = document.getElementById('cliente-tipo-entrega').value;
  const container = document.getElementById('container-ubicacion-exacta');
  if (tipo === 'Delivery') {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
  }
}

// CARRITO Y MODIFICACIÓN DE CANTIDADES
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
            <button onclick="eliminarProducto(${index})" style="background:none; border:none; color:#ff4444; font-size:1.1rem; cursor:pointer; margin-left:4px;" title="Eliminar">&times;</button>
          </div>
        </div>
      `;
      listaContenedor.innerHTML += itemHTML;
    });
  }

  contadorBadge.innerText = totalItems;
  totalMonto.innerText = `S/ ${total}.00`;
}

// ENVÍO DE PEDIDO A WHATSAPP CON VALIDACIÓN ANTI-TROLLS, MODALIDAD Y UBICACIÓN EXACTA
function enviarWhatsApp() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega productos primero.");
    return;
  }

  const nombre = document.getElementById('cliente-nombre').value.trim();
  const telefono = document.getElementById('cliente-telefono').value.trim();
  const tipoEntrega = document.getElementById('cliente-tipo-entrega').value;
  const direccion = document.getElementById('cliente-direccion').value.trim();
  const referencia = document.getElementById('cliente-referencia').value.trim();
  const metodoPago = document.getElementById('cliente-metodo-pago').value;

  if (!nombre || nombre.length < 3) {
    alert("🛡️ SEGURIDAD: Debes ingresar tu Nombre y Apellido completo.");
    return;
  }

  const regexPerú = /^9\d{8}$/;
  if (!regexPerú.test(telefono)) {
    alert("🛡️ SEGURIDAD: Ingresa un número de teléfono válido en Perú (9 dígitos comenzando con 9).");
    return;
  }

  if (tipoEntrega === 'Delivery') {
    if (!direccion) {
      alert("Por favor ingresa tu Dirección o Ubicación Exacta para el Delivery.");
      return;
    }
    if (!referencia) {
      alert("Por favor ingresa una Referencia de la ubicación.");
      return;
    }
  }

  if (metodoPago === 'Yape' || metodoPago === 'Plin') {
    alert("⚠️ ATENCIÓN OBLIGATORIA: Al abrir WhatsApp debes adjuntar la CAPTURA DE PANTALLA del comprobante de YAPE/PLIN para procesar tu pedido.");
  }

  // Se activa el temporizador en la esquina tras confirmar pedido
  iniciarTemporizadorCocina();

  let mensaje = "🍕 *¡NUEVO PEDIDO - GOLDEN PIZZERIA & CAFE!* 🍕\n\n";
  mensaje += "🛡️ *DATOS DEL CLIENTE VERIFICADO:*\n";
  mensaje += `• *Nombre y Apellidos:* ${nombre}\n`;
  mensaje += `• *Teléfono:* ${telefono}\n`;
  mensaje += `• *Modalidad:* ${tipoEntrega}\n`;

  if (tipoEntrega === 'Delivery') {
    mensaje += `• *Ubicación Exacta:* ${direccion}\n`;
    mensaje += `• *Referencia:* ${referencia}\n`;
  } else {
    mensaje += `• *Entrega:* Recojo en Local (Mariano Melgar)\n`;
  }

  mensaje += `• *Método de Pago:* ${metodoPago}\n`;

  if (metodoPago === 'Yape' || metodoPago === 'Plin') {
    mensaje += `📌 *(Adjuntando captura de comprobante en la conversación)*\n`;
  } else if (metodoPago === 'Efectivo en Local' || metodoPago === 'Tarjeta en Local') {
    mensaje += `📌 *(Pago presencial al aproximarse al local)*\n`;
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

// CONSTRUCCIÓN DE COMPONENTES FLOTANTES
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

      <div style="border-top:1px solid #333; padding-top:10px; margin-top:10px; display:flex; flex-direction:column; gap:8px;">
        <div style="font-size:0.8rem; color:#D4AF37; font-weight:bold;">🛡️ DATOS DEL PEDIDO Y ENTREGA:</div>
        
        <input type="text" id="cliente-nombre" placeholder="Nombres y Apellidos *" class="input-form">
        <input type="tel" id="cliente-telefono" placeholder="Teléfono Perú (9XXXXXXXX) *" maxlength="9" class="input-form">
        
        <label style="font-size:0.78rem; color:#aaa; margin-top:2px;">Modalidad de Entrega:</label>
        <select id="cliente-tipo-entrega" class="input-form" onchange="toggleTipoEntrega()">
          <option value="Delivery">🛵 Delivery a domicilio</option>
          <option value="Recojo en Local">🏃 Recojo en Local (Mariano Melgar)</option>
        </select>

        <div id="container-ubicacion-exacta" style="display:flex; flex-direction:column; gap:6px;">
          <input type="text" id="cliente-direccion" placeholder="Ubicación Exacta (Calle / Nro) *" class="input-form">
          <input type="text" id="cliente-referencia" placeholder="Referencia de la Ubicación *" class="input-form">
        </div>

        <label style="font-size:0.78rem; color:#aaa; margin-top:2px;">Método de Pago:</label>
        <select id="cliente-metodo-pago" class="input-form">
          <option value="Yape">Yape (Captura obligatoria)</option>
          <option value="Plin">Plin (Captura obligatoria)</option>
          <option value="Efectivo en Local">💵 Efectivo en Local (Al aproximarse)</option>
          <option value="Tarjeta en Local">💳 Tarjeta en Local (Al aproximarse)</option>
        </select>

        <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.1rem; margin:4px 0;">
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
