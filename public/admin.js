const productForm =
  document.getElementById("productForm");

const mensaje =
  document.getElementById("mensaje");

const listaProductos =
  document.getElementById("listaProductos");


/* =========================
   CARGAR PRODUCTOS
========================= */

async function cargarProductos() {

  try {

const respuesta =
  await fetch(
    "/api/productos/" + id,
    {
      method: "DELETE"
    }
  );

    const productos =
      await respuesta.json();

    mostrarProductos(productos);

  } catch (error) {

    console.error(error);

    listaProductos.innerHTML = `
      <p class="sin-productos">
        No se pudieron cargar los productos.
      </p>
    `;

  }

}


/* =========================
   MOSTRAR PRODUCTOS
========================= */

function mostrarProductos(productos) {

  if (!productos || productos.length === 0) {

    listaProductos.innerHTML = `
      <p class="sin-productos">
        No hay productos agregados.
      </p>
    `;

    return;

  }


  listaProductos.innerHTML =
    productos.map(producto => `

      <div class="producto-admin">

        <img
          src="${producto.imagen}"
          alt="${producto.nombre}"
        >

        <div class="producto-info">

          <h3>
            ${producto.nombre}
          </h3>

          <p>
            HNL ${producto.precio}
          </p>

          <p>
            ${producto.categoria}
            ${producto.talla ? " • " + producto.talla : ""}
          </p>

        </div>

        <button
          class="eliminar-button"
          data-id="${producto.id}"
        >
          🗑️ ELIMINAR
        </button>

      </div>

    `).join("");


  document
    .querySelectorAll(".eliminar-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            Number(button.dataset.id);

          eliminarProducto(id);

        }
      );

    });

}


/* =========================
   ELIMINAR PRODUCTO
========================= */

async function eliminarProducto(id) {

  const confirmar =
    confirm(
      "¿Seguro que quieres eliminar este producto?"
    );

  if (!confirmar) return;


  try {
const respuesta =
  await fetch(
    "/api/productos/" + id,
    {
      method: "DELETE"
    }
  );

    const resultado =
      await respuesta.json();


    if (!respuesta.ok) {

      throw new Error(
        resultado.error ||
        "No se pudo eliminar el producto"
      );

    }


    mensaje.textContent =
      "✅ Producto eliminado correctamente";


    cargarProductos();


  } catch (error) {

    console.error(error);

    mensaje.textContent =
      "❌ No se pudo eliminar el producto";

  }

}


/* =========================
   AGREGAR PRODUCTO
========================= */

productForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const formulario =
      new FormData();


    formulario.append(
      "nombre",
      document.getElementById("nombre").value
    );


    formulario.append(
      "precio",
      document.getElementById("precio").value
    );


    formulario.append(
      "categoria",
      document.getElementById("categoria").value
    );


    formulario.append(
      "talla",
      document.getElementById("talla").value
    );


    formulario.append(
      "descripcion",
      document.getElementById("descripcion").value
    );


    const imagen =
      document.getElementById("imagen");


    if (imagen.files.length > 0) {

      formulario.append(
        "imagen",
        imagen.files[0]
      );

    }


    try {

      const respuesta =
        await fetch(
          "/api/productos",
          {
            method: "POST",
            body: formulario
          }
        );


      const resultado =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          resultado.error ||
          "No se pudo agregar el producto"
        );

      }


      mensaje.textContent =
        "✅ Producto agregado correctamente";


      productForm.reset();


      cargarProductos();


    } catch (error) {

      console.error(error);

      mensaje.textContent =
        "❌ No se pudo agregar el producto";

    }

  }
);


/* =========================
   INICIAR
========================= */

cargarProductos();