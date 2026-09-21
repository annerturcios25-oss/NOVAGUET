document.addEventListener("DOMContentLoaded", () => {

  const productForm = document.getElementById("productForm");
  const productMessage = document.getElementById("productMessage");
  const productsContainer = document.getElementById("productsContainer");
  const ordersContainer = document.getElementById("ordersContainer");

  const totalProducts = document.getElementById("totalProducts");
  const totalStock = document.getElementById("totalStock");
  const pendingOrders = document.getElementById("pendingOrders");

  const logoutButton = document.getElementById("logoutButton");


  /* =========================
     REDIRECCIÓN SI NO HAY SESIÓN
  ========================= */

  function verificarRespuesta(response) {

    if (response.status === 401) {
      window.location.href = "/login.html";
      return false;
    }

    return true;
  }


  /* =========================
     CARGAR PRODUCTOS
  ========================= */

  async function cargarProductos() {

    try {

      const response = await fetch("/api/productos", {
        method: "GET",
        credentials: "include"
      });

      if (!verificarRespuesta(response)) {
        return;
      }

      if (!response.ok) {
        throw new Error("No se pudieron cargar los productos.");
      }

      const productos = await response.json();

      mostrarProductos(productos);

      actualizarEstadisticas(productos);

    } catch (error) {

      productsContainer.innerHTML =
        '<div class="empty">No se pudieron cargar los productos.</div>';

      console.error(error);

    }

  }


  /* =========================
     MOSTRAR PRODUCTOS
  ========================= */

  function mostrarProductos(productos) {

    productsContainer.innerHTML = "";

    if (!Array.isArray(productos) || productos.length === 0) {

      productsContainer.innerHTML =
        '<div class="empty">No hay productos registrados.</div>';

      return;
    }

    productos.forEach(producto => {

      const card = document.createElement("div");

      card.className = "card";

      const imagen = producto.imagen
        ? producto.imagen
        : "/images/NOVAGUET.PNG.png";

      card.innerHTML = `
        <img
          src="${imagen}"
          alt="${escapeHtml(producto.nombre || "Producto")}"
          onerror="this.src='/images/NOVAGUET.PNG.png'"
        >

        <div class="card-content">

          <h3>${escapeHtml(producto.nombre || "Sin nombre")}</h3>

          <p>
            <strong>Precio:</strong>
            HNL ${Number(producto.precio || 0).toFixed(2)}
          </p>

          <p>
            <strong>Categoría:</strong>
            ${escapeHtml(producto.categoria || "Sin categoría")}
          </p>

          <p>
            <strong>Talla:</strong>
            ${escapeHtml(producto.talla || "Única")}
          </p>

          <p>
            <strong>Stock:</strong>
            ${Number(producto.stock || 0)}
          </p>

          ${
 producto.descripcion
  ? "<p>" + escapeHtml(producto.descripcion) + "</p>"
  : ""
}

        </div>
<div class="product-actions">

          <button
            type="button"
            class="edit-product"
            data-id="${producto.id}"
          >
            ✏️ Editar
          </button>

          <button
            type="button"
            class="delete-product"
            data-id="${producto.id}"
          >
            🗑️ Borrar
          </button>

        </div>

        </div>

      `;

      productsContainer.appendChild(card);

    });

  }
/* =========================
     BORRAR PRODUCTO
  ========================= */

  productsContainer.addEventListener("click", async (event) => {

    const boton = event.target.closest(".delete-product");

    if (!boton) {
      return;
    }

    const id = boton.dataset.id;

    const confirmar = confirm(
      "¿Seguro que quieres borrar este producto?"
    );

    if (!confirmar) {
      return;
    }

    try {

      const respuesta = await fetch(
        "/api/productos/" + id,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      if (!respuesta.ok) {

        const error = await respuesta.json().catch(() => ({}));

        alert(
          error.error || "No se pudo borrar el producto."
        );

        return;
      }

      alert("Producto borrado correctamente.");

      cargarProductos();

    } catch (error) {

      console.error(error);

      alert("Error de conexión con el servidor.");

    }

  });


  /* =========================
     EDITAR PRODUCTO
  ========================= */

  productsContainer.addEventListener("click", async (event) => {

    const boton = event.target.closest(".edit-product");

    if (!boton) {
      return;
    }

    const id = boton.dataset.id;

    try {

      const respuestaProductos = await fetch(
        "/api/productos",
        {
          credentials: "include"
        }
      );

      if (!respuestaProductos.ok) {

        alert("No se pudieron cargar los productos.");

        return;
      }

      const productos = await respuestaProductos.json();

      const producto = productos.find(
        p => String(p.id) === String(id)
      );

      if (!producto) {

        alert("Producto no encontrado.");

        return;
      }

      const nombre = prompt(
        "Nombre del producto:",
        producto.nombre || ""
      );

      if (nombre === null) {
        return;
      }

      const precio = prompt(
        "Precio en HNL:",
        producto.precio || ""
      );

      if (precio === null) {
        return;
      }

      const categoria = prompt(
        "Categoría:",
        producto.categoria || ""
      );

      if (categoria === null) {
        return;
      }

      const talla = prompt(
        "Talla:",
        producto.talla || ""
      );

      if (talla === null) {
        return;
      }

      const stock = prompt(
        "Stock:",
        producto.stock || 0
      );

      if (stock === null) {
        return;
      }

      const descripcion = prompt(
        "Descripción:",
        producto.descripcion || ""
      );

      if (descripcion === null) {
        return;
      }

      const imagen = prompt(
        "Ruta de la imagen:",
        producto.imagen || ""
      );

      if (imagen === null) {
        return;
      }

      const respuesta = await fetch(
        "/api/productos/" + id,
        {
          method: "PUT",
          credentials: "include",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            nombre: nombre,
            precio: Number(precio),
            categoria: categoria,
            talla: talla,
            stock: Number(stock),
            descripcion: descripcion,
            imagen: imagen
          })
        }
      );

      if (!respuesta.ok) {

        const error = await respuesta.json().catch(() => ({}));

        alert(
          error.error ||
          "No se pudo actualizar el producto."
        );

        return;
      }

      alert(
        "Producto actualizado correctamente."
      );

      cargarProductos();

    } catch (error) {

      console.error(error);

      alert(
        "Error de conexión con el servidor."
      );

    }

  });
  /* =========================
     ESTADÍSTICAS
  ========================= */

  function actualizarEstadisticas(productos) {

    const cantidadProductos = productos.length;

    let stockTotal = 0;

    productos.forEach(producto => {

      stockTotal += Number(producto.stock || 0);

    });

    totalProducts.textContent = cantidadProductos;
    totalStock.textContent = stockTotal;

  }


  /* =========================
     CARGAR PEDIDOS
  ========================= */

  async function cargarPedidos() {

    try {

      const response = await fetch("/api/pedidos", {
        method: "GET",
        credentials: "include"
      });

      if (!verificarRespuesta(response)) {
        return;
      }

      if (!response.ok) {
        throw new Error("No se pudieron cargar los pedidos.");
      }

      const pedidos = await response.json();

      mostrarPedidos(pedidos);

      actualizarPedidosPendientes(pedidos);

    } catch (error) {

      ordersContainer.innerHTML =
        '<div class="empty">No se pudieron cargar los pedidos.</div>';

      console.error(error);

    }

  }


  /* =========================
     MOSTRAR PEDIDOS
  ========================= */

  function mostrarPedidos(pedidos) {

    ordersContainer.innerHTML = "";

    if (!Array.isArray(pedidos) || pedidos.length === 0) {

      ordersContainer.innerHTML =
        '<div class="empty">No hay pedidos registrados.</div>';

      return;
    }

    pedidos.forEach(pedido => {

      const card = document.createElement("div");

      card.className = "card order-card";

      const productos = Array.isArray(pedido.productos)
        ? pedido.productos
        : [];

      let listaProductos = "";

      productos.forEach(producto => {

        listaProductos += `
          <div class="order-product">
            <span>
              ${escapeHtml(producto.nombre || "Producto")}
            </span>

            <span>
              x${Number(producto.cantidad || 1)}
            </span>
          </div>
        `;

      });


      const estadoActual =
        pedido.estado || "Pendiente";


      card.innerHTML = `

        <div class="card-content">

          <h3>
            Pedido #${escapeHtml(String(pedido.id || ""))}
          </h3>

          <p>
            <strong>Fecha:</strong>
            ${escapeHtml(pedido.fecha || "Sin fecha")}
          </p>

          <hr>

          <p>
            <strong>Cliente:</strong>
            ${escapeHtml(pedido.nombre || pedido.cliente || "Sin nombre")}
          </p>

          <p>
            <strong>Teléfono:</strong>
            ${escapeHtml(pedido.telefono || "No indicado")}
          </p>

          <p>
            <strong>Dirección:</strong>
            ${escapeHtml(pedido.direccion || "No indicada")}
          </p>

          ${
            pedido.referencia
              ? `
                <p>
                  <strong>Referencia:</strong>
                  ${escapeHtml(pedido.referencia)}
                </p>
              `
              : ""
          }

          ${
            pedido.departamento
              ? `
                <p>
                  <strong>Departamento:</strong>
                  ${escapeHtml(pedido.departamento)}
                </p>
              `
              : ""
          }

          ${
            pedido.municipio
              ? `
                <p>
                  <strong>Municipio:</strong>
                  ${escapeHtml(pedido.municipio)}
                </p>
              `
              : ""
          }

          <p>
            <strong>Entrega:</strong>
            ${escapeHtml(pedido.metodoEntrega || "No indicado")}
          </p>

          <p>
            <strong>Pago:</strong>
            ${escapeHtml(pedido.metodoPago || "No indicado")}
          </p>

          ${
            pedido.banco
              ? `
                <p>
                  <strong>Banco:</strong>
                  ${escapeHtml(pedido.banco)}
                </p>
              `
              : ""
          }

          <hr>

          <h4>Productos</h4>

          <div class="order-products">
            ${listaProductos || "<p>No hay productos.</p>"}
          </div>

          <hr>

          <p>
            <strong>Subtotal:</strong>
            HNL ${Number(pedido.subtotal || 0).toFixed(2)}
          </p>

          ${
            Number(pedido.descuento || 0) > 0
              ? `
                <p>
                  <strong>Descuento:</strong>
                  - HNL ${Number(pedido.descuento).toFixed(2)}
                </p>
              `
              : ""
          }

          <p class="order-total">
            <strong>Total:</strong>
            HNL ${Number(pedido.total || 0).toFixed(2)}
          </p>

          ${
            pedido.codigoPromocional
              ? `
                <p>
                  <strong>Promoción:</strong>
                  ${escapeHtml(pedido.codigoPromocional)}
                </p>
              `
              : ""
          }

          <div class="status-box">

            <label>
              Estado del pedido
            </label>

            <select
              class="status-select"
              data-id="${escapeHtml(String(pedido.id || ""))}"
            >

              <option value="Pendiente"
                ${estadoActual === "Pendiente" ? "selected" : ""}>
                Pendiente
              </option>

              <option value="Confirmado"
                ${estadoActual === "Confirmado" ? "selected" : ""}>
                Confirmado
              </option>

              <option value="Preparando"
                ${estadoActual === "Preparando" ? "selected" : ""}>
                Preparando
              </option>

              <option value="Enviado"
                ${estadoActual === "Enviado" ? "selected" : ""}>
                Enviado
              </option>

              <option value="Entregado"
                ${estadoActual === "Entregado" ? "selected" : ""}>
                Entregado
              </option>

              <option value="Cancelado"
                ${estadoActual === "Cancelado" ? "selected" : ""}>
                Cancelado
              </option>

            </select>

          </div>

        </div>
      `;

      ordersContainer.appendChild(card);

    });


    document
      .querySelectorAll(".status-select")
      .forEach(select => {

        select.addEventListener("change", async function () {

          const pedidoId = this.dataset.id;
          const nuevoEstado = this.value;

          await cambiarEstadoPedido(
            pedidoId,
            nuevoEstado
          );

        });

      });

  }


  /* =========================
     CAMBIAR ESTADO
  ========================= */

  async function cambiarEstadoPedido(
    pedidoId,
    nuevoEstado
  ) {

    try {

      const response = await fetch(
        "/api/pedidos/" +
        encodeURIComponent(pedidoId) +
        "/estado",
        {
          method: "PATCH",

          credentials: "include",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            estado: nuevoEstado
          })
        }
      );


      if (!verificarRespuesta(response)) {
        return;
      }


      if (!response.ok) {

        alert(
          "No se pudo actualizar el estado del pedido."
        );

        return;
      }


      await cargarPedidos();


    } catch (error) {

      console.error(error);

      alert(
        "No se pudo conectar con el servidor."
      );

    }

  }


  /* =========================
     PEDIDOS PENDIENTES
  ========================= */

  function actualizarPedidosPendientes(pedidos) {

    const pendientes = pedidos.filter(
      pedido =>
        pedido.estado === "Pendiente" ||
        !pedido.estado
    );

    pendingOrders.textContent =
      pendientes.length;

  }


  /* =========================
     AGREGAR PRODUCTO
  ========================= */

  productForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      productMessage.textContent = "";
      productMessage.style.display = "none";


      const formData =
        new FormData(productForm);


      try {

        const response = await fetch(
          "/api/productos",
          {
            method: "POST",
            credentials: "include",
            body: formData
          }
        );


        if (!verificarRespuesta(response)) {
          return;
        }


        const data =
          await response.json().catch(() => ({}));


        if (!response.ok) {

          productMessage.textContent =
            data.error ||
            "No se pudo agregar el producto.";

          productMessage.style.display =
            "block";

          return;
        }


        productMessage.textContent =
          "Producto agregado correctamente.";

        productMessage.style.display =
          "block";


        productForm.reset();


        await cargarProductos();


      } catch (error) {

        console.error(error);

        productMessage.textContent =
          "No se pudo conectar con el servidor.";

        productMessage.style.display =
          "block";

      }

    }
  );


  /* =========================
     CERRAR SESIÓN
  ========================= */

  logoutButton.addEventListener(
    "click",
    async function () {

      try {

        await fetch(
          "/api/logout",
          {
            method: "POST",
            credentials: "include"
          }
        );

      } catch (error) {

        console.error(error);

      }

      window.location.href =
        "/login.html";

    }
  );


  /* =========================
     SEGURIDAD HTML
  ========================= */

  function escapeHtml(valor) {

    const div =
      document.createElement("div");

    div.textContent =
      valor == null ? "" : String(valor);

    return div.innerHTML;

  }


  /* =========================
     INICIAR PANEL
  ========================= */

  cargarProductos();
  cargarPedidos();

});