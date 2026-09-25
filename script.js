let pedido = [];
let total = 0;

// Número oficial de la pizzería
const NUMERO_WHATSAPP = "51979707173";

function filterCategory(cat) {
  const cards = document.querySelectorAll('.card');
  const buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  cards.forEach(card => {
    if (cat === 'todas') {
      if (card.classList.contains('clasicas') || card.classList.contains('unicas') || card.classList.contains('casa') || card.classList.contains('especiales')) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    } else {
      if (card.classList.contains(cat)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

function agregarPedido(producto, precio) {
  pedido.push({ producto, precio });
  total += precio;
  
  // Feedback visual animado en el botón presionado
  const btn = event.currentTarget;
  const textoOriginal = btn.innerText;
  btn.innerText = "✓ ¡Añadido!";
  btn.style.background = "#f1c40f";
  btn.style.color = "#000";

  setTimeout(() => {
    btn.innerText = textoOriginal;
    btn.style.background = "";
    btn.style.color = "";
  }, 700);

  actualizarBarra();
}

function vaciarPedido() {
  pedido = [];
  total = 0;
  actualizarBarra();
}

function actualizarBarra() {
  const bar = document.getElementById('cart-bar');
  const count = document.getElementById('cart-count');
  const totalElem = document.getElementById('cart-total');

  if (pedido.length > 0) {
    bar.classList.remove('hidden');
    count.innerText = pedido.length;
    totalElem.innerText = `S/ ${total.toFixed(2)}`;
  } else {
    bar.classList.add('hidden');
  }
}

function enviarWhatsApp() {
  if (pedido.length === 0) return;

  let msg = "¡Hola Golden Pizzeria! 🍕 Quisiera realizar el siguiente pedido:\n\n";
  
  pedido.forEach((item, i) => {
    msg += `${i + 1}. ${item.producto} - S/ ${item.precio.toFixed(2)}\n`;
  });

  msg += `\n*Total a pagar:* S/ ${total.toFixed(2)}`;

  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}
