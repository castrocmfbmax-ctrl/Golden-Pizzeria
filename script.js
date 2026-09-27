// DICCIONARIO DE SEDES Y SUS TELÉFONOS
const sedesTelefonos = {
    "argentina": "51994710034",
    "vallejo": "519932399922",
    "grau": "51992911116"
};

// Carrito de compras
let carrito = [];

function agregarAlCarrito(producto) {
    carrito.push(producto);
    actualizarUI();
    alert(producto.nombre + " agregado al pedido.");
}

function obtenerTelefonoSede(idSede) {
    return sedesTelefonos[idSede] || "51994710034"; // Sede por defecto si no selecciona
}


// Función para enviar pedido de la carta por WhatsApp según el local
function enviarPedidoWhatsApp() {
  const sedeSelect = document.getElementById("select-sede");
  const sedeValue = sedeSelect ? sedeSelect.value : "argentina";
  const numeroDestino = obtenerTelefonoSede(sedeValue);

  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega productos antes de realizar el pedido.");
    return;
  }

  let texto = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";
  let total = 0;

  carrito.forEach((item, index) => {
    texto += `${index + 1}. *${item.nombre}* - S/ ${item.precio.toFixed(2)}\n`;
    if (item.detalles) texto += `   _${item.detalles}_\n`;
    total += item.precio;
  });

  texto += `\n*TOTAL:* S/ ${total.toFixed(2)}`;

  const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
}

// Función para enviar reservas de mesa por WhatsApp según la sede
function enviarReservaWhatsApp(event) {
  if (event) event.preventDefault();

  const sedeSelect = document.getElementById("reserva-sede");
  const nombre = document.getElementById("reserva-nombre").value;
  const fecha = document.getElementById("reserva-fecha").value;
  const hora = document.getElementById("reserva-hora").value;
  const personas = document.getElementById("reserva-personas").value;
  const comentario = document.getElementById("reserva-comentario").value;

  const sedeValue = sedeSelect ? sedeSelect.value : "argentina";
  const numeroDestino = obtenerTelefonoSede(sedeValue);

  const texto = `¡Hola! Quisiera reservar una mesa con los siguientes datos:\n\n` +
    `👤 *Nombre:* ${nombre}\n` +
    `📅 *Fecha:* ${fecha}\n` +
    `⏰ *Hora:* ${hora}\n` +
    `👥 *Personas:* ${personas}\n` +
    `📝 *Detalles:* ${comentario || "Sin observaciones"}`;

  const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
}

// Filtro de productos
function filterCategory(categoria, event) {
  const cards = document.querySelectorAll(".card");
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach(btn => btn.classList.remove("active"));
  if (event && event.target) event.target.classList.add("active");

  cards.forEach(card => {
    if (categoria === "todas" || card.classList.contains(categoria)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// Búsqueda en tiempo real
function buscarProducto() {
  const input = document.getElementById("search-input").value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const titulo = card.querySelector("h3").innerText.toLowerCase();
    const desc = card.querySelector("p").innerText.toLowerCase();

    if (titulo.includes(input) || desc.includes(input)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}
