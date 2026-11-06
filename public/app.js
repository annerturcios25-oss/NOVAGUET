document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     ELEMENTOS
  ===================================================== */

  const productsContainer = document.getElementById("productsContainer");

  const searchButton = document.getElementById("searchButton");
  const searchBox = document.getElementById("searchBox");
  const searchInput = document.getElementById("searchInput");
  const closeSearch = document.getElementById("closeSearch");

  const cartButton = document.getElementById("cartButton");
  const cartBox = document.getElementById("cartBox");
  const closeCart = document.getElementById("closeCart");

  const cartItems = document.getElementById("cartItems");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartCount = document.getElementById("cartCount");

  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartTotal = document.getElementById("cartTotal");
  const cartSummary = document.querySelector(".cart-summary");

  const promoCode = document.getElementById("promoCode");
  const applyPromo = document.getElementById("applyPromo");
  const promoMessage = document.getElementById("promoMessage");

  const checkoutButton = document.getElementById("checkoutButton");
/* =====================================================
   RASTREO DE PEDIDOS
===================================================== */

const trackingButton = document.getElementById("trackingButton");
const trackingBox = document.getElementById("trackingBox");
const trackingOrderId = document.getElementById("trackingOrderId");
const searchTrackingButton = document.getElementById("searchTrackingButton");
const trackingResult = document.getElementById("trackingResult");
const closeTrackingButton = document.getElementById("closeTrackingButton");

/* ABRIR RASTREO */

if (trackingButton && trackingBox) {
  trackingButton.addEventListener("click", (event) => {
    event.preventDefault();

    // Cerrar menú hamburguesa
    const menuHamburger = document.getElementById("menuHamburger");

    if (menuHamburger) {
      menuHamburger.click();
    }

    // Mostrar rastreo
    trackingBox.style.display = "block";

    // Limpiar consulta anterior
    if (trackingOrderId) {
      trackingOrderId.value = "";
    }

    if (trackingResult) {
      trackingResult.innerHTML = "";
    }

    // Centrar ventana de rastreo
    trackingBox.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
}

/* CERRAR RASTREO */

if (closeTrackingButton && trackingBox) {
  closeTrackingButton.addEventListener("click", () => {
    trackingBox.style.display = "none";
  });
}

/* CONSULTAR PEDIDO */

if (searchTrackingButton && trackingOrderId && trackingResult) {
  searchTrackingButton.addEventListener("click", async () => {

    const orderId = trackingOrderId.value.trim();

    if (!orderId) {
      trackingResult.innerHTML =
        "<p style='color:#d00;'>⚠️ Ingresa tu número de pedido.</p>";
      return;
    }

    trackingResult.innerHTML =
      "<p>🔎 Consultando pedido...</p>";

    try {
      const response = await fetch(
        `/api/pedidos/${encodeURIComponent(orderId)}`
      );

      const pedido = await response.json();

      if (!response.ok) {
        throw new Error(
          pedido.message || pedido.error || "Pedido no encontrado."
        );
      }

      trackingResult.innerHTML = `
        <div class="tracking-status">
          <h3>📦 Pedido #${pedido.id || orderId}</h3>
          <p><strong>Estado:</strong> ${pedido.estado || pedido.status || "En proceso"}</p>
        </div>
      `;

    } catch (error) {
      trackingResult.innerHTML = `
        <p style="color:#d00;">
          ❌ ${error.message || "No se pudo consultar el pedido."}
        </p>
      `;
    }
  });
}
  const checkoutContainer = document.getElementById("checkoutContainer");
  const closeCheckout = document.getElementById("closeCheckout");

  const stepCustomer = document.getElementById("stepCustomer");

  const customerName = document.getElementById("customerName");
  const customerPhone = document.getElementById("customerPhone");
  const customerEmail = document.getElementById("customerEmail");
  const customerAddress = document.getElementById("customerAddress");
  const deliveryReference = document.getElementById("deliveryReference");

  const confirmCustomerButton =
    document.getElementById("confirmCustomerButton");

  const homeDelivery = document.getElementById("homeDelivery");
  const storePickup = document.getElementById("storePickup");

  const departmentBox = document.getElementById("departmentBox");
  const pickupBox = document.getElementById("pickupBox");

  const departmentSelect = document.getElementById("department");

  const municipality = document.getElementById("municipality");
  const municipalityBox = document.getElementById("municipalityBox");

  const continueDeliveryButton =
    document.getElementById("continueDeliveryButton");

  const transferPayment =
    document.getElementById("transferPayment");

const paypalPayment =
  document.getElementById("paypalPayment");
/* PAYPAL NOVAGUET */
let paypalV6Instance = null;
let paypalV6Inicializado = false;
  const cashPayment =
    document.getElementById("cashPayment");

  const bank = document.getElementById("bank");
  const bankDetails = document.getElementById("bankDetails");

  const selectedBankName =
    document.getElementById("selectedBankName");

  const selectedAccountNumber =
    document.getElementById("selectedAccountNumber");

  const continuePaymentButton =
    document.getElementById("continuePaymentButton");

  const orderSummary =
    document.getElementById("orderSummary");

  const confirmOrderButton =
    document.getElementById("confirmOrderButton");

const backSummaryButton =
    document.getElementById("backSummaryButton");

const cancelCheckoutButton =
    document.getElementById("cancelCheckoutButton");

  const stepResult =
    document.getElementById("stepResult");

  const paymentResult =
    document.getElementById("paymentResult");

  const categoryButtons =
    document.querySelectorAll("[data-category]");

  const nosotrosButton =
    document.getElementById("nosotrosButton");

  const nosotrosCloud =
    document.getElementById("nosotrosCloud");
  /* =====================================================
     DATOS
  ===================================================== */

  let productos = [];
  let carrito = [];

  let descuentoPromocional = 0;
  let codigoPromocionalAplicado = "";

  let deliveryMethod = "";
  let paymentMethod = "";

  let orderData = {};


  /* =====================================================
     SONIDO DE ERROR
  ===================================================== */

  function sonidoError() {

    try {

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) return;

      const audioContext =
        new AudioContext();

      const oscillator =
        audioContext.createOscillator();

      const gainNode =
        audioContext.createGain();

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        220,
        audioContext.currentTime
      );

      oscillator.frequency.exponentialRampToValueAtTime(
        120,
        audioContext.currentTime + 0.25
      );

      gainNode.gain.setValueAtTime(
        0.25,
        audioContext.currentTime
      );

      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.25
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();

      oscillator.stop(
        audioContext.currentTime + 0.25
      );

    } catch (error) {

      console.warn(
        "No se pudo reproducir el sonido:",
        error
      );

    }

  }


  /* =====================================================
     SONIDO DE ÉXITO
  ===================================================== */

 function sonidoExito() {

  try {

    const audioContext =
      new (window.AudioContext ||
        window.webkitAudioContext)();

    const oscillator =
      audioContext.createOscillator();

    const gainNode =
      audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      523,
      audioContext.currentTime
    );

    oscillator.frequency.setValueAtTime(
      659,
      audioContext.currentTime + 0.12
    );

    oscillator.frequency.setValueAtTime(
      784,
      audioContext.currentTime + 0.24
    );

    gainNode.gain.setValueAtTime(
      0.25,
      audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.45
    );

    oscillator.connect(gainNode);

    gainNode.connect(
      audioContext.destination
    );

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + 0.45
    );

  } catch (error) {

    console.error(
      "No se pudo reproducir el sonido:",
      error
    );

  }

}

  /* =====================================================
     CARGAR CARRITO
  ===================================================== */

  try {

    const carritoGuardado =
      localStorage.getItem("novaguet_carrito");

    if (carritoGuardado) {

      const carritoParseado =
        JSON.parse(carritoGuardado);

      if (Array.isArray(carritoParseado)) {

        carrito =
          carritoParseado.map(item => ({

            ...item,

            cantidad:
              Math.max(
                1,
                Number(item.cantidad) || 1
              )

          }));

      }

    }

  } catch (error) {

    console.error(
      "Error cargando carrito:",
      error
    );

  }


  /* =====================================================
     GUARDAR CARRITO
  ===================================================== */

  function guardarCarrito() {

    try {

      localStorage.setItem(
        "novaguet_carrito",
        JSON.stringify(carrito)
      );

    } catch (error) {

      console.error(
        "Error guardando carrito:",
        error
      );

    }

  }


  /* =====================================================
     FORMATO DE PRECIO
  ===================================================== */

  function formatoPrecio(precio) {

    const numero =
      Number(precio) || 0;

    return (
      "HNL " +
      numero.toLocaleString(
        "es-HN",
        {
          maximumFractionDigits: 0
        }
      )
    );

  }


  /* =====================================================
     CONTADOR
  ===================================================== */

  function actualizarContadorCarrito() {

    if (!cartCount) return;

    const cantidad =
      carrito.reduce(
        (total, producto) =>
          total + Number(producto.cantidad || 0),
        0
      );

    cartCount.textContent =
      cantidad;

  }


  /* =====================================================
     PRODUCTOS
  ===================================================== */

  async function cargarProductos() {

    if (!productsContainer) return;

    try {

      productsContainer.innerHTML = "";

      const respuesta =
        await fetch(
          "/api/productos",
          {
            method: "GET",
            cache: "no-store"
          }
        );

      if (!respuesta.ok) {

        throw new Error(
          "Error HTTP " +
          respuesta.status
        );

      }

      const datos =
        await respuesta.json();

      if (!Array.isArray(datos)) {

        throw new Error(
          "La respuesta de productos no es válida."
        );

      }

      productos = datos;

      carrito =
        carrito
          .map(item => ({

            ...item,

            cantidad:
              Math.max(
                1,
                Number(item.cantidad) || 1
              )

          }))
          .filter(item => {

            const producto =
              productos.find(
                p =>
                  String(p.id) ===
                  String(item.id)
              );

            if (!producto) {
              return false;
            }

            const stock =
              Number(producto.stock);

            if (
              Number.isFinite(stock) &&
              stock <= 0
            ) {

              return false;

            }

            if (
              Number.isFinite(stock) &&
              Number(item.cantidad) > stock
            ) {

              item.cantidad = stock;

            }

            return true;

          });

      guardarCarrito();
await cargarResenasProductos();

mostrarProductos(productos);
actualizarEstrellasProductos();
mostrarCarrito();

    } catch (error) {

      console.error(
        "Error cargando productos:",
        error
      );

      productsContainer.innerHTML = `
        <p style="text-align:center;">
          No se pudieron cargar los productos.
        </p>
      `;

    }

  }

/* =====================================================
   NOVAGUET — SISTEMA DE FAVORITOS
===================================================== */

const FAVORITOS_KEY = "novaguet_favoritos";

function obtenerFavoritos() {
  try {
    const favoritos = JSON.parse(
      localStorage.getItem(FAVORITOS_KEY) || "[]"
    );

    return Array.isArray(favoritos)
      ? favoritos.map(String)
      : [];
  } catch (error) {
    return [];
  }
}

function guardarFavoritos(favoritos) {
  localStorage.setItem(
    FAVORITOS_KEY,
    JSON.stringify(favoritos)
  );
}

function actualizarBotonesFavoritos() {
  const favoritos = obtenerFavoritos();

  document
    .querySelectorAll(".favorite-button")
    .forEach(boton => {
      const id = String(boton.dataset.favoriteId);
      const activo = favoritos.includes(id);

      boton.textContent = activo ? "♥️" : "♡";
      boton.setAttribute("aria-pressed", String(activo));
      boton.setAttribute(
        "aria-label",
        activo ? "Quitar de favoritos" : "Agregar a favoritos"
      );
      boton.classList.toggle("is-favorite", activo);
    });
}

document.addEventListener("click", function (event) {
  const boton = event.target.closest(".favorite-button");

  if (!boton) return;

  const id = String(boton.dataset.favoriteId);
  const favoritos = obtenerFavoritos();
  const existe = favoritos.includes(id);

  const nuevosFavoritos = existe
    ? favoritos.filter(favorito => favorito !== id)
    : [...favoritos, id];

  guardarFavoritos(nuevosFavoritos);
  actualizarBotonesFavoritos();
});

/* =====================================================
   CARGAR RESEÑAS DE PRODUCTOS
===================================================== */

let resenasProductos = [];

async function cargarResenasProductos() {
  try {
    const respuesta = await fetch("/api/resenas");

    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar las reseñas.");
    }

    const resenas = await respuesta.json();

    resenasProductos = Array.isArray(resenas)
      ? resenas
      : [];

  } catch (error) {
    console.error("Error al cargar reseñas:", error);
    resenasProductos = [];
  }
}

/* =====================================================
   ACTUALIZAR ESTRELLAS DE PRODUCTOS
===================================================== */
function actualizarEstrellasProductos() {
  document.querySelectorAll("[data-reviews-id]").forEach(elemento => {
    const productoId = elemento.dataset.reviewsId;

    const resenas = resenasProductos.filter(
      resena => String(resena.productoId) === String(productoId)
    );

    const promedio = resenas.length
      ? resenas.reduce(
          (total, resena) => total + Number(resena.calificacion || 0),
          0
        ) / resenas.length
      : 0;

    const estrellas = elemento.querySelector(".reviews-stars");
    const promedioElemento = elemento.querySelector(".reviews-average");
    const enlace = elemento.querySelector(".show-product-reviews");

    if (estrellas) {
      estrellas.textContent =
        "★".repeat(Math.round(promedio)) +
        "☆".repeat(5 - Math.round(promedio));
    }

    if (promedioElemento) {
      promedioElemento.textContent = promedio.toFixed(1);
    }

    if (enlace) {
      enlace.textContent = "(" + resenas.length + ")";
      enlace.setAttribute("aria-label", "Ver " + resenas.length + " reseñas");
    }
  });
}
  /* =====================================================
     MOSTRAR PRODUCTOS
  ===================================================== */

  function mostrarProductos(lista) {

    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    if (
      !Array.isArray(lista) ||
      lista.length === 0
    ) {

      productsContainer.innerHTML = `
        <p style="text-align:center;">
          No hay productos disponibles.
        </p>
      `;

      return;

    }

    lista.forEach(producto => {

      const card =
        document.createElement("div");

      card.className =
        "product-card";

      const imagen =
        producto.imagen || "";

const imagenesProducto = Array.isArray(producto.imagenes)
  ? producto.imagenes
  : imagen
    ? [imagen]
    : [];

      const nombre =
        producto.nombre || "Producto";
const nombreMostrar =
  idiomaActual === "en"
    ? (producto.nombreEn || producto.nombre)
    : producto.nombre;
      const precio =
        Number(producto.precio) || 0;
const precioOriginal =
  Number(producto.precioOriginal) || 0;
      const categoriaOriginal =
  producto.categoria || "";

const talla =
  producto.talla || "";

const descripcionOriginal =
  producto.descripcion || "";
const descripcionMostrar =
  idiomaActual === "en"
    ? (producto.descripcionEn || descripcionOriginal)
    : descripcionOriginal;
const traducciones = {
  "Ropa": "Clothing",
  "Calzado": "Footwear",
  "Accesorios": "Accessories",
  "Hombre": "Men",
  "Mujer": "Women",
  "Niños": "Kids"
};

const categoria =
  idiomaActual === "en"
    ? traducciones[categoriaOriginal] || categoriaOriginal
    : categoriaOriginal;

const descripcion =
  descripcionOriginal;
      const stock =
        Number(producto.stock);

      const agotado =
        Number.isFinite(stock) &&
        stock <= 0;
let opcionesTalla = "";

if (talla) {
  const tallasDisponibles = talla
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  opcionesTalla = `
    <div class="product-size">
      <label for="talla-${producto.id}">
  ${idiomaActual === "en" ? "Size" : "Talla"}
</label>
      <select
        id="talla-${producto.id}"
        class="product-size-select"
        data-product-size="${producto.id}"
      >
        ${tallasDisponibles.map(t => `
          <option value="${t}">${t}</option>
        `).join("")}
      </select>
    </div>
  `;
}
      card.innerHTML = `

        <div class="product-image-container">

<button
  type="button"
  class="favorite-button"
  data-favorite-id="${producto.id}"
  aria-label="Agregar a favoritos"
  aria-pressed="false"
>
  ♡
</button>

         ${
            imagen
              ? `
                <img
                  src="${imagen}"
                  alt="${nombre}"
                  class="product-image"
                  loading="lazy"
                  onerror="this.style.display='none';"
                >
                ${imagenesProducto.slice(1).map(foto => `
                  <img
                    src="${foto}"
                    alt="${nombre}"
                    class="product-image-extra"
                    style="display:none;"
                  >
                `).join("")}
              `
              : ""
          }

        </div>
        <div class="product-info">

         <h3>${nombreMostrar}</h3>
<div
  class="product-reviews-summary"
  data-reviews-id="${producto.id}"
>
  <span class="reviews-average">0.0</span>
  <span class="reviews-stars">☆☆☆☆☆</span>
  <a
    href="#"
    class="show-product-reviews"
    data-show-reviews="${producto.id}"
  >(0)</a>
</div>

<div
  class="product-reviews"
  data-product-reviews="${producto.id}"
  hidden
>
  <div class="product-reviews-list"></div>
</div>
<a
  href="#"
  class="show-review-form"
  data-review-product="${producto.id}"
  style="display:inline-block;margin:5px 0 10px;color:#00bfff;font-size:14px;text-decoration:none;font-weight:500;"
>
  ${idiomaActual === "en" ? "⭐ Write a review" : "⭐ Escribir reseña"}
</a>

<div
  class="product-review-form-container"
  data-review-form="${producto.id}"
  hidden
></div>
          ${
            categoria
              ? `
                <p class="product-category">
                  ${categoria}
                </p>
              `
              : ""
          }

          ${
            descripcion
              ? `
               <p class="product-description">
  ${descripcionMostrar}
</p>
              `
              : ""
          }

          ${opcionesTalla}

          <div class="product-price">
  ${
    precioOriginal > precio
      ? `
        <div class="price-old">
          ${formatoPrecio(precioOriginal)}
        </div>

        <div class="price-current">
          ${formatoPrecio(precio)}

          <span class="discount-badge">
            -${Math.round((1 - precio / precioOriginal) * 100)}%
          </span>
        </div>
      `
      : formatoPrecio(precio)
  }
</div>
${
  Number.isFinite(stock)
    ? '<div class="product-stock ' +
        (agotado ? 'stock-out' : stock <= 2 ? 'stock-low' : 'stock-available') +
        '">' +
        (agotado
          ? (idiomaActual === "en" ? "Out of stock" : "Agotado")
          : stock <= 2
            ? (idiomaActual === "en"
                ? "Only " + stock + " left"
                : "Últimas " + stock + " " + (stock === 1 ? "unidad" : "unidades"))
            : (idiomaActual === "en" ? "Available" : "Disponible")) +
        '</div>'
    : ''
}
          <button
            type="button"
            class="add-to-cart"
            data-id="${producto.id}"
            ${agotado ? "disabled" : ""}
          >
           ${
  agotado
    ? (idiomaActual === "en" ? "SOLD OUT" : "AGOTADO")
    : (idiomaActual === "en" ? "Add to cart" : "Agregar al carrito")
}
      `;

      productsContainer.appendChild(card);

    });


    productsContainer
      .querySelectorAll(".add-to-cart")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            agregarAlCarrito(
              button.dataset.id
            );

          }
        );

      });

productsContainer
      .querySelectorAll(".show-review-form")
      .forEach(button => {
        button.addEventListener("click", event => {
          event.preventDefault();
          const productoId = button.dataset.reviewProduct;

          const contenedor = productsContainer.querySelector(
            '[data-review-form="' + productoId + '"]'
          );

          if (!contenedor) return;

          if (!contenedor.hidden) {
            contenedor.hidden = true;
            return;
          }

          contenedor.innerHTML = `
            <form class="product-review-form">
             <label>${idiomaActual === "en" ? "Your rating" : "Tu calificación"}</label>

              <div class="review-rating">
 aria-label="${idiomaActual === "en" ? "Select your rating" : "Selecciona tu calificación"}"

  <div class="review-stars-selector" role="group" aria-label="Selecciona tu calificación">
    <button type="button" class="review-star" data-rating="1" aria-label="${idiomaActual === "en" ? "1 star" : "1 estrella"}"
    <button type="button" class="review-star" data-rating="2" aria-label="${idiomaActual === "en" ? "2 stars" : "2 estrellas"}"
    <button type="button" class="review-star" data-rating="3" aria-label="${idiomaActual === "en" ? "3 stars" : "3 estrellas"}"
    <button type="button" class="review-star" data-rating="4" aria-label="${idiomaActual === "en" ? "4 stars" : "4 estrellas"}"
    <button type="button" class="review-star" data-rating="5" aria-label="${idiomaActual === "en" ? "5 stars" : "5 estrellas"}"
  </div>

  <input type="hidden" name=${idiomaActual === "en" ? "Rating" : "Calificación"} value="">

  <small class="rating-hint">${idiomaActual === "en" ? "Tap a star" : "Toca una estrella"}</small>
</div>
<label>${idiomaActual === "en" ? "Your comment" : "Tu comentario"}</label>

              <textarea
                name="comentario"
                maxlength="500"
               placeholder="${idiomaActual === "en" ? "Tell us about your experience (optional)" : "Cuéntanos tu experiencia (opcional)"}"
              ></textarea>

             <button type="submit">
  ${idiomaActual === "en" ? "Submit review" : "Publicar reseña"}
</button>
              <p class="review-message" aria-live="polite"></p>
            </form>
          `;
const formulario = contenedor.querySelector(
            ".product-review-form"
          );
const selectorEstrellas = formulario.querySelector(
  ".review-stars-selector"
);

const campoCalificacion = formulario.elements.calificacion;
const textoCalificacion = formulario.querySelector(".rating-hint");

selectorEstrellas.addEventListener("click", event => {
  const botonEstrella = event.target.closest(".review-star");

  if (!botonEstrella) return;

  const calificacion = Number(botonEstrella.dataset.rating);

  campoCalificacion.value = String(calificacion);

  selectorEstrellas.querySelectorAll(".review-star").forEach(estrella => {
    const activa = Number(estrella.dataset.rating) <= calificacion;

    estrella.textContent = activa ? "★" : "☆";
    estrella.classList.toggle("selected", activa);
    estrella.setAttribute("aria-pressed", String(activa));
  });

  textoCalificacion.textContent =
   calificacion + (
  idiomaActual === "en"
    ? (calificacion === 1 ? " star selected" : " stars selected")
    : (calificacion === 1 ? " estrella seleccionada" : " estrellas seleccionadas")
);
});
          formulario.addEventListener("submit", async event => {
            event.preventDefault();

            const mensaje = formulario.querySelector(
              ".review-message"
            );

            const botonEnviar = formulario.querySelector(
              'button[type="submit"]'
            );

            botonEnviar.disabled = true;
            mensaje.textContent = "Publicando reseña...";

            try {
              const respuesta = await fetch("/api/resenas", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  productoId: productoId,
                  calificacion: formulario.elements.calificacion.value,
                  comentario: formulario.elements.comentario.value
                })
              });

              const resultado = await respuesta.json();

              if (!respuesta.ok) {
                throw new Error(
                  resultado.error || "No se pudo publicar la reseña."
                );
              }

              mensaje.textContent = resultado.mensaje;

              await cargarResenasProductos();
              mostrarProductos(productos);
              actualizarEstrellasProductos();

            } catch (error) {
              mensaje.textContent = error.message;
            } finally {
              if (botonEnviar.isConnected) {
                botonEnviar.disabled = false;
              }
            }
          });
          contenedor.hidden = false;
        });
      });
      /* ABRIR Y MOSTRAR RESEÑAS DEL PRODUCTO */
productsContainer
  .querySelectorAll(".show-product-reviews")
  .forEach(enlace => {
    enlace.addEventListener("click", event => {
      event.preventDefault();

      const productoId = enlace.dataset.showReviews;

      const contenedor = productsContainer.querySelector(
        '[data-product-reviews="' + productoId + '"]'
      );

      if (!contenedor) return;

      if (!contenedor.hidden) {
        contenedor.hidden = true;
        return;
      }

      const lista = contenedor.querySelector(".product-reviews-list");
      lista.replaceChildren();

      const resenas = resenasProductos.filter(
        resena => String(resena.productoId) === String(productoId)
      );

      if (!resenas.length) {
        const mensaje = document.createElement("p");
       mensaje.textContent = idiomaActual === "en"
  ? "No reviews yet."
  : "Todavía no hay reseñas.";
        lista.appendChild(mensaje);
      } else {
        resenas.forEach(resena => {
          const item = document.createElement("div");
          item.className = "product-review-item";

          const nombre = document.createElement("strong");
          nombre.textContent = resena.nombre || (idiomaActual === "en" ? "Customer" : "Cliente");
          const estrellas = document.createElement("div");
          estrellas.textContent =
            "★".repeat(Math.max(0, Math.min(5, Number(resena.calificacion) || 0)));

          const comentario = document.createElement("p");
          comentario.textContent = resena.comentario || "";

          item.append(nombre, estrellas, comentario);
          lista.appendChild(item);
        });
      }

      contenedor.hidden = false;
    });
  });
      // Abrir automáticamente el formulario desde el correo.
const productoResenaCorreo =
  new URLSearchParams(window.location.search).get("resenar");

if (productoResenaCorreo) {
  const botonResena = productsContainer.querySelector(
    '.show-review-form[data-review-product="' +
    productoResenaCorreo + '"]'
  );

  if (botonResena) {
    botonResena.click();
  }
  const url = new URL(window.location.href);
url.searchParams.delete("resenar");

window.history.replaceState(
  {},
  "",
  url.pathname + url.search + url.hash
);
}
    actualizarBotonesFavoritos();
  }

  /* =====================================================
     AGREGAR AL CARRITO
  ===================================================== */

  function agregarAlCarrito(id) {

    const producto =
      productos.find(
        p =>
          String(p.id) ===
          String(id)
      );

    if (!producto) return;

    const stock =
      Number(producto.stock);

    if (
      Number.isFinite(stock) &&
      stock <= 0
    ) {

      sonidoError();

      alert(
        "Este producto está agotado."
      );

      return;

    }

    const existente =
      carrito.find(
        item =>
          String(item.id) ===
          String(id)
      );

    if (existente) {

      existente.cantidad =
        Number(existente.cantidad) || 1;

      if (
        Number.isFinite(stock) &&
        existente.cantidad >= stock
      ) {

        sonidoError();

        alert(
          "No hay más unidades disponibles."
        );

        return;

      }

      existente.cantidad =
        existente.cantidad + 1;

    } else {

      carrito.push({

        id: producto.id,

        nombre:
          producto.nombre || "",

        precio:
          Number(producto.precio) || 0,

        imagen:
          producto.imagen || "",

        talla:
          producto.talla || "",

        categoria:
          producto.categoria || "",

        cantidad: 1

      });

    }

   guardarCarrito();

actualizarContadorCarrito();

mostrarCarrito();

sonidoExito();

const mensaje = document.createElement("div");

mensaje.className = "aviso-producto-agregado";

mensaje.textContent =
  "✓ " + producto.nombre +
  " se agregó correctamente al carrito.";

document.body.appendChild(mensaje);

setTimeout(() => {
  mensaje.remove();
}, 3000);

  }


  /* =====================================================
     MOSTRAR CARRITO
  ===================================================== */

  function mostrarCarrito() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (
      !carrito ||
      carrito.length === 0
    ) {

      if (cartEmpty) {

        cartEmpty.style.display =
          "block";

      }

      actualizarTotales();

      actualizarContadorCarrito();

      return;

    }

    if (cartEmpty) {

      cartEmpty.style.display =
        "none";

    }

    carrito.forEach(item => {

      item.cantidad =
        Math.max(
          1,
          Number(item.cantidad) || 1
        );

      const cartProduct =
        document.createElement("div");

      cartProduct.className =
        "cart-product";

      cartProduct.innerHTML = `

        <div class="cart-product-image">

          ${
            item.imagen
              ? `
                <img
                  src="${item.imagen}"
                  alt="${item.nombre}"
                >
              `
              : ""
          }

        </div>

        <div class="cart-product-info">

          <strong>
            ${item.nombre}
          </strong>

          ${
            item.talla
              ? `
                <small>
                  Talla: ${item.talla}
                </small>
              `
              : ""
          }

          <span>
            ${formatoPrecio(item.precio)}
          </span>

          <div class="cart-quantity">

            <button
              type="button"
              class="quantity-minus"
              data-id="${item.id}"
            >
              −
            </button>

            <span>
              ${item.cantidad}
            </span>

            <button
              type="button"
              class="quantity-plus"
              data-id="${item.id}"
            >
              +
            </button>

          </div>

          <button
            type="button"
            class="remove-product"
            data-id="${item.id}"
          >
            Eliminar
          </button>

        </div>

      `;

      cartItems.appendChild(cartProduct);

    });


    cartItems
      .querySelectorAll(".quantity-minus")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            cambiarCantidad(
              button.dataset.id,
              -1
            );

          }
        );

      });


    cartItems
      .querySelectorAll(".quantity-plus")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            cambiarCantidad(
              button.dataset.id,
              1
            );

          }
        );

      });


    cartItems
      .querySelectorAll(".remove-product")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            eliminarDelCarrito(
              button.dataset.id
            );

          }
        );

      });

    actualizarTotales();
    actualizarContadorCarrito();

  }


  /* =====================================================
     CAMBIAR CANTIDAD
  ===================================================== */

  function cambiarCantidad(id, cambio) {

    const item =
      carrito.find(
        producto =>
          String(producto.id) ===
          String(id)
      );

    if (!item) return;

    item.cantidad =
      Math.max(
        1,
        Number(item.cantidad) || 1
      );

    const producto =
      productos.find(
        p =>
          String(p.id) ===
          String(id)
      );

    const stock =
      producto
        ? Number(producto.stock)
        : NaN;

    const nuevaCantidad =
      item.cantidad +
      Number(cambio);

    if (nuevaCantidad <= 0) {

      eliminarDelCarrito(id);

      return;

    }

    if (
      Number.isFinite(stock) &&
      nuevaCantidad > stock
    ) {

      sonidoError();

      alert(
        "No hay más unidades disponibles."
      );

      return;

    }

    item.cantidad =
      nuevaCantidad;

    guardarCarrito();

    mostrarCarrito();

  }


  /* =====================================================
     ELIMINAR
  ===================================================== */

  function eliminarDelCarrito(id) {

    carrito =
      carrito.filter(
        item =>
          String(item.id) !==
          String(id)
      );

    guardarCarrito();

    mostrarCarrito();

    actualizarContadorCarrito();

  }


  /* =====================================================
     SUBTOTAL
  ===================================================== */

  function calcularSubtotal() {

    return carrito.reduce(
      (total, item) => {

        return (
          total +
          (
            Number(item.precio) || 0
          ) *
          (
            Number(item.cantidad) || 0
          )
        );

      },
      0
    );

  }


  /* =====================================================
     TOTALES
  ===================================================== */

  function actualizarTotales() {

    const subtotal =
      calcularSubtotal();

    let descuento =
      Number(descuentoPromocional) || 0;

    if (descuento > subtotal) {
      descuento = subtotal;
    }

    const total =
      Math.max(
        0,
        subtotal - descuento
      );

    if (cartSubtotal) {

      cartSubtotal.textContent =
        formatoPrecio(subtotal);

    }

    if (cartTotal) {

      cartTotal.textContent =
        formatoPrecio(total);

    }

  }


  /* =====================================================
     PROMOCIÓN
  ===================================================== */

  if (applyPromo) {

    applyPromo.addEventListener(
      "click",
      () => {

        const codigo =
          promoCode
            ? promoCode.value
                .trim()
                .toUpperCase()
            : "";

        if (!codigo) {

          descuentoPromocional = 0;
          codigoPromocionalAplicado = "";

          if (promoMessage) {

            promoMessage.textContent =
              "Ingresa un código promocional.";

          }

          actualizarTotales();

          sonidoError();

          return;

        }

        if (codigo === "NOVAGUET10") {

          const subtotal =
            calcularSubtotal();

          descuentoPromocional =
            subtotal * 0.10;

          codigoPromocionalAplicado =
            codigo;

          if (promoMessage) {

            promoMessage.textContent =
              "✓ Código aplicado correctamente.";

          }

          actualizarTotales();

        } else {

          descuentoPromocional = 0;
          codigoPromocionalAplicado = "";

          if (promoMessage) {

            promoMessage.textContent =
              "Código promocional no válido.";

          }

          actualizarTotales();

          sonidoError();

        }

      }
    );

  }


  /* =====================================================
     CARRITO
  ===================================================== */

  if (cartButton) {

    cartButton.addEventListener(
      "click",
      () => {

        if (!cartBox) return;

        cartBox.classList.toggle(
          "show"
        );

        mostrarCarrito();

      }
    );

  }


  if (closeCart) {

    closeCart.addEventListener(
      "click",
      () => {

        if (cartBox) {

          cartBox.classList.remove(
            "show"
          );

        }

      }
    );

  }


  /* =====================================================
     BUSCADOR
  ===================================================== */

  if (searchButton) {

    searchButton.addEventListener(
      "click",
      () => {

        if (!searchBox) return;

        searchBox.classList.toggle(
          "show"
        );

        if (
          searchBox.classList.contains(
            "show"
          ) &&
          searchInput
        ) {

          setTimeout(
            () => searchInput.focus(),
            100
          );

        }

      }
    );

  }


  if (closeSearch) {

    closeSearch.addEventListener(
      "click",
      () => {

        if (searchBox) {

          searchBox.classList.remove(
            "show"
          );

        }

        if (searchInput) {

          searchInput.value = "";

        }

        mostrarProductos(productos);

      }
    );

  }


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      () => {

        const texto =
          searchInput.value
            .trim()
            .toLowerCase();

        if (!texto) {

          mostrarProductos(productos);

          return;

        }

        const resultados =
          productos.filter(
            producto => {

              const nombre =
                String(
                  producto.nombre || ""
                ).toLowerCase();

              const categoria =
                String(
                  producto.categoria || ""
                ).toLowerCase();

              const descripcion =
                String(
                  producto.descripcion || ""
                ).toLowerCase();

              return (
                nombre.includes(texto) ||
                categoria.includes(texto) ||
                descripcion.includes(texto)
              );

            }
          );

        mostrarProductos(
          resultados
        );

      }
    );

  }


  /* =====================================================
     CATEGORÍAS
  ===================================================== */

  categoryButtons.forEach(button => {

    button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        const categoria =
          button.dataset.category;

        if (
          !categoria ||
          categoria.toLowerCase() ===
          "todos"
        ) {

          mostrarProductos(productos);

          return;

        }

        const resultados =
          productos.filter(
            producto =>
              String(
                producto.categoria || ""
              ).toLowerCase() ===
              categoria.toLowerCase()
          );

        mostrarProductos(
          resultados
        );

      }
    );

  });


  /* =====================================================
     NOSOTROS
  ===================================================== */

  if (
    nosotrosButton &&
    nosotrosCloud
  ) {

    nosotrosButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        nosotrosCloud.classList.toggle(
          "show"
        );

      }
    );

  }


  document.addEventListener(
    "click",
    event => {

      if (
        nosotrosCloud &&
        nosotrosButton &&
        nosotrosCloud.classList.contains(
          "show"
        ) &&
        !nosotrosCloud.contains(
          event.target
        ) &&
        !nosotrosButton.contains(
          event.target
        )
      ) {

        nosotrosCloud.classList.remove(
          "show"
        );

      }

    }
    
  );


  /* =====================================================
     CHECKOUT - ABRIR
  ===================================================== */

  if (checkoutButton) {

checkoutButton.addEventListener(
  "click",
  async event => {

        event.preventDefault();

        if (carrito.length === 0) {

          sonidoError();

          alert(
            "Tu carrito está vacío."
          );

          return;

        }
        
try {
          const respuestaSesion = await fetch(
            "/api/clientes/sesion",
            {
              method: "GET",
              credentials: "same-origin"
            }
          );

          const resultadoSesion = await respuestaSesion
            .json()
            .catch(() => ({}));

          if (
            !respuestaSesion.ok ||
            resultadoSesion.ok !== true
          ) {
            alert(
              "Para continuar con tu compra, inicia sesión o crea una cuenta."
            );

window.location.href = "/cuenta.html?return=checkout";
            return;
          }

        } catch (error) {
          console.error(
            "Error al comprobar la sesión:",
            error
          );

          alert(
            "No pudimos comprobar tu sesión. Inténtalo de nuevo."
          );

          return;
        }


        if (cartBox) {

          cartBox.classList.add(
            "show"
          );

        }

        if (cartItems) {

          cartItems.style.display =
            "none";

        }

        if (cartEmpty) {

          cartEmpty.style.display =
            "none";

        }

        if (cartSummary) {

          cartSummary.style.display =
            "none";

        }

        if (checkoutContainer) {

          checkoutContainer.style.display =
            "block";

        }

        document
          .querySelectorAll(
            ".checkout-step"
          )
          .forEach(
            paso =>
              paso.style.display = "none"
          );

        if (stepCustomer) {

          stepCustomer.style.display =
            "block";

        }

        if (stepResult) {

          stepResult.style.display =
            "none";

        }

        if (paymentResult) {

          paymentResult.innerHTML = "";

        }

        deliveryMethod = "";
        paymentMethod = "";
        orderData = {};

        if (homeDelivery) {
          homeDelivery.checked = false;
        }

        if (storePickup) {
          storePickup.checked = false;
        }

        if (departmentSelect) {
          departmentSelect.value = "";
        }

        if (municipality) {

          municipality.innerHTML = `
            <option value="">
              Selecciona un municipio
            </option>
          `;

        }

        if (municipalityBox) {

          municipalityBox.style.display =
            "none";

        }

        if (departmentBox) {

          departmentBox.style.display =
            "none";

        }

        if (pickupBox) {

          pickupBox.style.display =
            "none";

        }

      }
    );

  }


  /* =====================================================
     CHECKOUT - CERRAR
  ===================================================== */

  if (closeCheckout) {

    closeCheckout.addEventListener(
      "click",
      event => {

        event.preventDefault();

        if (checkoutContainer) {

          checkoutContainer.style.display =
            "none";

        }

        if (cartItems) {

          cartItems.style.display =
            "block";

        }

        if (
          cartEmpty &&
          carrito.length === 0
        ) {

          cartEmpty.style.display =
            "block";

        }

        if (cartSummary) {

          cartSummary.style.display =
            "block";

        }

        mostrarCarrito();

      }
    );

  }
  
/* =====================================
     RETOMAR COMPRA DESPUÉS DE INICIAR SESIÓN
  ===================================== */

  const parametrosURL = new URLSearchParams(
    window.location.search
  );

  if (parametrosURL.get("return") === "checkout") {
    if (checkoutButton) {
      checkoutButton.click();
    }
  }

/* =====================================================

   CLIENTE

===================================================== */

if (confirmCustomerButton) {

  confirmCustomerButton.addEventListener(

    "click",

    () => {

      const nombre =

        customerName

          ? customerName.value.trim()

          : "";

      const telefono =

        customerPhone

          ? customerPhone.value.replace(/\D/g, "")

          : "";
const email = customerEmail
  ? customerEmail.value.trim().toLowerCase()
  : "";

const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!formatoEmail.test(email)) {
  sonidoError();
  alert("Ingresa un correo electrónico válido.");
  if (customerEmail) {
    customerEmail.focus();
  }
  return;
}
const partesNombre = nombre
  .trim()
  .split(/\s+/)
  .filter(Boolean);
if (partesNombre.length < 2) {
  sonidoError();
  alert(
    "Ingresa tu nombre y al menos un apellido."
  );
  return;
}

      if (telefono.length !== 8) {

        sonidoError();

        alert(

          "Ingresa un número de teléfono válido de Honduras de 8 dígitos."

        );

        return;

      }

    orderData.nombre = nombre;

orderData.telefono = telefono;
orderData.email = email;
// La dirección se agregará en ENTREGA
orderData.direccion = "";

// La referencia se guardará en el paso de entrega
orderData.referencia = "";

avanzarCheckout(
  "customer",
  "delivery"
);

    }

  );

}
/* =====================================================
   BOTÓN ATRÁS - CLIENTE
===================================================== */

const backCustomerButton =
  document.getElementById(
    "backCustomerButton"
  );

if (backCustomerButton) {

  backCustomerButton.addEventListener(
    "click",
    () => {

      if (stepCustomer) {
        stepCustomer.style.display = "none";
      }

      if (cartBox) {
        cartBox.classList.add("show");
      }

      if (cartItems) {
        cartItems.style.display = "";
      }

      if (cartSummary) {
        cartSummary.style.display = "";
      }

    }
  );

}

  /* =====================================================
     ENTREGA A DOMICILIO
  ===================================================== */

  if (homeDelivery) {

    homeDelivery.addEventListener(
      "change",
      () => {

        if (!homeDelivery.checked) return;

        deliveryMethod =
          "delivery";

        if (departmentBox) {

          departmentBox.style.display =
            "block";

        }

        if (municipalityBox) {

          municipalityBox.style.display =
            departmentSelect &&
            departmentSelect.value
              ? "block"
              : "none";

        }

        if (pickupBox) {

          pickupBox.style.display =
            "none";

        }

      }
    );

  }


  /* =====================================================
     RECOGER EN TIENDA
  ===================================================== */

  if (storePickup) {

    storePickup.addEventListener(
      "change",
      () => {

        if (!storePickup.checked) return;

        deliveryMethod =
          "pickup";

        orderData.departamento =
          "";

        orderData.municipio =
          "";

        orderData.referencia =
          "";

        orderData.direccion =
          "";

        if (departmentBox) {

          departmentBox.style.display =
            "none";

        }

        if (municipalityBox) {

          municipalityBox.style.display =
            "none";

        }

        if (pickupBox) {

          pickupBox.style.display =
            "block";

        }

      }
    );

  }


  /* =====================================================
     MUNICIPIOS DE HONDURAS
  ===================================================== */

  const municipiosHonduras = {

    "Atlántida": [
      "La Ceiba",
      "El Porvenir",
      "Esparta",
      "Jutiapa",
      "La Masica",
      "San Francisco",
      "Tela",
      "Arizona"
    ],

    "Colón": [
      "Trujillo",
      "Balfate",
      "Bonito Oriental",
      "Iriona",
      "Limón",
      "Sabá",
      "Santa Fe",
      "Santa Rosa de Aguán",
      "Sonaguera"
    ],

    "Comayagua": [
      "Comayagua",
      "Ajuterique",
      "El Rosario",
      "Esquías",
      "Humuya",
      "La Libertad",
      "Lamaní",
      "La Trinidad",
      "Lejamaní",
      "Meámbar",
      "Minas de Oro",
      "Ojos de Agua",
      "San Jerónimo",
      "San José de Comayagua",
      "San Luis",
      "San Sebastián",
      "Siguatepeque",
      "Villa de San Antonio"
    ],

    "Copán": [
      "Santa Rosa de Copán",
      "Cabañas",
      "Concepción",
      "Copán Ruinas",
      "Corquín",
      "Cucuyagua",
      "Dolores",
      "Dulce Nombre",
      "El Paraíso",
      "Florida",
      "La Jigua",
      "La Unión",
      "Nueva Arcadia",
      "San Agustín",
      "San Antonio",
      "San Jerónimo",
      "San José",
      "San Juan de Opoa",
      "San Nicolás",
      "Trinidad de Copán"
    ],

    "Cortés": [
      "San Pedro Sula",
      "Choloma",
      "La Lima",
      "Omoa",
      "Pimienta",
      "Potrerillos",
      "Puerto Cortés",
      "San Antonio de Cortés",
      "San Francisco de Yojoa",
      "San Manuel",
      "Santa Cruz de Yojoa",
      "Villanueva"
    ],

    "Choluteca": [
      "Choluteca",
      "Apacilagua",
      "Concepción de María",
      "Duyure",
      "El Corpus",
      "El Triunfo",
      "Marcovia",
      "Morolica",
      "Namasigüe",
      "Orocuina",
      "Pespire",
      "San Antonio de Flores",
      "San Isidro",
      "San José",
      "San Marcos de Colón",
      "Santa Ana de Yusguare"
    ],

    "El Paraíso": [
      "Yuscarán",
      "Alauca",
      "Danlí",
      "El Paraíso",
      "Güinope",
      "Jacaleapa",
      "Liure",
      "Morocelí",
      "Oropolí",
      "Potrerillos",
      "San Antonio de Flores",
      "San Lucas",
      "San Matías",
      "Soledad",
      "Teupasenti",
      "Texiguat",
      "Trojes",
      "Vado Ancho"
    ],

    "Francisco Morazán": [
      "Distrito Central",
      "Alubarén",
      "Cedros",
      "Curarén",
      "El Porvenir",
      "Guaimaca",
      "La Libertad",
      "La Venta",
      "Lepaterique",
      "Maraita",
      "Marale",
      "Nueva Armenia",
      "Ojojona",
      "Orica",
      "Reitoca",
      "Sabanagrande",
      "San Antonio de Oriente",
      "San Buenaventura",
      "San Ignacio",
      "San Juan de Flores",
      "San Miguelito",
      "Santa Ana",
      "Santa Lucía",
      "Talanga",
      "Tatumbla",
      "Valle de Ángeles",
      "Villa de San Antonio",
      "Villa de San Francisco"
    ],

    "Gracias a Dios": [
      "Puerto Lempira",
      "Brus Laguna",
      "Ahuas",
      "Juan Francisco Bulnes",
      "Ramón Villeda Morales",
      "Wampusirpi"
    ],

    "Intibucá": [
      "La Esperanza",
      "Camasca",
      "Colomoncagua",
      "Concepción",
      "Dolores",
      "Intibucá",
      "Jesús de Otoro",
      "Magdalena",
      "Masaguara",
      "San Antonio",
      "San Francisco de Opalaca",
      "San Isidro",
      "San Juan",
      "San Marcos de la Sierra",
      "Santa Lucía"
    ],

    "La Paz": [
      "La Paz",
      "Aguanqueterique",
      "Cabañas",
      "Cane",
      "Chinacla",
      "Guajiquiro",
      "Lauterique",
      "Marcala",
      "Mercedes de Oriente",
      "Opatoro",
      "San Antonio del Norte",
      "San José",
      "San Juan",
      "San Pedro de Tutule",
      "Santa Ana",
      "Santa Elena",
      "Santa María",
      "Santiago de Puringla",
      "Yarula"
    ],

    "Lempira": [
      "Gracias",
      "Belén",
      "Candelaria",
      "Cololaca",
      "Erandique",
      "Gualcince",
      "Guarita",
      "La Campa",
      "La Iguala",
      "Las Flores",
      "La Unión",
      "La Virtud",
      "Mapulaca",
      "Piraera",
      "San Andrés",
      "San Francisco",
      "San Juan Guarita",
      "San Manuel Colohete",
      "San Marcos de Caiquín",
      "Santa Cruz",
      "Talgua",
      "Tambla",
      "Tomalá",
      "Valladolid",
      "Virginia"
    ],

    "Ocotepeque": [
      "Nueva Ocotepeque",
      "Belén Gualcho",
      "Concepción",
      "Dolores Merendón",
      "Fraternidad",
      "La Encarnación",
      "La Labor",
      "Lucerna",
      "Mercedes",
      "San Fernando",
      "San Francisco del Valle",
      "San Jorge",
      "San Marcos",
      "Santa Fe",
      "Sensenti"
    ],

    "Olancho": [
      "Juticalpa",
      "Campamento",
      "Catacamas",
      "Concordia",
      "Dulce Nombre de Culmí",
      "El Rosario",
      "Esquipulas del Norte",
      "Gualaco",
      "Guarizama",
      "Guata",
      "Guayape",
      "Jano",
      "La Unión",
      "Mangulile",
      "Manto",
      "Patuca",
      "Salamá",
      "San Esteban",
      "San Francisco de Becerra",
      "San Francisco de la Paz",
      "Santa María del Real",
      "Silca",
      "Yocón"
    ],

    "Santa Bárbara": [
      "Santa Bárbara",
      "Arada",
      "Atima",
      "Azacualpa",
      "Ceguaca",
      "Chinda",
      "Concepción del Norte",
      "Concepción del Sur",
      "El Níspero",
      "Gualala",
      "Ilama",
      "Las Vegas",
      "Macuelizo",
      "Naranjito",
      "Nueva Frontera",
      "Petoa",
      "Protección",
      "Quimistán",
      "San Francisco de Ojuera",
      "San José de Colinas",
      "San Luis",
      "San Marcos",
      "San Nicolás",
      "San Pedro Zacapa",
      "Santa Rita",
      "Trinidad"
    ],

    "Valle": [
      "Nacaome",
      "Alianza",
      "Amapala",
      "Aramecina",
      "Caridad",
      "Goascorán",
      "Langue",
      "San Francisco de Coray",
      "San Lorenzo"
    ],

    "Yoro": [
      "Yoro",
      "Arenal",
      "El Negrito",
      "El Progreso",
      "Jocón",
      "Morazán",
      "Olanchito",
      "Santa Rita",
      "Sulaco",
      "Victoria",
      "Yorito"
    ]

  };


  /* =====================================================
     DEPARTAMENTO → MUNICIPIO
  ===================================================== */

  if (departmentSelect) {

    departmentSelect.addEventListener(
      "change",
      () => {

        if (!municipality) return;

        municipality.innerHTML = `
          <option value="">
            Selecciona un municipio
          </option>
        `;

        const equivalencias = {

          "atlantida": "Atlántida",
          "choluteca": "Choluteca",
          "colon": "Colón",
          "comayagua": "Comayagua",
          "copan": "Copán",
          "cortes": "Cortés",
          "el-paraiso": "El Paraíso",
          "francisco-morazan": "Francisco Morazán",
          "gracias-a-dios": "Gracias a Dios",
          "intibuca": "Intibucá",
          "la-paz": "La Paz",
          "lempira": "Lempira",
          "ocotepeque": "Ocotepeque",
          "olancho": "Olancho",
          "santa-barbara": "Santa Bárbara",
          "valle": "Valle",
          "yoro": "Yoro"

        };

        const clave =
          equivalencias[
            departmentSelect.value
          ];

        const municipios =
          municipiosHonduras[clave] || [];

        municipios.forEach(
          nombreMunicipio => {

            const option =
              document.createElement("option");

            option.value =
              nombreMunicipio;

            option.textContent =
              nombreMunicipio;

            municipality.appendChild(
              option
            );

          }
        );

        if (municipalityBox) {

          municipalityBox.style.display =
            municipios.length
              ? "block"
              : "none";

        }

      }
    );

  }

/* =====================================================
   CONTINUAR ENTREGA
===================================================== */

if (continueDeliveryButton) {

  continueDeliveryButton.addEventListener(
    "click",
    () => {

      if (!deliveryMethod) {

        sonidoError();

        alert(
          "Selecciona un método de entrega."
        );

        return;

      }
if (deliveryMethod === "delivery") {

  if (
    !departmentSelect ||
    !departmentSelect.value
  ) {
    sonidoError();
    alert("Selecciona tu departamento.");
    return;
  }

  if (
    !municipality ||
    !municipality.value
  ) {
    sonidoError();
    alert("Selecciona tu municipio.");
    return;
  }

  orderData.departamento =
    departmentSelect.value;

  orderData.municipio =
    municipality.value;

  orderData.direccion = "";

  // CONSERVAR la referencia de entrega
  const customerReference =
    document.getElementById("customerReference");

  orderData.referencia =
    customerReference
      ? customerReference.value.trim()
      : "";

} else {

  orderData.departamento = "";
  orderData.municipio = "";
  orderData.referencia = "";
  orderData.direccion = "";

}

orderData.metodoEntrega =
  deliveryMethod;

avanzarCheckout(
  "delivery",
  "payment"
);

}
);
}
/* =====================================================

   BOTÓN ATRÁS - ENTREGA

===================================================== */

const backDeliveryButton =

  document.getElementById(

    "backDeliveryButton"

  );

if (backDeliveryButton) {

  backDeliveryButton.addEventListener(

    "click",

    () => {

      avanzarCheckout(

        "delivery",

        "customer"

      );

    }

  );

}

/* =====================================================

   BOTÓN ATRÁS - PAGO

===================================================== */

const backPaymentButton =

  document.getElementById(

    "backPaymentButton"

  );

if (backPaymentButton) {

  backPaymentButton.addEventListener(

    "click",

    () => {

      avanzarCheckout(

        "payment",

        "delivery"

      );

    }

  );

}
 
  /* =====================================================
   CUENTAS BANCARIAS NOVAGUET
===================================================== */

const cuentasBancarias = {
  atlantida: {
    nombre: "Banco Atlántida",
    titular: "NOVA SHOP",
    numero: "230000000",
    tipo: "Ahorro"
  },

  ficohsa: {
    nombre: "Ficohsa",
    titular: "NOVA SHOP",
    numero: "240000000",
    tipo: "Ahorro"
  },

  bac: {
    nombre: "BAC Credomatic",
    titular: "NOVA SHOP",
    numero: "250000000",
    tipo: "Ahorro"
  }
};

/* SELECCIONAR BANCO */

function seleccionarBanco(nombreBanco) {
  const cuenta = cuentasBancarias[nombreBanco];

  if (!cuenta) return;

  if (bank) {
    bank.value = nombreBanco;
  }

  if (selectedBankName) {
    selectedBankName.textContent = cuenta.nombre;
  }

  if (selectedAccountNumber) {
    selectedAccountNumber.textContent = cuenta.numero;
  }

  const titular = document.getElementById("selectedAccountHolder");
  const tipo = document.getElementById("selectedAccountType");

  if (titular) titular.textContent = cuenta.titular;
  if (tipo) tipo.textContent = cuenta.tipo;

  if (bankDetails) {
    bankDetails.style.display = "block";
  }

  document.querySelectorAll(".bank-card").forEach(card => {
    card.classList.toggle(
      "active",
      card.dataset.bank === nombreBanco
    );
  });
}

/* SELECCIÓN DESDE SELECT */

if (bank) {
  bank.addEventListener("change", () => {
    seleccionarBanco(bank.value);
  });
}

/* SELECCIÓN DESDE LOGOS */

document.querySelectorAll(".bank-card").forEach(card => {
  card.addEventListener("click", () => {
    seleccionarBanco(card.dataset.bank);
  });
});

/* COPIAR CUENTA */

const copiarCuenta = document.getElementById("copyBankAccount");

if (copiarCuenta) {
  copiarCuenta.addEventListener("click", async () => {
    const numero = selectedAccountNumber?.textContent.trim();

    if (!numero) return;

    try {
      await navigator.clipboard.writeText(numero);
      alert("Número de cuenta copiado correctamente.");
    } catch {
      alert("No se pudo copiar el número de cuenta.");
    }
  });
}
/* =====================================================
   MÉTODO DE PAGO
===================================================== */
function obtenerMetodoPago() {
  if (transferPayment && transferPayment.checked) {

    return "transfer";

  }

  if (paypalPayment && paypalPayment.checked) {

    return "paypal";

  }

  if (cardPayment && cardPayment.checked) {

    return "card";

  }

  if (cashPayment && cashPayment.checked) {

    return "cash";

  }

  return "";
}
/* =====================================================
   PAYPAL NOVAGUET V6 — INICIALIZACIÓN
===================================================== */

async function renderizarBotonesPayPal() {
  try {
    if (paypalV6Inicializado) return;

    if (!window.paypal?.createInstance) {
      console.error("PayPal v6 no está disponible.");
      return;
    }

    const configRespuesta = await fetch("/api/paypal/config");

    if (!configRespuesta.ok) {
      throw new Error("No se pudo obtener el Client ID.");
    }

    const config = await configRespuesta.json();

    /* CONTENEDORES DE TARJETA */

    const numeroContenedor =
      document.getElementById("paypal-card-fields-number");

    const vencimientoContenedor =
      document.getElementById("paypal-card-fields-expiry");

    const cvvContenedor =
      document.getElementById("paypal-card-fields-cvv");

    if (
      !numeroContenedor ||
      !vencimientoContenedor ||
      !cvvContenedor
    ) {
      throw new Error("Faltan los contenedores de tarjeta en HTML.");
    }

    /* CREAR INSTANCIA PAYPAL */

    paypalV6Instance = await window.paypal.createInstance({
      clientId: config.clientId,
      components: ["paypal-payments", "card-fields"],
      pageType: "checkout"
    });

    /* CREAR CAMPOS SEGUROS */

    const cardSession =
      paypalV6Instance.createCardFieldsOneTimePaymentSession();

    const numero = cardSession.createCardFieldsComponent({
      type: "number",
      placeholder: "Número de tarjeta"
    });

    const vencimiento = cardSession.createCardFieldsComponent({
      type: "expiry",
      placeholder: "MM/YY"
    });

    const cvv = cardSession.createCardFieldsComponent({
      type: "cvv",
      placeholder: "CVV"
    });

    numeroContenedor.appendChild(numero);
    vencimientoContenedor.appendChild(vencimiento);
    cvvContenedor.appendChild(cvv);

    /* CONFIGURAR BOTÓN PAYPAL */

    await configurarPagoPayPalV6();

    paypalV6Inicializado = true;

    console.log("Campos seguros PayPal cargados.");

  } catch (error) {
    console.error("Error PayPal:", error);
  }
}

/* =====================================================
   PAYPAL V6 — EVENTO DE CARGA
===================================================== */

window.onPayPalWebSdkLoaded = async function () {
  console.log("PayPal v6 SDK cargado.");

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      renderizarBotonesPayPal,
      { once: true }
    );
  } else {
    await renderizarBotonesPayPal();
  }
};
/* =====================================================
   PAYPAL V6 — PAGO Y CAPTURA
===================================================== */

async function crearOrdenPayPal() {
  const totalHNL = Number(
    document.getElementById("totalHNL")?.textContent
      ?.replace(/[^\d.]/g, "") || 0
  );

  const respuesta = await fetch("/api/paypal/crear-orden", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      totalHNL
    })
  });

  const datos = await respuesta.json();

  if (!respuesta.ok || !datos.id) {
    throw new Error(datos.error || "No se pudo crear la orden.");
  }

  return datos.id;
}

async function capturarOrdenPayPal(orderId) {
  const respuesta = await fetch("/api/paypal/capturar-orden", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      orderID: orderId
    })
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || "No se pudo capturar el pago.");
  }

  return datos;
}

/* =====================================================
   PAYPAL V6 — BOTÓN OFICIAL NOVAGUET
===================================================== */

async function configurarPagoPayPalV6() {
  const boton = document.getElementById("paypal-v6-button");

  if (!boton || !paypalV6Instance) {
    throw new Error("No se encontró el botón PayPal o la instancia.");
  }

  /* COMPROBAR DISPONIBILIDAD */
const elegibilidad =
  await paypalV6Instance.findEligibleMethods({
    currencyCode: "USD"
  });

console.log("Elegibilidad PayPal:", elegibilidad);

console.log(
  "PayPal elegible:",
  elegibilidad.isEligible("paypal")
);

console.log(
  "Botón encontrado:",
  document.getElementById("paypal-v6-button")
);
  /* CREAR SESIÓN DE PAGO */

  const sesion =
    paypalV6Instance.createPayPalOneTimePaymentSession({
      onApprove: async ({ orderId }) => {
        try {
          const captura = await capturarOrdenPayPal(orderId);

          console.log("Orden capturada:", captura);
          alert("¡Pago realizado correctamente!");
        } catch (error) {
          console.error("Error capturando pago:", error);
          alert("El pago necesita verificación.");
        }
      },

      onCancel: () => {
        console.log("Pago cancelado.");
      },

      onError: (error) => {
        console.error("Error PayPal:", error);
      }
    });

  /* MOSTRAR BOTÓN */

  boton.removeAttribute("hidden");

  /* EVITAR EVENTOS DUPLICADOS */

  if (boton.dataset.paypalConfigurado === "true") return;

  boton.dataset.paypalConfigurado = "true";

  boton.addEventListener("click", async () => {
    try {
      await sesion.start(
        { presentationMode: "auto" },
        async () => ({
          orderId: await crearOrdenPayPal()
        })
      );
    } catch (error) {
      console.error("Error iniciando PayPal:", error);
      alert("No se pudo iniciar el pago con PayPal.");
    }
  });
}
/* BOTÓN TARJETA */
async function pagarConTarjetaPayPalV6() {
  try {
    if (!paypalV6Instance) {
      throw new Error("PayPal todavía no está inicializado.");
    }

    const orderId = await crearOrdenPayPal();

    const resultado = await paypalV6Instance
      .createCardFieldsOneTimePaymentSession()
      .submit(orderId);

    if (resultado.state !== "succeeded") {
      throw new Error(
        resultado.data?.message || "El pago con tarjeta no fue aprobado."
      );
    }

    const captura = await capturarOrdenPayPal(orderId);

    console.log("Pago con tarjeta capturado:", captura);

    alert("Pago procesado correctamente.");

  } catch (error) {
    console.error("Error tarjeta PayPal:", error);
    alert(error.message || "No se pudo procesar el pago.");
  }
}

/* CONECTAR BOTONES */
document.addEventListener("DOMContentLoaded", () => {
  const tarjeta = document.getElementById("paypal-card-submit");

  if (tarjeta) {
    tarjeta.addEventListener("click", pagarConTarjetaPayPalV6);
  }
});
 /* =====================================================
   MOSTRAR PAGO
===================================================== */

function actualizarPago() {
  paymentMethod = obtenerMetodoPago();

  const bankBox = document.getElementById("bankBox");
  const bankDetailsBox = document.getElementById("bankDetails");
  const paypalBox = document.getElementById("paypalContainer");
  const cardBox = document.getElementById("cardContainer");
  const cashBox = document.getElementById("cashBox");

  if (bankBox) {
    bankBox.style.display =
      paymentMethod === "transfer" ? "block" : "none";
  }

  if (bankDetailsBox && paymentMethod !== "transfer") {
    bankDetailsBox.style.display = "none";
  }

  if (paypalBox) {
    paypalBox.style.display =
      paymentMethod === "paypal" ? "block" : "none";
  }

  if (cardBox) {
    cardBox.style.display =
      paymentMethod === "card" ? "block" : "none";
  }

  if (cashBox) {
    cashBox.style.display =
      paymentMethod === "cash" ? "block" : "none";
  }

  if (
    paymentMethod === "paypal" ||
    paymentMethod === "card"
  ) {
    renderizarBotonesPayPal();
  }
}

/* =====================================================
   EVENTOS DE PAGO
===================================================== */

if (transferPayment) {
  transferPayment.addEventListener("change", actualizarPago);
}

if (paypalPayment) {
  paypalPayment.addEventListener("change", actualizarPago);
}

if (cardPayment) {
  cardPayment.addEventListener("change", actualizarPago);
}

if (cashPayment) {
  cashPayment.addEventListener("change", actualizarPago);
}

/* =====================================================
   CONTINUAR PAGO
===================================================== */

if (continuePaymentButton) {

  continuePaymentButton.addEventListener("click", () => {

    paymentMethod = obtenerMetodoPago();

    if (!paymentMethod) {
      sonidoError();
      alert("Selecciona una forma de pago.");
      return;
    }

    if (paymentMethod === "transfer") {

      if (!bank || !bank.value) {
        sonidoError();
        alert("Selecciona el banco.");
        return;
      }
    }

    orderData.metodoPago = paymentMethod;

    orderData.banco =
      paymentMethod === "transfer" && bank
        ? bank.value
        : "";

    mostrarResumen();

    avanzarCheckout("payment", "summary");

  });

}
/* =====================================================
   BOTÓN ATRÁS DEL RESUMEN
===================================================== */

if (backSummaryButton) {
  backSummaryButton.addEventListener("click", () => {
    avanzarCheckout("summary", "payment");
  });
}

/* =====================================================
   BOTÓN CANCELAR COMPRA
===================================================== */

if (cancelCheckoutButton) {
  cancelCheckoutButton.addEventListener("click", () => {
    const cancelar = confirm(
      "¿Estás seguro de que deseas cancelar la compra?"
    );

    if (!cancelar) {
      return;
    }

    if (checkoutContainer) {
      checkoutContainer.style.display = "none";
    }

    if (stepResult) {
      stepResult.style.display = "none";
    }

    if (cartBox) {
      cartBox.style.display = "none";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
/* =====================================================
   AVANZAR CHECKOUT
===================================================== */

function avanzarCheckout(actual, siguiente) {

  const pasosCheckout = [
    "stepCustomer",
    "stepDelivery",
    "stepPayment",
    "stepSummary"
  ];

  // Ocultar todos los pasos del checkout
  pasosCheckout.forEach(id => {
    const paso = document.getElementById(id);

    if (paso) {
      paso.style.display = "none";
    }
  });

  // Mostrar únicamente el siguiente paso
  const pasoSiguiente = document.getElementById(
    siguiente === "customer" ? "stepCustomer" :
    siguiente === "delivery" ? "stepDelivery" :
    siguiente === "payment" ? "stepPayment" :
    siguiente === "summary" ? "stepSummary" :
    ""
  );

  if (pasoSiguiente) {
    pasoSiguiente.style.display = "block";
  }

  // Ocultar otros elementos identificados mediante data-step
  document.querySelectorAll("[data-step]").forEach(elemento => {
    elemento.style.display =
      elemento.dataset.step === siguiente ? "block" : "none";
  });

}

  /* =====================================================
     MOSTRAR RESUMEN
  ===================================================== */

  function mostrarResumen() {

    if (!orderSummary) return;

    const subtotal =
      calcularSubtotal();

    const descuento =
      Math.min(
        Number(descuentoPromocional) || 0,
        subtotal
      );

    const total =
      Math.max(
        0,
        subtotal - descuento
      );

    let html = `

      <div class="summary-section">

        <h3>
          Productos
        </h3>

    `;

    carrito.forEach(item => {

      const importe =
        (
          Number(item.precio) || 0
        ) *
        (
          Number(item.cantidad) || 0
        );

      html += `

        <div class="summary-product">

          <span>
            ${item.nombre} × ${item.cantidad}
          </span>

          <strong>
            ${formatoPrecio(importe)}
          </strong>

        </div>

      `;

    });

    html += `

      </div>

      <div class="summary-section">

        <h3>
          Cliente
        </h3>

        <p>
          <strong>Nombre:</strong>
          ${orderData.nombre || ""}
        </p>

        <p>
          <strong>Teléfono:</strong>
          +504 ${orderData.telefono || ""}
        </p>

        <p>
  <strong>Correo electrónico:</strong>
  ${orderData.email || ""}
</p>

      </div>

      <div class="summary-section">

        <h3>
          Entrega
        </h3>

        <p>
          ${
            orderData.metodoEntrega ===
            "delivery"
              ? "🚚 Entrega a domicilio"
              : "🏪 Recoger en tienda"
          }
        </p>

    `;

    if (
      orderData.metodoEntrega ===
      "delivery"
    ) {

      const departamentoNombre =
        departmentSelect &&
        departmentSelect.options[
          departmentSelect.selectedIndex
        ]
          ? departmentSelect.options[
              departmentSelect.selectedIndex
            ].text
          : orderData.departamento;

      html += `

        <p>
          <strong>Departamento:</strong>
          ${departamentoNombre || ""}
        </p>

        <p>
          <strong>Municipio:</strong>
          ${orderData.municipio || ""}
        </p>

        <p>
          <strong>Referencia:</strong>
          ${orderData.referencia || ""}
        </p>

      `;

    } else {

      html += `

        <p>
          <strong>Punto de recogida:</strong>
          Comayagua, Honduras 🇭🇳
        </p>

      `;

    }

    html += `

      </div>

      <div class="summary-section">

        <h3>
          Pago
        </h3>

<p>
  ${
    orderData.metodoPago === "transferencia"
      ? "🏦 Transferencia bancaria"
      : orderData.metodoPago === "paypal"
        ? "💳 PayPal · Visa · Mastercard"
        : "💵 Efectivo"
  }
</p>

    `;

    if (
      orderData.metodoPago ===
      "transferencia"
    ) {

      const cuenta =
        cuentasBancarias[
          orderData.banco
        ];

      html += `

        <p>
          <strong>Banco:</strong>
          ${
            cuenta
              ? cuenta.nombre
              : ""
          }
        </p>

      `;

    }

    html += `

      </div>

      <div class="summary-total">

        <p>

          <span>
            Subtotal:
          </span>

          <strong>
            ${formatoPrecio(subtotal)}
          </strong>

        </p>

    `;

    if (descuento > 0) {

      html += `

        <p>

          <span>
          Descuento ${
  codigoPromocionalAplicado
    ? "(" + codigoPromocionalAplicado + ")"
    : ""
}: 
          </span>

          <strong>
            -${formatoPrecio(descuento)}
          </strong>

        </p>

      `;

    }

    html += `

        <p class="total-final">

          <span>
            Total:
          </span>

          <strong>
            ${formatoPrecio(total)}
          </strong>

        </p>

      </div>

    `;

    orderSummary.innerHTML =
      html;

  }


  /* =====================================================
     CONFIRMAR PEDIDO
  ===================================================== */

  if (confirmOrderButton) {

    confirmOrderButton.addEventListener(
      "click",
      async () => {

        if (carrito.length === 0) {

          sonidoError();

          alert(
            "Tu carrito está vacío."
          );

          return;

        }

        const subtotal =
          calcularSubtotal();

        const descuento =
          Math.min(
            Number(descuentoPromocional) || 0,
            subtotal
          );

        const total =
          Math.max(
            0,
            subtotal - descuento
          );
const pedido = {
  cliente: {
    nombre: orderData.nombre || "",
    telefono: orderData.telefono || "",
    email: orderData.email || "",
    direccion: orderData.direccion || ""
  },

  nombre: orderData.nombre || "",
  telefono: orderData.telefono || "",
  email: orderData.email || "",

          productos:
            carrito.map(
              item => ({

                id:
                  item.id,

                nombre:
                  item.nombre,

                precio:
                  Number(item.precio) || 0,

                cantidad:
                  Number(item.cantidad) || 0,

                talla:
                  item.talla || "",

                imagen:
                  item.imagen || ""

              })
            ),

          entrega: {

            metodo:
              orderData.metodoEntrega || "",

            departamento:
              orderData.departamento || "",

            municipio:
              orderData.municipio || "",

            referencia:
              orderData.referencia || "",

            puntoRecogida:
              orderData.metodoEntrega === "pickup"
                ? "Comayagua, Honduras"
                : ""

          },

          pago: {

            metodo:
              orderData.metodoPago || "",

            banco:
              orderData.banco || ""

          },

          promocion: {

            codigo:
              codigoPromocionalAplicado,

            descuento:
              descuento

          },

          subtotal:
            subtotal,

          descuento:
            descuento,

          total:
            total,

          fecha:
            new Date().toISOString()

        };

console.log("PEDIDO A ENVIAR:", pedido);
        try {

          confirmOrderButton.disabled =
            true;

          confirmOrderButton.textContent =
            "PROCESANDO...";


          const respuesta =
            await fetch(
              "/api/pedidos",
              {

                method:
                  "POST",

                headers: {

                  "Content-Type":
                    "application/json"

                },

                body:
                  JSON.stringify(pedido)

              }
            );


          const resultado =
            await respuesta
              .json()
              .catch(
                () => ({})
              );

if (respuesta.status === 401) {

            sonidoError();

            alert(
              "Para realizar tu pedido, debes registrarte o iniciar sesión."
            );

            return;

          }

          if (!respuesta.ok) {

            throw new Error(
              resultado.error ||
              "No se pudo crear el pedido."
            );

          }
        
          /* =====================================
             PEDIDO CORRECTO
          ===================================== */

          carrito = [];

          descuentoPromocional =
            0;

          codigoPromocionalAplicado =
            "";

          guardarCarrito();

          actualizarContadorCarrito();

          mostrarCarrito();


          /* Ocultar pasos */

          document
            .querySelectorAll(
              ".checkout-step"
            )
            .forEach(
              paso => {
                paso.style.display =
                  "none";
              }
            );


          /* Mostrar resultado */

          if (checkoutContainer) {

            checkoutContainer.style.display =
              "block";

          }

          if (stepResult) {

            stepResult.style.display =
              "block";

          }
if (paymentResult) {

 paymentResult.innerHTML = `
  <div class="payment-success">

    <div class="confirmation-check">
      ✓
    </div>

    <h2>
      ¡PEDIDO CONFIRMADO!
    </h2>

    <div class="novaguet-confirmed">
      <span class="nova-confirmed">NOVA</span><span class="guet-confirmed">GUET</span>
    </div>

    <p>
      Gracias por comprar con nosotros.
    </p>

    <p class="confirmation-small">
      Tu pedido ha sido recibido correctamente.
    </p>

    <p>
      📦 <strong>Número de pedido:</strong>
      ${resultado.pedido.id}
    </p>

    <button
      type="button"
      class="tracking-button"
      onclick="document.getElementById('trackingOrderId').value='${resultado.pedido.id}'; document.getElementById('trackingBox').style.display='block'; document.getElementById('trackingResult').innerHTML=''; document.getElementById('trackingBox').scrollIntoView({behavior:'smooth'});"
    >
      📦 VER ESTADO DE MI PEDIDO
    </button>

<button
  type="button"
  class="return-store-button"
  onclick="
    document.getElementById('checkoutContainer').style.display = 'none';
    document.getElementById('stepResult').style.display = 'none';
    document.getElementById('cartBox').style.display = 'none';
    window.scrollTo({top: 0, behavior: 'smooth'});
  "
>
  ← REGRESAR A LA TIENDA
</button>

  </div>
`;

  paymentResult.style.display =
    "block";

}

          sonidoExito();
          /* =====================================

             VOLVER A LA PÁGINA PRINCIPAL

          ===================================== */

          /* =====================================
             OCULTAR CARRITO
          ===================================== */

          if (cartItems) {

            cartItems.style.display =
              "none";

          }

          if (cartSummary) {

            cartSummary.style.display =
              "none";

          }

          if (cartEmpty) {

            cartEmpty.style.display =
              "none";

          }

          if (confirmOrderButton) {

            confirmOrderButton.style.display =
              "none";

          }

        } catch (error) {

          sonidoError();

          console.error(
            "Error creando pedido:",
            error
          );

          alert(
            error.message ||
            "No se pudo procesar el pedido."
          );

        } finally {

          if (confirmOrderButton) {

            confirmOrderButton.disabled =
              false;

            confirmOrderButton.textContent =
              "CONFIRMAR PEDIDO";

          }

        }

      }
    );

  }


  /* =====================================================
     IDIOMA
  ===================================================== */
let idiomaActual = "es";
  window.changeLanguage =
    function (idioma) {
idiomaActual = idioma;
      document
        .querySelectorAll("[data-es]")
        .forEach(elemento => {

          const texto =
            elemento.getAttribute(
              "data-" + idioma
            );

          if (texto !== null) {

            elemento.textContent =
              texto;

          }

        });

      document.documentElement.lang =
        idioma;
if (typeof productos !== "undefined" && Array.isArray(productos)) {
  mostrarProductos(productos);
  actualizarEstrellasProductos();
  cargarResenasProductos();
}
    };


  /* =====================================================
     VOLVER A LA TIENDA
  ===================================================== */

  const backToStoreButton =
    document.getElementById(
      "backToStoreButton"
    );

  if (backToStoreButton) {

    backToStoreButton.addEventListener(
      "click",
      () => {

        if (stepResult) {

          stepResult.style.display =
            "none";

        }

        if (paymentResult) {

          paymentResult.innerHTML =
            "";

        }

        if (checkoutContainer) {

          checkoutContainer.style.display =
            "none";

        }

        if (cartBox) {

          cartBox.classList.remove(
            "show"
          );

        }

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

        cargarProductos();

      }
    );

  }

/* =====================================================
   RASTREAR PEDIDO
===================================================== */

if (trackingButton) {

  trackingButton.addEventListener(
    "click",
    () => {

      if (
        trackingBox.style.display === "none" ||
        trackingBox.style.display === ""
      ) {

        trackingBox.style.display = "block";

        trackingOrderId.focus();

      } else {

        trackingBox.style.display = "none";

        trackingResult.innerHTML = "";

      }

    }
  );

}

if (searchTrackingButton) {

  searchTrackingButton.addEventListener(
    "click",
    async () => {

      const id =
        trackingOrderId.value.trim();

      if (!id) {

        trackingResult.innerHTML =
          "<p>⚠️ Ingresa el número de tu pedido.</p>";

        return;

      }

      trackingResult.innerHTML =
        "<p>🔄 Consultando pedido...</p>";

      try {

        const respuesta =
          await fetch(
            "/api/pedidos/" +
            encodeURIComponent(id)
          );

        const resultado =
          await respuesta
            .json()
            .catch(
              () => ({})
            );

        if (!respuesta.ok) {

          trackingResult.innerHTML =
            "<p>❌ " +
            (
              resultado.error ||
              "Pedido no encontrado."
            ) +
            "</p>";

          return;

        }

        mostrarEstadoPedido(
          resultado
        );

      } catch (error) {

        console.error(error);

        trackingResult.innerHTML =
          "<p>❌ No se pudo consultar el pedido.</p>";

      }

    }
  );

}

/* =====================================================
   MOSTRAR ESTADO DEL PEDIDO
===================================================== */

function mostrarEstadoPedido(pedido) {

  const estados = [
    "Pendiente",
    "Confirmado",
    "Preparando",
    "Enviado",
    "Entregado"
  ];

  const estadoActual = pedido.estado;

  if (estadoActual === "Cancelado") {

    trackingResult.innerHTML =
      '<div class="tracking-cancelled">' +
        "<h3>❌ Pedido cancelado</h3>" +
        "<p>Pedido #" + pedido.id + "</p>" +
      "</div>";

    return;
  }

  const indiceActual = estados.indexOf(estadoActual);

  const porcentaje =
    indiceActual >= 0
      ? (indiceActual / (estados.length - 1)) * 100
      : 0;

  trackingResult.innerHTML =
    '<div class="tracking-info">' +

      "<h3>📦 Pedido #" +
      pedido.id +
      "</h3>" +

      "<p>Estado actual: <strong>" +
      estadoActual +
      "</strong></p>" +

      '<div class="tracking-modern">' +

        '<div class="tracking-track">' +

          '<div class="tracking-track-bg"></div>' +

          '<div class="tracking-track-fill" style="width:' +
            porcentaje +
          '%;"></div>' +

          '<div class="tracking-truck" style="left:' +
            porcentaje +
          '%;">🚚</div>' +

        '</div>' +

        (estadoActual === "Entregado"
          ? '<div class="tracking-delivered">✓ ENTREGADO</div>'
          : '') +

      '</div>' +

    '</div>';
}

/* =====================================================
   NOVAGUET — ABRIR Y CERRAR GUÍA DE TALLAS
===================================================== */

const sizeGuideOverlay = document.getElementById("sizeGuideOverlay");
const closeSizeGuide = document.getElementById("closeSizeGuide");

if (sizeGuideOverlay) {
  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-size-guide]")) {
      sizeGuideOverlay.classList.add("is-open");
    }

    if (
      event.target === sizeGuideOverlay ||
      event.target.closest("#closeSizeGuide")
    ) {
      sizeGuideOverlay.classList.remove("is-open");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      sizeGuideOverlay.classList.remove("is-open");
    }
  });
}

  /* =====================================================
     INICIALIZAR
  ===================================================== */

  actualizarContadorCarrito();

  mostrarCarrito();

  actualizarPago();

  cargarProductos();

});

/* NOVAGUET: abrir y cerrar menú lateral */
(() => {
  const botonMenu = document.getElementById("menuHamburger");
  const botonCerrar = document.getElementById("closeSideMenu");
  const menuLateral = document.getElementById("sideMenu");
  const fondoMenu = document.getElementById("menuOverlay");
  const botonNosotros = document.getElementById("sideNosotrosButton");

  if (!botonMenu || !menuLateral || !fondoMenu) return;

  function abrirMenu() {
    menuLateral.classList.add("is-open");
    fondoMenu.classList.add("is-visible");
    menuLateral.setAttribute("aria-hidden", "false");
    botonMenu.setAttribute("aria-expanded", "true");
  }

  function cerrarMenu() {
    menuLateral.classList.remove("is-open");
    fondoMenu.classList.remove("is-visible");
    menuLateral.setAttribute("aria-hidden", "true");
    botonMenu.setAttribute("aria-expanded", "false");
  }

  botonMenu.addEventListener("click", abrirMenu);
  fondoMenu.addEventListener("click", cerrarMenu);
if (botonNosotros) {
  botonNosotros.addEventListener("click", (event) => {
    event.preventDefault();
    cerrarMenu();

    const nosotros = document.getElementById("nosotrosCloud");

    if (nosotros) {
      nosotros.classList.add("show");
      nosotros.style.position = "fixed";
      nosotros.style.top = "80px";
      nosotros.style.left = "50%";
      nosotros.style.transform = "translateX(-50%)";
      nosotros.style.width = "min(330px, calc(100vw - 30px))";
      nosotros.style.zIndex = "10001";
    }
  });
}
  if (botonCerrar) {
    botonCerrar.addEventListener("click", cerrarMenu);
  }

 menuLateral.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", (event) => {
    const destino = enlace.getAttribute("href");
    cerrarMenu();
    if (destino === "#contacto") {
      event.preventDefault();
      const footer = document.getElementById("contacto");
      if (footer) {
        setTimeout(() => {
          footer.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 100);
      }
    }
  });
});
})();

/* NOVAGUET: mostrar productos favoritos */

(() => {
  const enlaceFavoritos = document.querySelector(
    '.side-menu-links a[href="#favoritos"]'
  );

  const seccionProductos = document.getElementById("productos");
  const seccionFavoritos = document.getElementById("favoritos");
  const contenedorProductos = document.getElementById("productsContainer");
  const contenedorFavoritos = document.getElementById("favoritosContainer");
  const botonVolver = document.getElementById("volverProductos");

  if (
    !enlaceFavoritos ||
    !seccionProductos ||
    !seccionFavoritos ||
    !contenedorProductos ||
    !contenedorFavoritos ||
    !botonVolver
  ) return;

  enlaceFavoritos.addEventListener("click", (event) => {
    event.preventDefault();

    const favoritos = JSON.parse(
      localStorage.getItem("novaguet_favoritos") || "[]"
    ).map(String);

    contenedorFavoritos.innerHTML = "";

    const productosFavoritos = Array.from(
      contenedorProductos.querySelectorAll(".product-card")
    ).filter((tarjeta) => {
      const boton = tarjeta.querySelector(".favorite-button");
      return boton && favoritos.includes(
        String(boton.dataset.favoriteId)
      );
    });

    if (productosFavoritos.length === 0) {
      contenedorFavoritos.innerHTML =
        "<p style='text-align:center;'>Todavía no tienes productos favoritos. Marca ♥️ en los productos que te gusten.</p>";
    } else {
      productosFavoritos.forEach((tarjeta) => {
        const copia = tarjeta.cloneNode(true);
        contenedorFavoritos.appendChild(copia);

        const botonCarrito = copia.querySelector(".add-to-cart");

        if (botonCarrito && !botonCarrito.disabled) {
          botonCarrito.addEventListener("click", () => {
            agregarAlCarrito(botonCarrito.dataset.id);
          });
        }
      });

      if (typeof actualizarBotonesFavoritos === "function") {
        actualizarBotonesFavoritos();
      }
    }

    seccionProductos.hidden = true;
    seccionFavoritos.hidden = false;

    const separador = document.querySelector(".separador");
    if (separador) separador.hidden = true;

    seccionFavoritos.scrollIntoView({ behavior: "smooth" });
  });

  botonVolver.addEventListener("click", () => {
    seccionFavoritos.hidden = true;
    seccionProductos.hidden = false;

    const separador = document.querySelector(".separador");
    if (separador) separador.hidden = false;

    seccionProductos.scrollIntoView({ behavior: "smooth" });
  });
})();
/* NOVAGUET — Visor de imágenes de productos */
(() => {
  if (document.getElementById("novaguet-image-viewer")) return;

  const visor = document.createElement("div");
  visor.id = "novaguet-image-viewer";

  visor.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: rgba(0,0,0,.92);
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;

  visor.innerHTML = `
    <button type="button" aria-label="Cerrar imagen"
      data-cerrar-visor
      style="position:absolute;top:15px;right:18px;
      color:white;background:none;border:0;font-size:36px;
      cursor:pointer;">&times;</button>

    <button type="button" aria-label="Foto anterior"
      data-foto-anterior
      style="position:absolute;left:15px;top:50%;
      transform:translateY(-50%);color:white;
      background:rgba(0,0,0,.5);border:0;
      font-size:34px;padding:10px;cursor:pointer;">&#10094;</button>

    <img alt="Imagen ampliada del producto"
      style="max-width:85%;max-height:85vh;object-fit:contain;">

    <button type="button" aria-label="Foto siguiente"
      data-foto-siguiente
      style="position:absolute;right:15px;top:50%;
      transform:translateY(-50%);color:white;
      background:rgba(0,0,0,.5);border:0;
      font-size:34px;padding:10px;cursor:pointer;">&#10095;</button>
  `;

  document.body.appendChild(visor);

  const imagenGrande = visor.querySelector("img");
  const botonCerrar = visor.querySelector("[data-cerrar-visor]");
  const botonAnterior = visor.querySelector("[data-foto-anterior]");
  const botonSiguiente = visor.querySelector("[data-foto-siguiente]");

  let fotosVisor = [];
  let indiceFotoVisor = 0;

  function mostrarFotoVisor(indice) {
    if (!fotosVisor.length) return;

    indiceFotoVisor =
      (indice + fotosVisor.length) % fotosVisor.length;

    imagenGrande.src = fotosVisor[indiceFotoVisor];

    botonAnterior.style.display =
      fotosVisor.length > 1 ? "block" : "none";

    botonSiguiente.style.display =
      fotosVisor.length > 1 ? "block" : "none";
  }

  function cerrarVisor() {
    visor.style.display = "none";
    imagenGrande.src = "";
  }

  botonCerrar.addEventListener("click", cerrarVisor);

  botonAnterior.addEventListener("click", (evento) => {
    evento.stopPropagation();
    mostrarFotoVisor(indiceFotoVisor - 1);
  });

  botonSiguiente.addEventListener("click", (evento) => {
    evento.stopPropagation();
    mostrarFotoVisor(indiceFotoVisor + 1);
  });

  visor.addEventListener("click", (evento) => {
    if (evento.target === visor) cerrarVisor();
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") cerrarVisor();
  });

  document.addEventListener("click", (evento) => {
    const imagen = evento.target.closest(
      ".product-card .product-image"
    );

    if (!imagen || !imagen.src) return;

    evento.preventDefault();

    const tarjeta = imagen.closest(".product-card");
    if (!tarjeta) return;

    fotosVisor = [imagen.src];

    const imagenesExtra =
      tarjeta.querySelectorAll(".product-image-extra");

    imagenesExtra.forEach((foto) => {
      if (foto.src && !fotosVisor.includes(foto.src)) {
        fotosVisor.push(foto.src);
      }
    });

    mostrarFotoVisor(0);
    visor.style.display = "flex";
  });
})();