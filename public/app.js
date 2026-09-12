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

    const cartCount =
  document.getElementById("cartCount");

  const cartBox =
    document.getElementById("cartBox");

  const closeCart =
    document.getElementById("closeCart");

  const cartItems =
    document.getElementById("cartItems");

  const cartSubtotal =
    document.getElementById("cartSubtotal");

  const cartTotal =
    document.getElementById("cartTotal");

  const cartEmpty =
    document.getElementById("cartEmpty");

  const checkoutButton =
    document.getElementById("checkoutButton");


  /* =====================================================
     CHECKOUT
  ===================================================== */

  const checkoutContainer =
    document.getElementById("checkoutContainer");

  const stepCustomer =
    document.getElementById("stepCustomer");

  const stepDelivery =
    document.getElementById("stepDelivery");

  const stepPayment =
    document.getElementById("stepPayment");

  const stepSummary =
    document.getElementById("stepSummary");

  const stepResult =
    document.getElementById("stepResult");

  const confirmCustomerButton =
    document.getElementById("confirmCustomerButton");

  const continueDeliveryButton =
    document.getElementById("continueDeliveryButton");

  const continuePaymentButton =
    document.getElementById("continuePaymentButton");

  const confirmOrderButton =
    document.getElementById("confirmOrderButton");

  const orderSummary =
    document.getElementById("orderSummary");

  const paymentResult =
    document.getElementById("paymentResult");


  /* =====================================================
     CLIENTE
  ===================================================== */

  const customerName =
    document.getElementById("customerName");

  const customerPhone =
    document.getElementById("customerPhone");

  const customerAddress =
    document.getElementById("customerAddress");

  const customerCity =
    document.getElementById("customerCity");

  const deliveryReference =
    document.getElementById("deliveryReference");


  /* =====================================================
     ENTREGA
  ===================================================== */

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


  /* =====================================================
     PAGO
  ===================================================== */

  const transferPayment =
    document.getElementById("transferPayment");

  const cashPayment =
    document.getElementById("cashPayment");

  const bankBox =
    document.getElementById("bankBox");

  const bankSelect =
    document.getElementById("bank");


  /* =====================================================
     OTROS
  ===================================================== */

  const categoryButtons =
    document.querySelectorAll(".category-button");

  const nosotrosButton =
    document.getElementById("nosotrosButton");

  const nosotrosCloud =
    document.getElementById("nosotrosCloud");


  /* =====================================================
     VARIABLES
  ===================================================== */

  let productos = [];

  let carrito =
    JSON.parse(
      localStorage.getItem("novaguetCarrito")
    ) || [];


  /* =====================================================
     GUARDAR CARRITO
  ===================================================== */

  function guardarCarrito() {

    localStorage.setItem(
      "novaguetCarrito",
      JSON.stringify(carrito)
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
          total + producto.cantidad,
        0
      );

    cartCount.textContent = cantidad;

  }


  /* =====================================================
     CARGAR PRODUCTOS
  ===================================================== */

  async function cargarProductos() {

    try {

      const respuesta =
        await fetch("/api/productos");

      if (!respuesta.ok) {
        throw new Error(
          "No se pudieron cargar los productos"
        );
      }

      productos =
        await respuesta.json();

      mostrarProductos(productos);

      mostrarCarrito();

    } catch (error) {

      console.error(
        "Error cargando productos:",
        error
      );

      if (productsContainer) {

        productsContainer.innerHTML = `
          <p style="text-align:center;">
            No se pudieron cargar los productos.
          </p>
        `;

      }

    }

  }


  /* =====================================================
     MOSTRAR PRODUCTOS
  ===================================================== */

  function mostrarProductos(lista) {

    if (!productsContainer) return;

    productsContainer.innerHTML = "";


    if (!lista || lista.length === 0) {

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


      card.innerHTML = `

        <div class="product-image-container">

          <img
            src="${producto.imagen || "/images/logo.png"}"
            alt="${producto.nombre}"
            class="product-image"
          >

        </div>

        <div class="product-info">

          <h3>
            ${producto.nombre}
          </h3>

          <p class="product-price">
            HNL ${Number(producto.precio).toLocaleString("es-HN")}
          </p>

          ${
            producto.talla
              ? `
                <p class="product-size">
                  Talla: ${producto.talla}
                </p>
              `
              : ""
          }

          ${
            producto.categoria
              ? `
                <p class="product-category">
                  ${producto.categoria}
                </p>
              `
              : ""
          }

          <button
            class="add-to-cart"
            data-id="${producto.id}"
          >
            Agregar al carrito
          </button>

        </div>

      `;


      productsContainer.appendChild(card);

    });


    productsContainer
      .querySelectorAll(".add-to-cart")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(button.dataset.id);

            agregarAlCarrito(id);

          }
        );

      });

  }


  /* =====================================================
     BUSCAR
  ===================================================== */

  function realizarBusqueda() {

    if (!searchInput) return;

    const texto =
      searchInput.value
        .toLowerCase()
        .trim();


    if (!texto) {

      mostrarProductos(productos);

      return;

    }


    const resultados =
      productos.filter(producto => {

        const nombre =
          String(
            producto.nombre || ""
          ).toLowerCase();

        const categoria =
          String(
            producto.categoria || ""
          ).toLowerCase();

        const talla =
          String(
            producto.talla || ""
          ).toLowerCase();


        return (
          nombre.includes(texto) ||
          categoria.includes(texto) ||
          talla.includes(texto)
        );

      });


    mostrarProductos(resultados);

  }


  /* =====================================================
     BUSCADOR
  ===================================================== */

  if (searchButton && searchBox) {

    searchButton.addEventListener(
      "click",
      () => {

        searchBox.classList.add("show");

        if (searchInput) {
          searchInput.focus();
        }

      }
    );

  }


  if (closeSearch && searchBox) {

    closeSearch.addEventListener(
      "click",
      () => {

        searchBox.classList.remove("show");

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
      realizarBusqueda
    );

  }


  /* =====================================================
     AGREGAR AL CARRITO
  ===================================================== */

  function agregarAlCarrito(id) {

    const producto =
      productos.find(
        item =>
          Number(item.id) === Number(id)
      );


    if (!producto) return;


    const productoExistente =
      carrito.find(
        item =>
          Number(item.id) === Number(id)
      );


    if (productoExistente) {

      if (
        producto.stock !== undefined &&
        productoExistente.cantidad >= producto.stock
      ) {

        alert(
          "No hay más unidades disponibles de este producto."
        );

        return;

      }


      productoExistente.cantidad++;

    } else {

      carrito.push({

        id: producto.id,

        nombre: producto.nombre,

        precio: Number(producto.precio),

        imagen: producto.imagen,

        talla: producto.talla || "",

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


    if (carrito.length === 0) {

      if (cartEmpty) {
        cartEmpty.style.display = "block";
      }

      if (cartSubtotal) {
        cartSubtotal.textContent = "HNL 0";
      }

      if (cartTotal) {
        cartTotal.textContent = "HNL 0";
      }

      actualizarContadorCarrito();

      return;

    }


    if (cartEmpty) {
      cartEmpty.style.display = "none";
    }


    let subtotal = 0;


    carrito.forEach(producto => {

      const cantidad =
        Number(producto.cantidad) || 1;

      const precio =
        Number(producto.precio) || 0;

      subtotal +=
        precio * cantidad;


      const item =
        document.createElement("div");

      item.className =
        "cart-product";


      item.innerHTML = `

        <img
          src="${producto.imagen || "/images/logo.png"}"
          alt="${producto.nombre}"
          class="cart-product-image"
        >

        <div class="cart-product-info">

          <h4>
            ${producto.nombre}
          </h4>

          ${
            producto.talla
              ? `
                <small>
                  Talla: ${producto.talla}
                </small>
              `
              : ""
          }

          <p>
            HNL ${precio.toLocaleString("es-HN")}
          </p>

          <div class="cart-quantity">

            <button
              class="quantity-minus"
              data-id="${producto.id}">
              −
            </button>

            <span>
              ${cantidad}
            </span>

            <button
              class="quantity-plus"
              data-id="${producto.id}">
              +
            </button>

          </div>

          <button
            class="remove-product"
            data-id="${producto.id}">
            Eliminar
          </button>

        </div>

      `;


      cartItems.appendChild(item);

    });


    const totalFormateado =
      "HNL " +
      subtotal.toLocaleString("es-HN");


    if (cartSubtotal) {
      cartSubtotal.textContent =
        totalFormateado;
    }


    if (cartTotal) {
      cartTotal.textContent =
        totalFormateado;
    }


    actualizarContadorCarrito();


    /* AUMENTAR */

    cartItems
      .querySelectorAll(".quantity-plus")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(button.dataset.id);

            const producto =
              carrito.find(
                item =>
                  Number(item.id) === id
              );

            if (!producto) return;

            producto.cantidad++;

            guardarCarrito();

            mostrarCarrito();

          }
        );

      });


    /* DISMINUIR */

    cartItems
      .querySelectorAll(".quantity-minus")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(button.dataset.id);

            const producto =
              carrito.find(
                item =>
                  Number(item.id) === id
              );

            if (!producto) return;


            if (producto.cantidad > 1) {

              producto.cantidad--;

            } else {

              carrito =
                carrito.filter(
                  item =>
                    Number(item.id) !== id
                );

            }


            guardarCarrito();

            mostrarCarrito();

          }
        );

      });


    /* ELIMINAR */

    cartItems
      .querySelectorAll(".remove-product")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(button.dataset.id);

            carrito =
              carrito.filter(
                item =>
                  Number(item.id) !== id
              );

            guardarCarrito();

            mostrarCarrito();

          }
        );

      });

  }


  /* =====================================================
     ABRIR CARRITO
  ===================================================== */

  if (cartButton && cartBox) {

    cartButton.addEventListener(
      "click",
      () => {

        cartBox.classList.add("show");

        mostrarCarrito();

      }
    );

  }


  /* =====================================================
     CERRAR CARRITO
  ===================================================== */

  if (closeCart && cartBox) {

    closeCart.addEventListener(
      "click",
      () => {

        cartBox.classList.remove("show");

      }
    );

  }


  /* =====================================================
     MOSTRAR SOLO UN PASO
  ===================================================== */

  function mostrarPaso(paso) {

    const pasos = [
      stepCustomer,
      stepDelivery,
      stepPayment,
      stepSummary,
      stepResult
    ];


    pasos.forEach(step => {

      if (step) {
        step.style.display = "none";
      }

    });


    if (paso) {

      paso.style.display = "block";

      paso.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  }


  /* =====================================================
     REINICIAR CHECKOUT
  ===================================================== */

  function reiniciarCheckout() {

    if (checkoutContainer) {
      checkoutContainer.style.display = "none";
    }

    mostrarPaso(null);

  }


  /* =====================================================
     BOTÓN PAGAR
  ===================================================== */

  if (checkoutButton) {

    checkoutButton.addEventListener(
      "click",
      () => {

        if (carrito.length === 0) {

          alert(
            "Tu carrito está vacío."
          );

          return;

        }


        if (checkoutContainer) {
          checkoutContainer.style.display =
            "block";
        }


        mostrarPaso(stepCustomer);

      }
    );

  }


  /* =====================================================
     PASO 1
     CONFIRMAR INFORMACIÓN
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
            ? customerPhone.value.trim()
            : "";


        if (!nombre) {

          alert(
            "Escribe tu nombre completo."
          );

          customerName.focus();

          return;

        }


        if (!telefono) {

          alert(
            "Escribe tu número de teléfono."
          );

          customerPhone.focus();

          return;

        }


        mostrarPaso(stepDelivery);

      }
    );

  }


  /* =====================================================
     MÉTODO DE ENTREGA
  ===================================================== */

  if (homeDelivery) {

    homeDelivery.addEventListener(
      "change",
      () => {

        if (!homeDelivery.checked) return;


        if (departmentBox) {
          departmentBox.classList.add("show");
        }

        if (pickupBox) {
          pickupBox.classList.remove("show");
        }

      }
    );

  }


  if (storePickup) {

    storePickup.addEventListener(
      "change",
      () => {

        if (!storePickup.checked) return;


        if (departmentBox) {
          departmentBox.classList.remove("show");
        }

        if (pickupBox) {
          pickupBox.classList.add("show");
        }

      }
    );

  }


  /* =====================================================
     PASO 2
     CONTINUAR ENTREGA
  ===================================================== */

  if (continueDeliveryButton) {

    continueDeliveryButton.addEventListener(
      "click",
      () => {

        const deliveryRadio =
          document.querySelector(
            'input[name="deliveryMethod"]:checked'
          );


        if (!deliveryRadio) {

          alert(
            "Selecciona un método de entrega."
          );

          return;

        }


        if (
          deliveryRadio.value ===
          "delivery"
        ) {

          if (
            !departmentSelect ||
            !departmentSelect.value
          ) {

            alert(
              "Selecciona tu departamento."
            );

            departmentSelect.focus();

            return;

          }

        }


        mostrarPaso(stepPayment);

      }
    );

  }


  /* =====================================================
     FORMA DE PAGO
  ===================================================== */

  if (transferPayment) {

    transferPayment.addEventListener(
      "change",
      () => {

        if (!transferPayment.checked)
          return;


        if (bankBox) {
          bankBox.classList.add("show");
        }


        mostrarDatosTransferencia();

      }
    );

  }


  if (cashPayment) {

    cashPayment.addEventListener(
      "change",
      () => {

        if (!cashPayment.checked)
          return;


        if (bankBox) {
          bankBox.classList.remove("show");
        }


        if (bankSelect) {
          bankSelect.value = "";
        }


        const transferInfo =
          document.getElementById(
            "transferInfo"
          );


        if (transferInfo) {
          transferInfo.remove();
        }

      }
    );

  }


  /* =====================================================
     DATOS PARA REALIZAR LA TRANSFERENCIA
  ===================================================== */

  function mostrarDatosTransferencia() {

    if (!bankBox) return;


    let transferInfo =
      document.getElementById(
        "transferInfo"
      );


    if (!transferInfo) {

      transferInfo =
        document.createElement("div");

      transferInfo.id =
        "transferInfo";

      bankBox.appendChild(
        transferInfo
      );

    }


    transferInfo.innerHTML = `

      <div class="transfer-bank-card">

        <div class="transfer-title">
          🏦 DATOS PARA REALIZAR LA TRANSFERENCIA
        </div>

        <div id="bankAccountData">

          <p>
            Selecciona un banco para ver los datos de la cuenta.
          </p>

        </div>

        <button
          type="button"
          id="continueBankButton"
          class="checkout-button"
        >
          CONTINUAR
        </button>

      </div>

    `;


    actualizarDatosBanco();


    const continueBankButton =
      document.getElementById(
        "continueBankButton"
      );


    if (continueBankButton) {

      continueBankButton.addEventListener(
        "click",
        () => {

          if (
            !bankSelect ||
            !bankSelect.value
          ) {

            alert(
              "Selecciona un banco para continuar."
            );

            if (bankSelect) {
              bankSelect.focus();
            }

            return;

          }


          mostrarDatosTransferenciaCliente();

        }
      );

    }

  }


  /* =====================================================
     DATOS DE LAS CUENTAS
  ===================================================== */

  function actualizarDatosBanco() {

    const bankAccountData =
      document.getElementById(
        "bankAccountData"
      );


    if (
      !bankAccountData ||
      !bankSelect
    ) {
      return;
    }


    const banco =
      bankSelect.value;


    const cuentas = {

      atlantida: {

        banco:
          "Banco Atlántida",

        titular:
          "NOVAGUET",

        numero:
          "000000000000",

        tipo:
          "Cuenta de Ahorros"

      },


      ficohsa: {

        banco:
          "Ficohsa",

        titular:
          "NOVAGUET",

        numero:
          "111111111111",

        tipo:
          "Cuenta de Ahorros"

      },


      bac: {

        banco:
          "BAC Credomatic",

        titular:
          "NOVAGUET",

        numero:
          "222222222222",

        tipo:
          "Cuenta de Ahorros"

      }

    };


    if (
      !banco ||
      !cuentas[banco]
    ) {

      bankAccountData.innerHTML = `

        <p>
          Selecciona un banco para ver los datos de la cuenta.
        </p>

      `;

      return;

    }


    const cuenta =
      cuentas[banco];


    bankAccountData.innerHTML = `

      <div class="bank-data-row">

        <span>Banco</span>

        <strong>
          ${cuenta.banco}
        </strong>

      </div>


      <div class="bank-data-row">

        <span>Titular</span>

        <strong>
          ${cuenta.titular}
        </strong>

      </div>


      <div class="bank-account-number">

        <span>
          NÚMERO DE CUENTA
        </span>

        <strong>
          ${cuenta.numero}
        </strong>

      </div>


      <div class="bank-data-row">

        <span>Tipo de cuenta</span>

        <strong>
          ${cuenta.tipo}
        </strong>

      </div>


      <p class="transfer-instruction">
        💡 Realiza la transferencia por el monto total de tu pedido.
      </p>

    `;

  }


  /* =====================================================
     CAMBIO DE BANCO
  ===================================================== */

  if (bankSelect) {

    bankSelect.addEventListener(
      "change",
      () => {

        actualizarDatosBanco();

      }
    );

  }


  /* =====================================================
     DATOS DE TU TRANSFERENCIA
  ===================================================== */

  function mostrarDatosTransferenciaCliente() {

    const transferInfo =
      document.getElementById(
        "transferInfo"
      );


    if (!transferInfo) return;


    transferInfo.innerHTML = `

      <div class="transfer-client-card">

        <div class="transfer-title">
          🧾 DATOS DE TU TRANSFERENCIA
        </div>


        <label for="transferName">
          👤 Nombre de quien realizó la transferencia
        </label>

        <input
          type="text"
          id="transferName"
          placeholder="Nombre completo"
          autocomplete="name"
        >


        <label for="transferAmount">
          💰 Monto transferido
        </label>

        <input
          type="number"
          id="transferAmount"
          placeholder="Ejemplo: 700"
          min="0"
          step="0.01"
        >


        <label for="transferReference">
          🧾 Número de referencia
        </label>

        <input
          type="text"
          id="transferReference"
          placeholder="Escribe el número de referencia"
        >


        <button
          type="button"
          id="confirmTransferDataButton"
          class="checkout-button"
        >
          CONFIRMAR Y PAGAR
        </button>

      </div>

    `;


    const confirmTransferDataButton =
      document.getElementById(
        "confirmTransferDataButton"
      );


    if (confirmTransferDataButton) {

      confirmTransferDataButton.addEventListener(
        "click",
        () => {

          const transferName =
            document.getElementById(
              "transferName"
            );


          const transferAmount =
            document.getElementById(
              "transferAmount"
            );


          const transferReference =
            document.getElementById(
              "transferReference"
            );


          if (
            !transferName ||
            !transferName.value.trim()
          ) {

            alert(
              "Escribe el nombre de quien realizó la transferencia."
            );

            if (transferName) {
              transferName.focus();
            }

            return;

          }


          if (
            !transferAmount ||
            !transferAmount.value
          ) {

            alert(
              "Escribe el monto transferido."
            );

            if (transferAmount) {
              transferAmount.focus();
            }

            return;

          }


          if (
            Number(
              transferAmount.value
            ) <= 0
          ) {

            alert(
              "El monto transferido debe ser mayor que 0."
            );

            transferAmount.focus();

            return;

          }


          if (
            !transferReference ||
            !transferReference.value.trim()
          ) {

            alert(
              "Escribe el número de referencia de la transferencia."
            );

            if (transferReference) {
              transferReference.focus();
            }

            return;

          }


          mostrarResumen();

          mostrarPaso(stepSummary);

        }
      );

    }

  }


  /* =====================================================
     CONTINUAR PAGO
     EFECTIVO
  ===================================================== */

  if (continuePaymentButton) {

    continuePaymentButton.addEventListener(
      "click",
      () => {

        const paymentRadio =
          document.querySelector(
            'input[name="paymentMethod"]:checked'
          );


        if (!paymentRadio) {

          alert(
            "Selecciona una forma de pago."
          );

          return;

        }


        /*
         * TRANSFERENCIA
         *
         * El usuario continúa desde el botón
         * que aparece debajo de los datos bancarios.
         */

        if (
          paymentRadio.value ===
          "transfer"
        ) {

          if (
            !bankSelect ||
            !bankSelect.value
          ) {

            alert(
              "Selecciona el banco para realizar la transferencia."
            );

            if (bankSelect) {
              bankSelect.focus();
            }

            return;

          }


          mostrarDatosTransferencia();

          return;

        }


        /*
         * EFECTIVO
         */

        mostrarResumen();

        mostrarPaso(stepSummary);

      }
    );

  }


  /* =====================================================
     CREAR RESUMEN
  ===================================================== */

  function mostrarResumen() {

    if (!orderSummary) return;


    const deliveryRadio =
      document.querySelector(
        'input[name="deliveryMethod"]:checked'
      );


    const paymentRadio =
      document.querySelector(
        'input[name="paymentMethod"]:checked'
      );


    const nombre =
      customerName.value.trim();

    const telefono =
      customerPhone.value.trim();

    const direccion =
      customerAddress.value.trim();

    const ciudad =
      customerCity.value.trim();

    const referencia =
      deliveryReference.value.trim();


    let subtotal = 0;


    carrito.forEach(producto => {

      subtotal +=
        Number(producto.precio) *
        Number(producto.cantidad);

    });


    let entregaTexto = "";


    if (
      deliveryRadio &&
      deliveryRadio.value ===
      "delivery"
    ) {

      entregaTexto =
        `
        🚚 Envío a domicilio<br>
        🇭🇳 ${
          departmentSelect.options[
            departmentSelect.selectedIndex
          ].text
        }<br>
        🏙️ ${ciudad}<br>
        🏠 ${direccion}
        `;

    } else {

      entregaTexto =
        `
        🏪 Recoger en tienda<br>
        📍 Comayagua, Honduras
        `;

    }


    let pagoTexto = "";


    if (
      paymentRadio &&
      paymentRadio.value ===
      "transfer"
    ) {

      const transferName =
        document.getElementById(
          "transferName"
        )?.value.trim() || "";


      const transferAmount =
        document.getElementById(
          "transferAmount"
        )?.value || "";


      const transferReference =
        document.getElementById(
          "transferReference"
        )?.value.trim() || "";


      pagoTexto =
        `
        🏦 Transferencia bancaria<br>

        Banco:
        ${
          bankSelect.options[
            bankSelect.selectedIndex
          ].text
        }

        <br>

        👤 Transferencia realizada por:
        ${transferName}

        <br>

        💰 Monto transferido:
        HNL ${Number(
          transferAmount
        ).toLocaleString("es-HN")}

        <br>

        🧾 Referencia:
        ${transferReference}
        `;

    } else {

      pagoTexto =
        `
        💵 Pago en efectivo
        `;

    }


    let productosHTML = "";


    carrito.forEach(producto => {

      const cantidad =
        Number(producto.cantidad);

      const precio =
        Number(producto.precio);

      productosHTML += `

        <div style="margin-bottom:10px;">

          <strong>
            ${producto.nombre}
          </strong>

          <br>

          Cantidad:
          ${cantidad}

          <br>

          HNL
          ${(precio * cantidad)
            .toLocaleString("es-HN")}

        </div>

      `;

    });


    orderSummary.innerHTML = `

      <div style="margin-bottom:15px;">

        <strong>
          👤 Cliente
        </strong>

        <br>

        ${nombre}

        <br>

        📞 ${telefono}

      </div>


      ${
        deliveryRadio &&
        deliveryRadio.value ===
        "delivery"
          ? `
            <div style="margin-bottom:15px;">

              <strong>
                📍 Referencia
              </strong>

              <br>

              ${referencia || "No especificada"}

            </div>
          `
          : ""
      }


      <div style="margin-bottom:15px;">

        <strong>
          🚚 Entrega
        </strong>

        <br>

        ${entregaTexto}

      </div>


      <div style="margin-bottom:15px;">

        <strong>
          💳 Pago
        </strong>

        <br>

        ${pagoTexto}

      </div>


      <div style="margin-bottom:15px;">

        <strong>
          🛍️ Productos
        </strong>

        <br><br>

        ${productosHTML}

      </div>


      <div>

        <strong>
          TOTAL:
          HNL ${subtotal.toLocaleString("es-HN")}
        </strong>

      </div>

    `;

  }


  /* =====================================================
     CONFIRMAR PEDIDO
  ===================================================== */

  if (confirmOrderButton) {

    confirmOrderButton.addEventListener(
      "click",
      () => {

        try {

          if (carrito.length === 0) {

            mostrarResultadoError(
              "Tu carrito está vacío."
            );

            return;

          }


          const deliveryRadio =
            document.querySelector(
              'input[name="deliveryMethod"]:checked'
            );


          const paymentRadio =
            document.querySelector(
              'input[name="paymentMethod"]:checked'
            );


          if (!deliveryRadio) {

            mostrarResultadoError(
              "No se seleccionó un método de entrega."
            );

            return;

          }


          if (!paymentRadio) {

            mostrarResultadoError(
              "No se seleccionó una forma de pago."
            );

            return;

          }


          const deliveryMethod =
            deliveryRadio.value;


          const paymentMethod =
            paymentRadio.value;


          let bancoSeleccionado = "";


          if (
            paymentMethod ===
            "transfer" &&
            bankSelect
          ) {

            bancoSeleccionado =
              bankSelect.options[
                bankSelect.selectedIndex
              ]?.text || "";

          }


          const total =
            carrito.reduce(
              (suma, producto) =>
                suma +
                (
                  Number(producto.precio) *
                  Number(producto.cantidad)
                ),
              0
            );


          const numeroPedido =
            "NV-" +
            Date.now()
              .toString()
              .slice(-8);


          const pedido = {

            id: numeroPedido,

            fecha:
              new Date().toISOString(),


            cliente: {

              nombre:
                customerName.value.trim(),

              telefono:
                customerPhone.value.trim(),

              direccion:
                deliveryMethod ===
                "delivery"
                  ? customerAddress.value.trim()
                  : "",

              ciudad:
                deliveryMethod ===
                "delivery"
                  ? customerCity.value.trim()
                  : "",

              departamento:
                deliveryMethod ===
                "delivery" &&
                departmentSelect
                  ? departmentSelect.value
                  : "",

              referencia:
                deliveryMethod ===
                "delivery"
                  ? deliveryReference.value.trim()
                  : ""

            },


            entrega: {

              metodo:
                deliveryMethod ===
                "delivery"
                  ? "Envío a domicilio"
                  : "Recoger en tienda",

              puntoRecogida:
                deliveryMethod ===
                "pickup"
                  ? "Comayagua, Honduras"
                  : ""

            },


            pago: {

              metodo:
                paymentMethod ===
                "transfer"
                  ? "Transferencia bancaria"
                  : "Pago en efectivo",

              banco:
                bancoSeleccionado,

              nombreTransferencia:
                paymentMethod ===
                "transfer"
                  ? (
                      document.getElementById(
                        "transferName"
                      )?.value.trim() || ""
                    )
                  : "",

              montoTransferencia:
                paymentMethod ===
                "transfer"
                  ? Number(
                      document.getElementById(
                        "transferAmount"
                      )?.value || 0
                    )
                  : 0,

              referenciaTransferencia:
                paymentMethod ===
                "transfer"
                  ? (
                      document.getElementById(
                        "transferReference"
                      )?.value.trim() || ""
                    )
                  : ""

            },


            productos:
              carrito.map(producto => ({

                id:
                  producto.id,

                nombre:
                  producto.nombre,

                precio:
                  Number(producto.precio),

                cantidad:
                  Number(producto.cantidad),

                talla:
                  producto.talla || "",

                imagen:
                  producto.imagen || ""

              })),


            total

          };


          /* =============================================
             GUARDAR PEDIDO
          ============================================= */

          const pedidosGuardados =
            JSON.parse(
              localStorage.getItem(
                "novaguetPedidos"
              )
            ) || [];


          pedidosGuardados.push(
            pedido
          );


          localStorage.setItem(
            "novaguetPedidos",
            JSON.stringify(
              pedidosGuardados
            )
          );


          /* =============================================
             MOSTRAR ÉXITO
          ============================================= */

          mostrarResultadoExito(
            numeroPedido,
            paymentMethod
          );


          /* =============================================
             LIMPIAR CARRITO
          ============================================= */

          carrito = [];

          guardarCarrito();

          mostrarCarrito();

        } catch (error) {

          console.error(
            "Error procesando pedido:",
            error
          );

          mostrarResultadoError(
            "No pudimos procesar tu pedido. Intenta nuevamente."
          );

        }

      }
    );

  }


  /* =====================================================
     RESULTADO EXITOSO
  ===================================================== */

  function mostrarResultadoExito(
    numeroPedido,
    paymentMethod
  ) {

    if (!paymentResult) return;


    let mensajePago = "";


    if (
      paymentMethod ===
      "transfer"
    ) {

      mensajePago =
        `
        Tu pedido fue confirmado correctamente.
        <br>
        Hemos registrado la transferencia como forma de pago.
        `;

    } else {

      mensajePago =
        `
        Tu pedido fue confirmado correctamente.
        <br>
        El pago en efectivo quedó registrado.
        `;

    }


    paymentResult.innerHTML = `

      <div class="success-circle">

        <svg
          class="success-check"
          viewBox="0 0 52 52"
        >

          <circle
            class="success-circle-line"
            cx="26"
            cy="26"
            r="24"
          >
          </circle>

          <path
            class="success-check-line"
            d="M14 27 L22 35 L39 17"
          >
          </path>

        </svg>

      </div>


      <h2>
        Pedido confirmado ✅
      </h2>


      <p class="success-message">
        Gracias por comprar en
        <strong>NOVAGUET</strong>
      </p>


      <p class="success-order-number">
        Número de pedido:
        ${numeroPedido}
      </p>


      <p>
        ${mensajePago}
      </p>


      <button
        type="button"
        class="checkout-button"
        id="backToStoreButton"
      >

        VOLVER A LA TIENDA

      </button>

    `;


    mostrarPaso(stepResult);


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


          if (checkoutContainer) {
            checkoutContainer.style.display =
              "none";
          }


          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

        }
      );

    }

  }


  /* =====================================================
     RESULTADO ERROR
  ===================================================== */

  function mostrarResultadoError(
    mensaje
  ) {

    if (!paymentResult) return;


    paymentResult.innerHTML = `

      <div style="font-size:60px;">
        ❌
      </div>

      <h2>
        NO SE PUDO PROCESAR
      </h2>

      <p>
        ${mensaje}
      </p>

      <button
        type="button"
        class="checkout-button"
        id="retryCheckoutButton">

        INTENTAR NUEVAMENTE

      </button>

    `;


    mostrarPaso(stepResult);


    const retryButton =
      document.getElementById(
        "retryCheckoutButton"
      );


    if (retryButton) {

      retryButton.addEventListener(
        "click",
        () => {

          mostrarPaso(stepCustomer);

        }
      );

    }

  }


  /* =====================================================
     CATEGORÍAS
  ===================================================== */

  categoryButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const categoria =
          button.dataset.category;


        if (!categoria) {

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
              String(
                categoria
              ).toLowerCase()
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
     CERRAR NOSOTROS AL TOCAR OTRA PARTE
  ===================================================== */

  document.addEventListener("click", event => {

    if (
      nosotrosCloud &&
      nosotrosCloud.classList.contains("show") &&
      !event.target.closest(".nosotros-menu")
    ) {

      nosotrosCloud.classList.remove("show");

    }

  });


  /* =====================================================
     IDIOMA
  ===================================================== */

  window.changeLanguage =
    function(idioma) {

      document.documentElement
        .setAttribute(
          "lang",
          idioma
        );


      document
        .querySelectorAll(
          "[data-es][data-en]"
        )
        .forEach(elemento => {

          elemento.textContent =
            elemento.dataset[
              idioma
            ];

        });

    };


  /* =====================================================
     INICIALIZAR
  ===================================================== */

  actualizarContadorCarrito();

  mostrarCarrito();

  cargarProductos();

});