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
    const promoCode =
  document.getElementById("promoCode");

const applyPromo =
  document.getElementById("applyPromo");

const promoMessage =
  document.getElementById("promoMessage");

let descuentoPromocional = 0;
let codigoPromocionalAplicado = "";

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
     CONTADOR DEL CARRITO
  ===================================================== */

  function actualizarContadorCarrito() {

    if (!cartCount) return;

    const cantidad =
      carrito.reduce(
        (total, producto) =>
          total +
          (Number(producto.cantidad) || 0),
        0
      );

    cartCount.textContent = cantidad;

  }


  /* =====================================================
     OBTENER TALLAS
  ===================================================== */

  function obtenerTallas(producto) {

    if (
      Array.isArray(producto.tallas) &&
      producto.tallas.length > 0
    ) {

      return producto.tallas
        .map(talla => String(talla))
        .filter(talla => talla.trim() !== "");

    }


    if (producto.talla) {

      return [
        String(producto.talla)
      ];

    }


    return [];

  }


  /* =====================================================
     OBTENER STOCK
  ===================================================== */

  function obtenerStock(
    producto,
    talla = ""
  ) {

    /*
     * Si existe stock por talla:
     *
     * stockPorTalla: {
     *   "2T": 2,
     *   "3T": 4,
     *   "4T": 3
     * }
     */

    if (
      producto &&
      producto.stockPorTalla &&
      typeof producto.stockPorTalla === "object"
    ) {

      const stockTalla =
        producto.stockPorTalla[talla];

      if (
        stockTalla !== undefined &&
        stockTalla !== null
      ) {

        return Number(stockTalla);

      }

    }


    /*
     * Si no hay stock por talla,
     * usamos el stock general.
     */

    if (
      producto &&
      producto.stock !== undefined &&
      producto.stock !== null
    ) {

      return Number(producto.stock);

    }


    /*
     * Si el producto no tiene stock
     * definido, no limitamos.
     */

    return Infinity;

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


      /*
       * Actualizar stock guardado en el carrito
       * con la información actual del servidor.
       */

      carrito =
        carrito.filter(item => {

          const productoActual =
            productos.find(
              producto =>
                Number(producto.id) ===
                Number(item.id)
            );

          return !!productoActual;

        });


      carrito.forEach(item => {

        const productoActual =
          productos.find(
            producto =>
              Number(producto.id) ===
              Number(item.id)
          );


        if (!productoActual) return;


        const stockActual =
          obtenerStock(
            productoActual,
            item.talla || ""
          );


        if (
          stockActual !== Infinity &&
          Number(item.cantidad) > stockActual
        ) {

          item.cantidad =
            Math.max(
              0,
              stockActual
            );

        }

      });


      carrito =
        carrito.filter(
          item =>
            Number(item.cantidad) > 0
        );


      guardarCarrito();

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


    if (
      !lista ||
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


      const tallas =
        obtenerTallas(producto);


      const tallaInicial =
        tallas.length > 0
          ? tallas[0]
          : "";


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
            tallas.length > 0
              ? `

                <div class="product-size-selector">

                  <span class="product-size-title">
                    Talla:
                  </span>


                  <div class="size-options">

                    ${
                      tallas
                        .map(
                          (talla, index) => `

                            <button
                              type="button"
                              class="size-option ${
                                index === 0
                                  ? "selected"
                                  : ""
                              }"
                              data-size="${talla}"
                            >
                              ${talla}
                            </button>

                          `
                        )
                        .join("")
                    }

                  </div>

                </div>

              `
              : ""
          }


          <button
            class="add-to-cart"
            data-id="${producto.id}"
            type="button"
          >
            Agregar al carrito
          </button>

        </div>

      `;


      productsContainer.appendChild(card);


      /* =================================================
         SELECCIÓN DE TALLA
      ================================================= */

      const sizeButtons =
        card.querySelectorAll(
          ".size-option"
        );


      let tallaSeleccionada =
        tallaInicial;


      sizeButtons.forEach(
        sizeButton => {

          sizeButton.addEventListener(
            "click",
            () => {

              sizeButtons.forEach(
                button => {

                  button.classList.remove(
                    "selected"
                  );

                }
              );


              sizeButton.classList.add(
                "selected"
              );


              tallaSeleccionada =
                sizeButton.dataset.size;

            }
          );

        }
      );


      /* =================================================
         BOTÓN AGREGAR
      ================================================= */

      const addButton =
        card.querySelector(
          ".add-to-cart"
        );


      if (addButton) {

        addButton.addEventListener(
          "click",
          () => {

            const id =
              Number(
                addButton.dataset.id
              );


            agregarAlCarrito(
              id,
              tallaSeleccionada
            );

          }
        );

      }

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


          const talla =
            obtenerTallas(producto)
              .join(" ")
              .toLowerCase();


          return (
            nombre.includes(texto) ||
            categoria.includes(texto) ||
            talla.includes(texto)
          );

        }
      );


    mostrarProductos(
      resultados
    );

  }


  /* =====================================================
     BUSCADOR
  ===================================================== */

  if (
    searchButton &&
    searchBox
  ) {

    searchButton.addEventListener(
      "click",
      () => {

        searchBox.classList.add(
          "show"
        );


        if (searchInput) {

          searchInput.focus();

        }

      }
    );

  }


  if (
    closeSearch &&
    searchBox
  ) {

    closeSearch.addEventListener(
      "click",
      () => {

        searchBox.classList.remove(
          "show"
        );


        if (searchInput) {

          searchInput.value = "";

        }


        mostrarProductos(
          productos
        );

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

  function agregarAlCarrito(
    id,
    tallaSeleccionada = ""
  ) {

    const producto =
      productos.find(
        item =>
          Number(item.id) ===
          Number(id)
      );


    if (!producto) return;


    const tallas =
      obtenerTallas(producto);


    /*
     * Si solo existe una talla,
     * la seleccionamos automáticamente.
     */

    if (
      !tallaSeleccionada &&
      tallas.length === 1
    ) {

      tallaSeleccionada =
        tallas[0];

    }


    /*
     * Si existen varias tallas
     * pero no hay una seleccionada.
     */

    if (
      tallas.length > 1 &&
      !tallaSeleccionada
    ) {

      alert(
        "Selecciona una talla antes de agregar el producto."
      );

      return;

    }


    const stockDisponible =
      obtenerStock(
        producto,
        tallaSeleccionada
      );


    const productoExistente =
      carrito.find(
        item =>
          Number(item.id) ===
            Number(id) &&
          String(item.talla || "") ===
            String(tallaSeleccionada || "")
      );


    if (productoExistente) {

      if (
        stockDisponible !== Infinity &&
        Number(productoExistente.cantidad) >=
          stockDisponible
      ) {

        alert(
          "No hay más unidades disponibles de esta talla."
        );

        return;

      }


      productoExistente.cantidad++;

    } else {

      /*
       * Si ya no hay stock.
       */

      if (
        stockDisponible !== Infinity &&
        stockDisponible <= 0
      ) {

        alert(
          "Esta talla no está disponible."
        );

        return;

      }


      carrito.push({

        id:
          producto.id,

        nombre:
          producto.nombre,

        precio:
          Number(producto.precio),

        imagen:
          producto.imagen,

        talla:
          tallaSeleccionada,

        categoria:
          producto.categoria || "",

        cantidad:
          1,

        stock:
          stockDisponible !== Infinity
            ? stockDisponible
            : undefined

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
      carrito.length === 0
    ) {

      if (cartEmpty) {

        cartEmpty.style.display =
          "block";

      }


      if (cartSubtotal) {

        cartSubtotal.textContent =
          "HNL 0";

      }


      if (cartTotal) {

        cartTotal.textContent =
          "HNL 0";

      }


      actualizarContadorCarrito();

      return;

    }


    if (cartEmpty) {

      cartEmpty.style.display =
        "none";

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
        document.createElement(
          "div"
        );


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
              data-id="${producto.id}"
              data-talla="${producto.talla || ""}"
              type="button"
            >
              −
            </button>


            <span>
              ${cantidad}
            </span>


            <button
              class="quantity-plus"
              data-id="${producto.id}"
              data-talla="${producto.talla || ""}"
              type="button"
            >
              +
            </button>

          </div>


          <button
            class="remove-product"
            data-id="${producto.id}"
            data-talla="${producto.talla || ""}"
            type="button"
          >
            Eliminar
          </button>

        </div>

      `;


      cartItems.appendChild(
        item
      );

    });

const descuento =
  subtotal * descuentoPromocional;

const totalConDescuento =
  subtotal - descuento;

const totalFormateado =
  "HNL " +
  totalConDescuento.toLocaleString(
    "es-HN"
  );

if (cartSubtotal) {

  cartSubtotal.textContent =
    "HNL " +
    subtotal.toLocaleString("es-HN");

}

if (cartTotal) {

  cartTotal.textContent =
    totalFormateado;

}

    actualizarContadorCarrito();


    /* =================================================
       AUMENTAR
    ================================================= */

    cartItems
      .querySelectorAll(
        ".quantity-plus"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(
                button.dataset.id
              );


            const talla =
              String(
                button.dataset.talla || ""
              );


            const producto =
              carrito.find(
                item =>
                  Number(item.id) ===
                    id &&
                  String(
                    item.talla || ""
                  ) === talla
              );


            if (!producto) return;


            /*
             * Buscamos el producto actual
             * en el servidor.
             */

            const productoActual =
              productos.find(
                item =>
                  Number(item.id) ===
                  id
              );


            let stockDisponible =
              producto.stock;


            if (productoActual) {

              stockDisponible =
                obtenerStock(
                  productoActual,
                  talla
                );

            }


            if (
              stockDisponible !== undefined &&
              stockDisponible !== null &&
              stockDisponible !== Infinity &&
              Number(producto.cantidad) >=
                Number(stockDisponible)
            ) {

              alert(
                "No hay más unidades disponibles de esta talla."
              );

              return;

            }


            producto.cantidad++;


            guardarCarrito();

            mostrarCarrito();

          }
        );

      });


    /* =================================================
       DISMINUIR
    ================================================= */

    cartItems
      .querySelectorAll(
        ".quantity-minus"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(
                button.dataset.id
              );


            const talla =
              String(
                button.dataset.talla || ""
              );


            const producto =
              carrito.find(
                item =>
                  Number(item.id) ===
                    id &&
                  String(
                    item.talla || ""
                  ) === talla
              );


            if (!producto) return;


            if (
              Number(producto.cantidad) >
              1
            ) {

              producto.cantidad--;

            } else {

              carrito =
                carrito.filter(
                  item =>
                    !(
                      Number(item.id) ===
                        id &&
                      String(
                        item.talla || ""
                      ) === talla
                    )
                );

            }


            guardarCarrito();

            mostrarCarrito();

          }
        );

      });


    /* =================================================
       ELIMINAR
    ================================================= */

    cartItems
      .querySelectorAll(
        ".remove-product"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(
                button.dataset.id
              );


            const talla =
              String(
                button.dataset.talla || ""
              );


            carrito =
              carrito.filter(
                item =>
                  !(
                    Number(item.id) ===
                      id &&
                    String(
                      item.talla || ""
                    ) === talla
                  )
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

  if (
    cartButton &&
    cartBox
  ) {

    cartButton.addEventListener(
      "click",
      () => {

        cartBox.classList.add(
          "show"
        );


        mostrarCarrito();

      }
    );

  }


  /* =====================================================
     CERRAR CARRITO
  ===================================================== */

  if (
    closeCart &&
    cartBox
  ) {

    closeCart.addEventListener(
      "click",
      () => {

        cartBox.classList.remove(
          "show"
        );

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


    pasos.forEach(
      step => {

        if (step) {

          step.style.display =
            "none";

        }

      }
    );


    if (paso) {

      paso.style.display =
        "block";


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

      checkoutContainer.style.display =
        "none";

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

        if (
          carrito.length === 0
        ) {

          alert(
            "Tu carrito está vacío."
          );

          return;

        }


        if (checkoutContainer) {

          checkoutContainer.style.display =
            "block";

        }


        mostrarPaso(
          stepCustomer
        );

      }
    );

  }


  /* =====================================================
     PASO 1
     CONFIRMAR INFORMACIÓN
  ===================================================== */

  if (
    confirmCustomerButton
  ) {

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


          if (customerName) {

            customerName.focus();

          }


          return;

        }


        if (!telefono) {

          alert(
            "Escribe tu número de teléfono."
          );


          if (customerPhone) {

            customerPhone.focus();

          }


          return;

        }


        mostrarPaso(
          stepDelivery
        );

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

        if (
          !homeDelivery.checked
        ) return;


        if (departmentBox) {

          departmentBox.classList.add(
            "show"
          );

        }


        if (pickupBox) {

          pickupBox.classList.remove(
            "show"
          );

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


        if (departmentBox) {

          departmentBox.classList.remove(
            "show"
          );

        }


        if (pickupBox) {

          pickupBox.classList.add(
            "show"
          );

        }

      }
    );

  }


  /* =====================================================
     PASO 2
     CONTINUAR ENTREGA
  ===================================================== */

  if (
    continueDeliveryButton
  ) {

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


            if (departmentSelect) {

              departmentSelect.focus();

            }


            return;

          }

        }


        mostrarPaso(
          stepPayment
        );

      }
    );

  }


  /* =====================================================
     FORMA DE PAGO
  ===================================================== */

  if (
    transferPayment
  ) {

    transferPayment.addEventListener(
      "change",
      () => {

        if (
          !transferPayment.checked
        ) return;


        if (bankBox) {

          bankBox.classList.add(
            "show"
          );

        }


        mostrarDatosTransferencia();

      }
    );

  }


  if (cashPayment) {

    cashPayment.addEventListener(
      "change",
      () => {

        if (
          !cashPayment.checked
        ) return;


        if (bankBox) {

          bankBox.classList.remove(
            "show"
          );

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
     DATOS PARA TRANSFERENCIA
  ===================================================== */

  function mostrarDatosTransferencia() {

    if (!bankBox) return;


    let transferInfo =
      document.getElementById(
        "transferInfo"
      );


    if (!transferInfo) {

      transferInfo =
        document.createElement(
          "div"
        );


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


    if (
      continueBankButton
    ) {

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


    if (
      confirmTransferDataButton
    ) {

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

          mostrarPaso(
            stepSummary
          );

        }
      );

    }

  }


  /* =====================================================
     CONTINUAR PAGO - EFECTIVO
  ===================================================== */

  if (
    continuePaymentButton
  ) {

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

        mostrarPaso(
          stepSummary
        );

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
      customerName
        ? customerName.value.trim()
        : "";


    const telefono =
      customerPhone
        ? customerPhone.value.trim()
        : "";


    const direccion =
      customerAddress
        ? customerAddress.value.trim()
        : "";


    const ciudad =
      customerCity
        ? customerCity.value.trim()
        : "";


    const referencia =
      deliveryReference
        ? deliveryReference.value.trim()
        : "";


    let subtotal = 0;


    carrito.forEach(
      producto => {

        subtotal +=
          Number(producto.precio) *
          Number(producto.cantidad);

      }
    );


    let entregaTexto = "";


    if (
      deliveryRadio &&
      deliveryRadio.value ===
      "delivery"
    ) {

      let departamentoTexto = "";


      if (
        departmentSelect &&
        departmentSelect.selectedIndex >= 0
      ) {

        departamentoTexto =
          departmentSelect.options[
            departmentSelect.selectedIndex
          ].text;

      }


      entregaTexto = `

        🚚 Envío a domicilio<br>

        🇭🇳 ${departamentoTexto}<br>

        🏙️ ${ciudad}<br>

        🏠 ${direccion}

      `;

    } else {

      entregaTexto = `

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


      const bancoTexto =
        bankSelect &&
        bankSelect.selectedIndex >= 0
          ? bankSelect.options[
              bankSelect.selectedIndex
            ].text
          : "";


      pagoTexto = `

        🏦 Transferencia bancaria<br>

        Banco:
        ${bancoTexto}

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

      pagoTexto = `

        💵 Pago en efectivo

      `;

    }


    let productosHTML = "";


    carrito.forEach(
      producto => {

        const cantidad =
          Number(
            producto.cantidad
          );


        const precio =
          Number(
            producto.precio
          );


        productosHTML += `

          <div style="margin-bottom:10px;">

            <strong>
              ${producto.nombre}
            </strong>

            <br>

            ${
              producto.talla
                ? `
                  Talla:
                  ${producto.talla}
                  <br>
                `
                : ""
            }

            Cantidad:
            ${cantidad}

            <br>

            HNL
            ${(precio * cantidad)
              .toLocaleString("es-HN")}

          </div>

        `;

      }
    );


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
    HNL ${(subtotal - (subtotal * descuentoPromocional)).toLocaleString("es-HN")}
  </strong>

</div>

    `;

  }


  /* =====================================================
     CONFIRMAR PEDIDO
  ===================================================== */

  if (
    confirmOrderButton
  ) {

    confirmOrderButton.addEventListener(
      "click",
      () => {

        try {

          if (
            carrito.length === 0
          ) {

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


          let bancoSeleccionado =
            "";


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
                  Number(
                    producto.precio
                  ) *
                  Number(
                    producto.cantidad
                  )
                ),
              0
            );


          const numeroPedido =
            "NV-" +
            Date.now()
              .toString()
              .slice(-8);


          const pedido = {

            id:
              numeroPedido,


            fecha:
              new Date().toISOString(),


            cliente: {

              nombre:
                customerName
                  ? customerName.value.trim()
                  : "",

              telefono:
                customerPhone
                  ? customerPhone.value.trim()
                  : "",

              direccion:
                deliveryMethod ===
                "delivery"
                  ? (
                      customerAddress
                        ? customerAddress.value.trim()
                        : ""
                    )
                  : "",

              ciudad:
                deliveryMethod ===
                "delivery"
                  ? (
                      customerCity
                        ? customerCity.value.trim()
                        : ""
                    )
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
                  ? (
                      deliveryReference
                        ? deliveryReference.value.trim()
                        : ""
                    )
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
              carrito.map(
                producto => ({

                  id:
                    producto.id,

                  nombre:
                    producto.nombre,

                  precio:
                    Number(
                      producto.precio
                    ),

                  cantidad:
                    Number(
                      producto.cantidad
                    ),

                  talla:
                    producto.talla || "",

                  imagen:
                    producto.imagen || ""

                })
              ),


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
     SONIDO DE COMPRA CONFIRMADA
  ===================================================== */

  function reproducirSonidoConfirmacion() {

    try {

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;


      if (!AudioContext) return;


      const audioContext =
        new AudioContext();


      const ahora =
        audioContext.currentTime;


      const oscilador =
        audioContext.createOscillator();


      const ganancia =
        audioContext.createGain();


      oscilador.type =
        "sine";


      oscilador.frequency.setValueAtTime(
        950,
        ahora
      );


      oscilador.frequency.exponentialRampToValueAtTime(
        1250,
        ahora + 0.15
      );


      ganancia.gain.setValueAtTime(
        0.0001,
        ahora
      );


      ganancia.gain.exponentialRampToValueAtTime(
        0.30,
        ahora + 0.02
      );


      ganancia.gain.exponentialRampToValueAtTime(
        0.0001,
        ahora + 0.65
      );


      oscilador.connect(
        ganancia
      );


      ganancia.connect(
        audioContext.destination
      );


      oscilador.start(
        ahora
      );


      oscilador.stop(
        ahora + 0.65
      );

    } catch (error) {

      console.log(
        "No se pudo reproducir el sonido de confirmación.",
        error
      );

    }

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

      mensajePago = `

        Tu pedido fue confirmado correctamente.

        <br>

        Hemos registrado la transferencia como forma de pago.

      `;

    } else {

      mensajePago = `

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


    mostrarPaso(
      stepResult
    );


    reproducirSonidoConfirmacion();


    const backToStoreButton =
      document.getElementById(
        "backToStoreButton"
      );


    if (
      backToStoreButton
    ) {

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
        id="retryCheckoutButton"
      >

        INTENTAR NUEVAMENTE

      </button>

    `;


    mostrarPaso(
      stepResult
    );


    const retryButton =
      document.getElementById(
        "retryCheckoutButton"
      );


    if (retryButton) {

      retryButton.addEventListener(
        "click",
        () => {

          mostrarPaso(
            stepCustomer
          );

        }
      );

    }

  }

/* =====================================================
     CÓDIGO PROMOCIONAL NOVA15
  ===================================================== */

  if (applyPromo) {

    applyPromo.addEventListener(
      "click",
      () => {

        const codigo =
          promoCode
            ? promoCode.value.trim().toUpperCase()
            : "";

        if (codigo === "NOVA15") {

          descuentoPromocional = 0.15;
          codigoPromocionalAplicado = "NOVA15";

          if (promoMessage) {

            promoMessage.textContent =
              "✓ Código NOVA15 aplicado: 15% de descuento";

            promoMessage.style.color =
              "#008000";

          }

        } else {

          descuentoPromocional = 0;
          codigoPromocionalAplicado = "";

          if (promoMessage) {

            promoMessage.textContent =
              "Código promocional no válido.";

            promoMessage.style.color =
              "#cc0000";

          }

        }

        mostrarCarrito();

      }
    );

  }

  /* =====================================================
     CATEGORÍAS
  ===================================================== */

  categoryButtons.forEach(
    button => {

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

    }
  );


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

  document.addEventListener(
    "click",
    event => {

      if (
        nosotrosCloud &&
        nosotrosCloud.classList.contains(
          "show"
        ) &&
        !event.target.closest(
          ".nosotros-menu"
        )
      ) {

        nosotrosCloud.classList.remove(
          "show"
        );

      }

    }
  );


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
        .forEach(
          elemento => {

            elemento.textContent =
              elemento.dataset[
                idioma
              ];

          }
        );

    };


  /* =====================================================
     INICIALIZAR
  ===================================================== */

  actualizarContadorCarrito();

  mostrarCarrito();

  cargarProductos();

});