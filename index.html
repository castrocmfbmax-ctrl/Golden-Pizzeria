/* --- ESTADO GLOBAL --- */
let carrito = [];
let metodoPagoSeleccionado = 'yape';
let comprobanteAdjunto = false;

/* --- FILTRADO DE CATEGORÍAS --- */
function filterCategory(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(category));
    if (activeBtn) activeBtn.classList.add('active');

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (category === 'todas') {
            card.style.display = 'flex';
        } else {
            if (card.classList.contains(category)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

/* --- MANEJO DEL MODAL DE PIZZAS --- */
function abrirModalPizza(nombre, pPersonal, pMediana, pFamiliar) {
    const modal = document.getElementById('pizza-modal');
    const title = document.getElementById('pizza-modal-title');
    const container = document.getElementById('pizza-modal-sizes');

    title.textContent = `🍕 ${nombre}`;
    container.innerHTML = '';

    if (pPersonal) {
        container.innerHTML += `<button class="filter-btn" style="text-align:left; padding:12px;" onclick="seleccionarPizza('${nombre} (Personal)', ${pPersonal})">🍕 Personal - S/ ${pPersonal.toFixed(2)}</button>`;
    }
    if (pMediana) {
        container.innerHTML += `<button class="filter-btn" style="text-align:left; padding:12px;" onclick="seleccionarPizza('${nombre} (Mediana)', ${pMediana})">🍕 Mediana - S/ ${pMediana.toFixed(2)}</button>`;
    }
    if (pFamiliar) {
        container.innerHTML += `<button class="filter-btn" style="text-align:left; padding:12px;" onclick="seleccionarPizza('${nombre} (Familiar)', ${pFamiliar})">🍕 Familiar - S/ ${pFamiliar.toFixed(2)}</button>`;
    }

    modal.classList.remove('hidden');
}

function cerrarModalPizza() {
    document.getElementById('pizza-modal').classList.add('hidden');
}

function seleccionarPizza(nombreCompleto, precio) {
    agregarPedido(nombreCompleto, precio);
    cerrarModalPizza();
}

/* --- MANEJO DEL MODAL DE FRAPPÉS --- */
function abrirModalFrappe() {
    document.getElementById('frappe-modal').classList.remove('hidden');
}

function cerrarModalFrappe() {
    document.getElementById('frappe-modal').classList.add('hidden');
}

function seleccionarFrappe(sabor, precio) {
    agregarPedido(`Frappé de ${sabor}`, precio);
    cerrarModalFrappe();
}

/* --- CARRITO DE COMPRAS --- */
function agregarPedido(nombre, precio) {
    const existe = carrito.find(item => item.nombre === nombre);
    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    actualizarBarraCarrito();
}

function cambiarCantidad(index, delta) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    actualizarBarraCarrito();
    renderizarResumenPago();
}

function actualizarBarraCarrito() {
    const cartBar = document.getElementById('cart-bar');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    let totalItems = 0;
    let totalPrecio = 0;

    carrito.forEach(item => {
        totalItems += item.cantidad;
        totalPrecio += item.precio * item.cantidad;
    });

    if (totalItems > 0) {
        cartBar.classList.remove('hidden');
        cartCount.textContent = `${totalItems} ítem${totalItems > 1 ? 's' : ''}`;
        cartTotal.textContent = `S/ ${totalPrecio.toFixed(2)}`;
    } else {
        cartBar.classList.add('hidden');
        cerrarPago();
    }
}

function vaciarPedido() {
    carrito = [];
    actualizarBarraCarrito();
}

/* --- MODAL DE PAGO Y CONFIRMACIÓN --- */
function abrirPago(e) {
    if (e) e.preventDefault();
    if (carrito.length === 0) return;

    renderizarResumenPago();
    document.getElementById('payment-overlay').classList.remove('hidden');
}

function cerrarPago() {
    document.getElementById('payment-overlay').classList.add('hidden');
}

function renderizarResumenPago() {
    const summaryList = document.getElementById('payment-summary-list');
    const totalContainer = document.getElementById('payment-total');
    
    summaryList.innerHTML = '';
    let total = 0;

    carrito.forEach((item, index) => {
        let subtotal = item.precio * item.cantidad;
        total += subtotal;

        summaryList.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; background:#121814; padding:8px 10px; border-radius:6px; border:1px solid #222;">
                <div style="flex:1;">
                    <div style="color:white; font-size:0.85rem; font-weight:bold;">${item.nombre}</div>
                    <div style="color:#aaa; font-size:0.75rem;">S/ ${item.precio.toFixed(2)} c/u</div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button onclick="cambiarCantidad(${index}, -1)" style="background:#222; color:white; border:1px solid #444; width:24px; height:24px; border-radius:4px; cursor:pointer;">-</button>
                    <span style="color:white; font-weight:bold; font-size:0.85rem;">${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${index}, 1)" style="background:#222; color:white; border:1px solid #444; width:24px; height:24px; border-radius:4px; cursor:pointer;">+</button>
                    <span style="color:#D4AF37; font-weight:bold; font-size:0.85rem; width:55px; text-align:right;">S/ ${subtotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    });

    totalContainer.textContent = `TOTAL A PAGAR: S/ ${total.toFixed(2)}`;
}

function seleccionarPago(metodo) {
    metodoPagoSeleccionado = metodo;

    document.getElementById('payment-yape').classList.remove('selected');
    document.getElementById('payment-tarjeta').classList.remove('selected');
    document.getElementById('payment-efectivo').classList.remove('selected');

    document.getElementById(`payment-${metodo}`).classList.add('selected');

    document.getElementById('section-yape').style.display = metodo === 'yape' ? 'block' : 'none';
    document.getElementById('section-tarjeta').style.display = metodo === 'tarjeta' ? 'block' : 'none';
    document.getElementById('section-efectivo').style.display = metodo === 'efectivo' ? 'block' : 'none';
}

function mostrarNombreArchivo(input) {
    const nameContainer = document.getElementById('receipt-name');
    if (input.files && input.files[0]) {
        comprobanteAdjunto = true;
        nameContainer.style.color = '#4CAF50';
        nameContainer.textContent = `✔ Archivo cargado: ${input.files[0].name}`;
    } else {
        comprobanteAdjunto = false;
        nameContainer.textContent = '';
    }
}

/* --- ENVÍO DIRECTO A WHATSAPP CON VALIDACIÓN RIGUROSA --- */
function confirmarPedido() {
    if (carrito.length === 0) return;

    // 1. OBTENER DATOS DE USUARIO
    const nombre = document.getElementById("client-name") ? document.getElementById("client-name").value.trim() : "";
    const telefono = document.getElementById("client-phone") ? document.getElementById("client-phone").value.trim() : "";
    const direccion = document.getElementById("client-address") ? document.getElementById("client-address").value.trim() : "";
    const selectSede = document.getElementById("select-sede");
    const sedeSeleccionada = selectSede ? selectSede.value : "";

    // 2. VALIDACIONES DE SEGURIDAD
    if (!nombre) {
        alert("👤 Por favor ingresa tu Nombre y Apellido.");
        document.getElementById("client-name").focus();
        return;
    }

    if (!telefono || telefono.length < 9) {
        alert("📞 Por favor ingresa un número de teléfono válido de 9 dígitos.");
        document.getElementById("client-phone").focus();
        return;
    }

    if (!direccion) {
        alert("🏠 Por favor ingresa tu Dirección de entrega.");
        document.getElementById("client-address").focus();
        return;
    }

    if (!sedeSeleccionada) {
        alert("📍 Por favor selecciona tu sede de atención.");
        return;
    }

    if (metodoPagoSeleccionado === 'yape' && !comprobanteAdjunto) {
        alert("⚠️ Por favor adjunta la captura de tu comprobante Yape / Plin.");
        return;
    }

    // 3. CONSTRUCCIÓN DEL MENSAJE DE PEDIDO
    const numeroWhatsApp = "51979707173";
    let textoDetalle = "";
    let total = 0;

    carrito.forEach((item) => {
        let subtotal = item.precio * item.cantidad;
        textoDetalle += `• ${item.cantidad}x ${item.nombre} - S/ ${subtotal.toFixed(2)}\n`;
        total += subtotal;
    });

    let mensaje = `*¡NUEVO PEDIDO - GOLDEN PIZZERIA!* 🍕\n\n`;
    mensaje += `👤 *Cliente:* ${nombre}\n`;
    mensaje += `📞 *Teléfono:* ${telefono}\n`;
    mensaje += `🏠 *Dirección:* ${direccion}\n`;
    mensaje += `📍 *Sede Atentida:* ${sedeSeleccionada}\n\n`;
    mensaje += `*Detalle del Pedido:*\n${textoDetalle}\n`;
    mensaje += `*TOTAL:* S/ ${total.toFixed(2)}\n`;
    mensaje += `*Método de Pago:* ${metodoPagoSeleccionado.toUpperCase()}\n`;
    
    if (metodoPagoSeleccionado === 'yape') {
        mensaje += `*Comprobante:* Adjuntado en el chat 📄\n`;
    }

    // 4. ABRIR WHATSAPP Y LIMPIAR
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    cerrarPago();
    vaciarPedido();
}
