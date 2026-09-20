document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     ELEMENTOS
  ===================================================== */

  const productsContainer =
    document.getElementById("productsContainer");

  const searchButton =
    document.getElementById("searchButton");

  const searchBox =
    document.getElementById("searchBox");

  const searchInput =
    document.getElementById("searchInput");

  const closeSearch =
    document.getElementById("closeSearch");

  const cartButton =
    document.getElementById("cartButton");

  const cartBox =
    document.getElementById("cartBox");

  const closeCart =
    document.getElementById("closeCart");

  const cartItems =
    document.getElementById("cartItems");

  const cartEmpty =
    document.getElementById("cartEmpty");

  const cartCount =
    document.getElementById("cartCount");

  const cartSubtotal =
    document.getElementById("cartSubtotal");

  const cartTotal =
    document.getElementById("cartTotal");
const cartSummary =
    document.querySelector(".cart-summary");

const checkoutContainer =
    document.getElementById("checkoutContainer");

const stepCustomer =
    document.getElementById("stepCustomer");
  const promoCode =
    document.getElementById("promoCode");

  const applyPromo =
    document.getElementById("applyPromo");

  const checkoutButton =
    document.getElementById("checkoutButton");

  const checkoutBox =
    document.getElementById("checkoutBox");

  const closeCheckout =
    document.getElementById("closeCheckout");

  const customerName =
    document.getElementById("customerName");

  const customerPhone =
    document.getElementById("customerPhone");

  const deliveryReference =
    document.getElementById("deliveryReference");

  const confirmCustomerButton =
    document.getElementById("confirmCustomerButton");

  const homeDelivery =
    document.getElementById("homeDelivery");

  const storePickup =
    document.getElementById("storePickup");

  const departmentBox =
    document.getElementById("departmentBox");

  const pickupBox =
    document.getElementById("pickupBox");

  const departmentSelect =
    document.getElementById("department");

  const municipality =
    document.getElementById("municipality");
    
   const municipalityBox = 
     document.getElementById("municipalityBox");

  const continueDeliveryButton =
    document.getElementById("continueDeliveryButton");

  const transferPayment =
    document.getElementById("transferPayment");

  const cardPayment =
    document.getElementById("cardPayment");

  const cashPayment =
    document.getElementById("cashPayment");

const bank = document.getElementById("bank");

const bankDetails = document.getElementById("bankDetails");

const selectedBankName = document.getElementById("selectedBankName");

const selectedAccountNumber = document.getElementById("selectedAccountNumber");
if (bank) {

  bank.addEventListener("change", () => {

    const cuentas = {

      atlantida: {

        nombre: "Banco Atlántida",

        numero: "230000000"

      },

      ficohsa: {

        nombre: "Ficohsa",

        numero: "240000000"

      },

      bac: {

        nombre: "BAC Credomatic",

        numero: "250000000"

      }

    };

    const cuenta = cuentas[bank.value];

    if (!cuenta) {

      if (bankDetails) {

        bankDetails.style.display = "none";

      }

      return;

    }

    selectedBankName.textContent =

      cuenta.nombre;

    selectedAccountNumber.textContent =

      cuenta.numero;

    bankDetails.style.display = "block";

  });

}

  const continuePaymentButton =
    document.getElementById("continuePaymentButton");

  const orderSummary =
    document.getElementById("orderSummary");

  const confirmOrderButton =
    document.getElementById("confirmOrderButton");

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

  let deliveryMethod = "";

  let paymentMethod = "";

  let orderData = {};


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
        carrito = carritoParseado;
      }

    }

  } catch (error) {

    console.error(
      "Error cargando carrito:",
      error
    );

    carrito = [];

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
     FORMATO MONEDA
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
     ACTUALIZAR CONTADOR
  ===================================================== */

  function actualizarContadorCarrito() {

    if (!cartCount) return;

    const cantidad =
      carrito.reduce(
        (total, producto) =>
          total + Number(producto.cantidad || 0),
        0
      );

    cartCount.textContent = cantidad;

  }


  /* =====================================================
     CARGAR PRODUCTOS
  ===================================================== */

  async function cargarProductos() {

    if (!productsContainer) {
      console.error(
        "No existe #productsContainer"
      );
      return;
    }

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
          "La respuesta de productos no es un arreglo."
        );

      }

      productos = datos;

      /* =========================================
         LIMPIAR PRODUCTOS QUE YA NO EXISTEN
      ========================================= */

      carrito = carrito.filter(item => {

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
          item.cantidad > stock
        ) {
          item.cantidad = stock;
        }

        return true;

      });

      guardarCarrito();

      mostrarProductos(productos);

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

      card.className = "product-card";

      const imagen =
        producto.imagen ||
        "";

      const nombre =
        producto.nombre ||
        "Producto";

      const precio =
        Number(producto.precio) || 0;

      const categoria =
        producto.categoria ||
        "";

      const talla =
        producto.talla ||
        "";

      const descripcion =
        producto.descripcion ||
        "";

      const stock =
        Number(producto.stock);

      let opcionesTalla = "";

      if (talla) {

        opcionesTalla = `
          <div class="product-size">
            <span>Talla:</span>
            <strong>${talla}</strong>
          </div>
        `;

      }

      const agotado =
        Number.isFinite(stock) &&
        stock <= 0;

      card.innerHTML = `

        <div class="product-image-container">

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
              `
              : ""
          }

        </div>

        <div class="product-info">

          <h3>${nombre}</h3>

          ${
            categoria
              ? `<p class="product-category">${categoria}</p>`
              : ""
          }

          ${
            descripcion
              ? `<p class="product-description">${descripcion}</p>`
              : ""
          }

          ${opcionesTalla}

          <div class="product-price">
            ${formatoPrecio(precio)}
          </div>

          ${
            Number.isFinite(stock)
              ? `
              <div class="product-stock">
  ${stock <= 0 ? "Agotado" : ""}
      </div>
              `
              : ""
          }

          <button
            type="button"
            class="add-to-cart"
            data-id="${producto.id}"
            ${
              agotado
                ? "disabled"
                : ""
            }
          >
            ${
              agotado
                ? "AGOTADO"
                : "Agregar al carrito"
            }
          </button>

        </div>

      `;

      productsContainer.appendChild(card);

    });

    /* =========================================
       BOTONES AGREGAR
    ========================================= */

    const botones =
      productsContainer.querySelectorAll(
        ".add-to-cart"
      );

    botones.forEach(boton => {

      boton.addEventListener(
        "click",
        () => {

          const id =
            boton.dataset.id;

          agregarAlCarrito(id);

        }
      );

    });

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

    if (!producto) {

      console.error(
        "Producto no encontrado:",
        id
      );

      return;

    }

    const stock =
      Number(producto.stock);

    if (
      Number.isFinite(stock) &&
      stock <= 0
    ) {

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

      if (
        Number.isFinite(stock) &&
        existente.cantidad >= stock
      ) {

        alert(
          "No hay más unidades disponibles de este producto."
        );

        return;

      }

      existente.cantidad += 1;

    } else {

      carrito.push({

        id: producto.id,

        nombre:
          producto.nombre,

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
        cartEmpty.style.display = "block";
      }

      actualizarTotales();

      actualizarContadorCarrito();

      return;

    }

    if (cartEmpty) {
      cartEmpty.style.display = "none";
    }

    carrito.forEach(item => {

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


    /* =========================================
       MENOS
    ========================================= */

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


    /* =========================================
       MÁS
    ========================================= */

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


    /* =========================================
       ELIMINAR
    ========================================= */

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
      Number(item.cantidad) +
      Number(cambio);

    if (nuevaCantidad <= 0) {

      eliminarDelCarrito(id);

      return;

    }

    if (
      Number.isFinite(stock) &&
      nuevaCantidad > stock
    ) {

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
     ELIMINAR PRODUCTO
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
     TOTALES
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

          actualizarTotales();

          alert(
            "Ingresa un código promocional."
          );

          return;

        }

        /*
          Mantener aquí los códigos
          promocionales que ya tengas.
        */

        if (codigo === "NOVAGUET10") {

          const subtotal =
            calcularSubtotal();

          descuentoPromocional =
            subtotal * 0.10;

          actualizarTotales();

          alert(
            "Código aplicado correctamente."
          );

        } else {

          descuentoPromocional = 0;

          actualizarTotales();

          alert(
            "Código promocional no válido."
          );

        }

      }
    );

  }
  /* =====================================================
     CARRITO ABRIR / CERRAR
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
     BÚSQUEDA
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
            () => {
              searchInput.focus();
            },
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

          mostrarProductos(
            productos
          );

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

          mostrarProductos(
            productos
          );

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


  /* =====================================================
     CERRAR NOSOTROS AL HACER CLICK FUERA
  ===================================================== */

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
/* =====================================================
   CHECKOUT - ABRIR
===================================================== */

if (checkoutButton) {

  checkoutButton.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      if (carrito.length === 0) {

        alert(
          "Tu carrito está vacío."
        );

        return;

      }

      /* =========================================
         MANTENER ABIERTO EL CARRITO
      ========================================= */

      if (cartBox) {

        cartBox.classList.add(
          "show"
        );

      }

      /* =========================================
         OCULTAR CONTENIDO DEL CARRITO
      ========================================= */

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

      /* =========================================
         MOSTRAR CHECKOUT
      ========================================= */

      if (checkoutContainer) {

        checkoutContainer.style.display =
          "block";

      }

      /* =========================================
         MOSTRAR PRIMER PASO
      ========================================= */

      if (stepCustomer) {

        stepCustomer.style.display =
          "block";

      }

      /* =========================================
         OCULTAR LOS DEMÁS PASOS
      ========================================= */

      document
        .querySelectorAll(
          ".checkout-step"
        )
        .forEach(
          paso => {

            if (
              paso !== stepCustomer
            ) {

              paso.style.display =
                "none";

            }

          }
        );

      /* =========================================
         OCULTAR RESULTADO ANTERIOR
      ========================================= */

      const stepResult =
        document.getElementById(
          "stepResult"
        );

      if (stepResult) {

        stepResult.style.display =
          "none";

      }

      if (paymentResult) {

        paymentResult.style.display =
          "none";

      }

      /* =========================================
         REINICIAR DATOS DEL CHECKOUT
      ========================================= */

      deliveryMethod = "";

      paymentMethod = "";

      orderData = {};

    }
  );

}

  /* =====================================================
     CHECKOUT - CERRAR
  ===================================================== */

  if (closeCheckout) {

  closeCheckout.addEventListener(

    "click",

    (event) => {

      event.preventDefault();

      if (checkoutContainer) {

        checkoutContainer.style.display =

          "none";

      }

      if (cartItems) {

        cartItems.style.display =

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
            ? customerPhone.value
                .replace(/\D/g, "")
            : "";

        if (!nombre) {

          alert(
            "Ingresa tu nombre."
          );

          return;

        }

        if (
          telefono.length !== 8
        ) {

          alert(
            "Ingresa un número de teléfono válido de Honduras de 8 dígitos."
          );

          return;

        }

        orderData.nombre =
          nombre;

        orderData.telefono =
          telefono;

        avanzarCheckout(
          "customer",
          "delivery"
        );

      }
    );

  }


  /* =====================================================
     ENTREGA
  ===================================================== */

  if (homeDelivery) {

    homeDelivery.addEventListener(
      "change",
      () => {

        if (
          !homeDelivery.checked
        ) return;

        deliveryMethod =
          "delivery";

        if (departmentBox) {
          departmentBox.style.display =
            "block";
        }

        if (pickupBox) {
          pickupBox.style.display =
            "none";
        }

      }
    );

  }


  if (storePickup) {

    storePickup.addEventListener(
      "change",
      () => {

        if (
          !storePickup.checked
        ) return;

        deliveryMethod =
          "pickup";

        if (departmentBox) {
          departmentBox.style.display =
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

    "Islas de la Bahía": [
      "Roatán",
      "Guanaja",
      "José Santos Guardiola",
      "Utila"
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

if (departmentSelect) {

  departmentSelect.addEventListener("change", () => {

    if (!municipality) return;

    // Mostrar el cuadro de municipio

    if (municipalityBox) {

      municipalityBox.style.display = "block";

    }

    // Limpiar municipios anteriores

    municipality.innerHTML = `

      <option value="">

        Selecciona un municipio

      </option>

    `;

    const departamento = departmentSelect.value;

    const equivalenciasDepartamentos = {

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

    const claveDepartamento =

      equivalenciasDepartamentos[departamento];

    const municipios =

      municipiosHonduras[claveDepartamento] || [];

    municipios.forEach(nombreMunicipio => {

      const option = document.createElement("option");

      option.value = nombreMunicipio;

      option.textContent = nombreMunicipio;

      municipality.appendChild(option);

    });

  });

}
  

  /* =====================================================
     CONTINUAR ENTREGA
  ===================================================== */

  if (continueDeliveryButton) {

    continueDeliveryButton.addEventListener(
      "click",
      () => {

        if (!deliveryMethod) {

          alert(
            "Selecciona un método de entrega."
          );

          return;

        }

        if (
          deliveryMethod ===
          "delivery"
        ) {

          if (
            !departmentSelect ||
            !departmentSelect.value
          ) {

            alert(
              "Selecciona tu departamento."
            );

            return;

          }

          if (
            !municipality ||
            !municipality.value
          ) {

            alert(
              "Selecciona tu municipio."
            );

            return;

          }

          if (
            !deliveryReference ||
            !deliveryReference.value.trim()
          ) {

            alert(
              "Ingresa una referencia de entrega."
            );

            return;

          }

          orderData.departamento =
            departmentSelect.value;

          orderData.municipio =
            municipality.value;

          orderData.referencia =
            deliveryReference.value.trim();

        } else {

          orderData.departamento =
            "";

          orderData.municipio =
            "";

          orderData.referencia =
            "";

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
     MÉTODO DE PAGO
  ===================================================== */

  function obtenerMetodoPago() {

    if (
      transferPayment &&
      transferPayment.checked
    ) {

      return "transferencia";

    }

    if (
      cardPayment &&
      cardPayment.checked
    ) {

      return "tarjeta";

    }

    if (
      cashPayment &&
      cashPayment.checked
    ) {

      return "efectivo";

    }

    return "";

  }


  /* =====================================================
     MOSTRAR CAMPOS DE PAGO
  ===================================================== */

  function actualizarPago() {

    paymentMethod =
      obtenerMetodoPago();

    const transferBox =
      document.getElementById(
        "transferBox"
      );

    const cardBox =
      document.getElementById(
        "cardBox"
      );

    const cashBox =
      document.getElementById(
        "cashBox"
      );

    if (transferBox) {

      transferBox.style.display =
        paymentMethod ===
        "transferencia"
          ? "block"
          : "none";

    }

    if (cardBox) {

      cardBox.style.display =
        paymentMethod ===
        "tarjeta"
          ? "block"
          : "none";

    }

    if (cashBox) {

      cashBox.style.display =
        paymentMethod ===
        "efectivo"
          ? "block"
          : "none";

    }

  }


  if (transferPayment) {

    transferPayment.addEventListener(
      "change",
      actualizarPago
    );

  }

  if (cardPayment) {

    cardPayment.addEventListener(
      "change",
      actualizarPago
    );

  }

  if (cashPayment) {

    cashPayment.addEventListener(
      "change",
      actualizarPago
    );

  }


  /* =====================================================
     CONTINUAR PAGO
  ===================================================== */

  if (continuePaymentButton) {

    continuePaymentButton.addEventListener(
      "click",
      () => {

        paymentMethod =
          obtenerMetodoPago();

        if (!paymentMethod) {

          alert(
            "Selecciona una forma de pago."
          );

          return;

        }


        /* =========================================
           TRANSFERENCIA
        ========================================= */

        if (
          paymentMethod ===
          "transferencia"
        ) {

          if (
            bank &&
            !bank.value
          ) {

            alert(
              "Selecciona el banco."
            );

            return;

          }

        }


        /* =========================================
           TARJETA
        ========================================= */

        if (
          paymentMethod ===
          "tarjeta"
        ) {

          const cardName =
            document.getElementById(
              "cardName"
            );

          const cardNumber =
            document.getElementById(
              "cardNumber"
            );

          const cardExpiry =
            document.getElementById(
              "cardExpiry"
            );

          const cardCVV =
            document.getElementById(
              "cardCVV"
            );

          if (
            !cardName ||
            !cardName.value.trim()
          ) {

            alert(
              "Ingresa el nombre de la tarjeta."
            );

            return;

          }

          if (
            !cardNumber ||
            cardNumber.value
              .replace(/\D/g, "")
              .length < 13
          ) {

            alert(
              "Ingresa un número de tarjeta válido."
            );

            return;

          }

          if (
            !cardExpiry ||
            !cardExpiry.value.trim()
          ) {

            alert(
              "Ingresa la fecha de vencimiento."
            );

            return;

          }

          if (
            !cardCVV ||
            cardCVV.value
              .replace(/\D/g, "")
              .length < 3
          ) {

            alert(
              "Ingresa el CVV."
            );

            return;

          }

        }


        orderData.metodoPago =
          paymentMethod;

        if (
          paymentMethod ===
          "transferencia"
        ) {

          orderData.banco =
            bank
              ? bank.value
              : "";

        } else {

          orderData.banco = "";

        }

        mostrarResumen();

        avanzarCheckout(
          "payment",
          "summary"
        );

      }
    );

  }


  /* =====================================================
     AVANZAR CHECKOUT
  ===================================================== */

  function avanzarCheckout(
    actual,
    siguiente
  ) {

    const pasos =
      document.querySelectorAll(
        ".checkout-step"
      );

    pasos.forEach(
      paso => {

        const id =
          paso.id || "";

        if (
          id.toLowerCase()
            .includes(
              siguiente.toLowerCase()
            )
        ) {

          paso.style.display =
            "block";

        } else if (
          id.toLowerCase()
            .includes(
              actual.toLowerCase()
            )
        ) {

          paso.style.display =
            "none";

        }

      }
    );

    /* =========================================
       COMPATIBILIDAD CON CLASES
    ========================================= */

    document
      .querySelectorAll(
        "[data-step]"
      )
      .forEach(
        elemento => {

          const step =
            elemento.dataset.step;

          if (
            step === siguiente
          ) {

            elemento.style.display =
              "block";

          } else if (
            step === actual
          ) {

            elemento.style.display =
              "none";

          }

        }
      );

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
        Number(
          descuentoPromocional
        ) || 0,
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


    carrito.forEach(
      item => {

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
              ${item.nombre}
              × ${item.cantidad}
            </span>

            <strong>
              ${formatoPrecio(importe)}
            </strong>

          </div>

        `;

      }
    );


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

      </div>

      <div class="summary-section">

        <h3>
          Entrega
        </h3>

        <p>
          ${
            orderData.metodoEntrega ===
            "delivery"
              ? "Entrega a domicilio"
              : "Recoger en tienda"
          }
        </p>

    `;


    if (
      orderData.metodoEntrega ===
      "delivery"
    ) {

      html += `

        <p>
          <strong>Departamento:</strong>
          ${orderData.departamento || ""}
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

    }


    html += `

      </div>

      <div class="summary-section">

        <h3>
          Pago
        </h3>

        <p>
          ${
            orderData.metodoPago ===
            "transferencia"
              ? "Transferencia bancaria"
              : orderData.metodoPago ===
                "tarjeta"
                ? "Tarjeta"
                : "Efectivo"
          }
        </p>

      </div>

      <div class="summary-total">

        <p>
          <span>Subtotal:</span>
          <strong>
            ${formatoPrecio(subtotal)}
          </strong>
        </p>

    `;


    if (descuento > 0) {

      html += `

        <p>
          <span>Descuento:</span>
          <strong>
            -${formatoPrecio(descuento)}
          </strong>
        </p>

      `;

    }


    html += `

        <p class="total-final">

          <span>Total:</span>

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

          alert(
            "Tu carrito está vacío."
          );

          return;

        }

        const subtotal =
          calcularSubtotal();

        const descuento =
          Math.min(
            Number(
              descuentoPromocional
            ) || 0,
            subtotal
          );

        const total =
          Math.max(
            0,
            subtotal - descuento
          );


        const pedido = {

          cliente: {

            nombre:
              orderData.nombre || "",

            telefono:
              orderData.telefono || ""

          },

          productos:
            carrito.map(
              item => ({

                id: item.id,

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
              orderData.referencia || ""

          },

          pago: {

            metodo:
              orderData.metodoPago || "",

            banco:
              orderData.banco || ""

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


        try {

          confirmOrderButton.disabled =
            true;

          confirmOrderButton.textContent =
            "PROCESANDO...";


          const respuesta =
            await fetch(
              "/api/pedidos",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body:
                  JSON.stringify(pedido)

              }
            );


          const resultado =
            await respuesta.json()
              .catch(
                () => ({})
              );


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

          guardarCarrito();

          actualizarContadorCarrito();

          mostrarCarrito();
          if (checkoutContainer) {
  checkoutContainer.style.display = "none";
}

if (cartBox) {
  cartBox.classList.remove("show");
}


          if (paymentResult) {

            paymentResult.innerHTML = `

              <div class="payment-success">

                <h2>
                  ✅ Pedido recibido
                </h2>

                <p>
                  Gracias por comprar en NOVAGUET.
                </p>

                <p>
                  Tu pedido fue registrado correctamente.
                </p>

              </div>

            `;

            paymentResult.style.display =
              "block";

          }


          if (orderSummary) {

            orderSummary.style.display =
              "none";

          }


          confirmOrderButton.style.display =
            "none";


        } catch (error) {

          console.error(
            "Error creando pedido:",
            error
          );

          alert(
            error.message ||
            "No se pudo procesar el pedido."
          );


        } finally {

          confirmOrderButton.disabled =
            false;

          confirmOrderButton.textContent =
            "CONFIRMAR PEDIDO";

        }

      }
    );

  }


  /* =====================================================
     INICIALIZAR
  ===================================================== */

  actualizarContadorCarrito();

  mostrarCarrito();

  actualizarPago();

  cargarProductos();

});