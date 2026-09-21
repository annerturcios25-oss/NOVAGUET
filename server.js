const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const crypto = require("crypto");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
/* =========================
   AUTENTICACIÓN
========================= */

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!ADMIN_USER || !ADMIN_PASSWORD) {
  throw new Error(
    "Faltan ADMIN_USER y/o ADMIN_PASSWORD en las variables de entorno."
  );
}

if (!SESSION_SECRET) {
  throw new Error(
    "Falta SESSION_SECRET en las variables de entorno."
  );
}

/* =========================
   CREAR SESIÓN
========================= */

function crearTokenSesion() {

  const datos =
    "NOVAGUET:" +
    Date.now() +
    ":" +
    require("crypto")
      .randomBytes(32)
      .toString("hex");

  const firma =
    require("crypto")
      .createHmac("sha256", SESSION_SECRET)
      .update(datos)
      .digest("hex");

  return Buffer
    .from(datos + "." + firma)
    .toString("base64url");

}

/* =========================
   VALIDAR SESIÓN
========================= */

function sesionValida(req) {

  const cookies =
    req.headers.cookie || "";

  const coincidencia =
    cookies.match(
      /(?:^|;\s*)novaguet_session=([^;]+)/
    );

  if (!coincidencia) {
    return false;
  }

  try {

    const token =
      decodeURIComponent(
        coincidencia[1]
      );

    const tokenDecodificado =
      Buffer
        .from(token, "base64url")
        .toString("utf8");

    const separador =
      tokenDecodificado.lastIndexOf(".");

    if (separador === -1) {
      return false;
    }

    const datos =
      tokenDecodificado.substring(
        0,
        separador
      );

    const firma =
      tokenDecodificado.substring(
        separador + 1
      );

    const firmaEsperada =
      require("crypto")
        .createHmac("sha256", SESSION_SECRET)
        .update(datos)
        .digest("hex");

    if (
      firma.length !==
      firmaEsperada.length
    ) {
      return false;
    }

    return require("crypto")
      .timingSafeEqual(
        Buffer.from(firma),
        Buffer.from(firmaEsperada)
      );

  } catch (error) {

    return false;

  }

}

/* =========================
   PROTEGER ADMIN
========================= */

function protegerAdmin(req, res, next) {

  if (!sesionValida(req)) {

    return res
      .status(401)
      .send("No autorizado.");

  }

  next();

}

/* =========================
   LOGIN
========================= */

app.post("/api/login", (req, res) => {

  const username =
    String(
      req.body?.username || ""
    ).trim();

  const password =
    String(
      req.body?.password || ""
    );

  if (
    username !== ADMIN_USER ||
    password !== ADMIN_PASSWORD
  ) {

    return res
      .status(401)
      .json({
        error:
          "Usuario o contraseña incorrectos."
      });

  }

  const token =
    crearTokenSesion();

  const esHttps =
    req.headers["x-forwarded-proto"] === "https" ||
    process.env.NODE_ENV === "production";

  const cookie = [
    "novaguet_session=" +
      encodeURIComponent(token),
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=86400"
  ];

  if (esHttps) {
    cookie.push("Secure");
  }

  res.setHeader(
    "Set-Cookie",
    cookie.join("; ")
  );

  return res.json({
    ok: true
  });

});

/* =========================
   LOGOUT
========================= */

app.post("/api/logout", (req, res) => {

  res.setHeader(
    "Set-Cookie",
    "novaguet_session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax"
  );

  res.json({
    ok: true
  });

});
/* =========================================================
   CARPETA DE IMÁGENES
========================================================= */

const imagesFolder = path.join(
  __dirname,
  "public",
  "images"
);

if (!fs.existsSync(imagesFolder)) {
  fs.mkdirSync(imagesFolder, {
    recursive: true
  });
}

/* =========================================================
   CONFIGURAR SUBIDA DE IMÁGENES
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesFolder);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const nombreSeguro = path
      .basename(
        file.originalname,
        extension
      )
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    const nombreFinal =
      Date.now() +
      "-" +
      nombreSeguro +
      extension;

    cb(null, nombreFinal);
  }
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (
      tiposPermitidos.includes(
        file.mimetype
      )
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Solo se permiten imágenes JPG, PNG o WEBP."
        )
      );
    }
  }
});

/* =========================================================
   ARCHIVO DE PRODUCTOS
========================================================= */

const productsFile = path.join(
  __dirname,
  "products.json"
);

/* =========================================================
   ARCHIVO DE PEDIDOS
========================================================= */

const ordersFile = path.join(
  __dirname,
  "orders.json"
);

if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(
    ordersFile,
    JSON.stringify([], null, 2)
  );
}

/* =========================================================
   CREAR PRODUCTOS INICIALES
========================================================= */

if (!fs.existsSync(productsFile)) {
  const productosIniciales = [
    {
      id: 1,
      nombre: "Camisa de niño PAW PATROL",
      precio: 700,
      categoria: "Ropa",
      talla: "2T",
      descripcion: "Camisa de niño PAW PATROL",
      imagen: "/images/camisa-paw-patrol.jpeg",
      stock: 10
    }
  ];

  fs.writeFileSync(
    productsFile,
    JSON.stringify(
      productosIniciales,
      null,
      2
    )
  );
}

/* =========================================================
   PÁGINA PRINCIPAL
========================================================= */

app.get("/", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public",
      "index.html"
    )
  );
});

/* =========================================================
   LOGIN
========================================================= */

app.get("/login.html", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public",
      "login.html"
    )
  );
});

/* =========================================================
   PANEL ADMIN
========================================================= */

app.get(
  "/admin.html",
  protegerAdmin,
  (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "public",
        "admin.html"
      )
    );
  }
);

/* =========================================================
   ARCHIVOS PÚBLICOS
========================================================= */

app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);

/* =========================================================
   OBTENER PRODUCTOS
========================================================= */

app.get(
  "/api/productos",
  (req, res) => {
    try {
      const productos = JSON.parse(
        fs.readFileSync(
          productsFile,
          "utf8"
        )
      );

      res.json(productos);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "No se pudieron cargar los productos"
      });
    }
  }
);

/* =========================================================
   AGREGAR PRODUCTO
   🔐 PROTEGIDO
========================================================= */

app.post(
  "/api/productos",
  protegerAdmin,
  upload.single("imagen"),
  (req, res) => {
    try {
      const productos = JSON.parse(
        fs.readFileSync(
          productsFile,
          "utf8"
        )
      );

      let imagenProducto = "";

      if (req.file) {
        imagenProducto =
          "/images/" +
          req.file.filename;
      }

      const stockRecibido =
        Number(req.body.stock);

      const stock =
        Number.isFinite(stockRecibido)
          ? Math.max(
              0,
              stockRecibido
            )
          : 0;

      const nuevoProducto = {
        id: Date.now(),

        nombre:
          req.body.nombre || "",

        precio:
          Number(req.body.precio) || 0,

        categoria:
          req.body.categoria || "",

        talla:
          req.body.talla || "",

        descripcion:
          req.body.descripcion || "",

        imagen:
          imagenProducto,

        stock:
          stock
      };

      productos.push(
        nuevoProducto
      );

      fs.writeFileSync(
        productsFile,
        JSON.stringify(
          productos,
          null,
          2
        )
      );

      res.json({
        mensaje:
          "Producto agregado correctamente",

        producto:
          nuevoProducto
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "No se pudo agregar el producto"
      });
    }
  }
);

/* =========================================================
   EDITAR PRODUCTO
   🔐 PROTEGIDO
========================================================= */

app.put(
  "/api/productos/:id",
  protegerAdmin,
  upload.single("imagen"),
  (req, res) => {
    try {
      const productos = JSON.parse(
        fs.readFileSync(
          productsFile,
          "utf8"
        )
      );

      const id =
        String(req.params.id);

      const indice =
        productos.findIndex(
          producto =>
            String(producto.id) === id
        );

      if (indice === -1) {
        return res.status(404).json({
          error:
            "Producto no encontrado"
        });
      }

      const productoActual =
        productos[indice];

      let imagenProducto =
        productoActual.imagen || "";

      if (req.file) {
        imagenProducto =
          "/images/" +
          req.file.filename;

        if (
          productoActual.imagen &&
          productoActual.imagen.startsWith(
            "/images/"
          )
        ) {
          const nombreImagenAnterior =
            productoActual.imagen.replace(
              "/images/",
              ""
            );

          const rutaImagenAnterior =
            path.join(
              imagesFolder,
              nombreImagenAnterior
            );

          if (
            fs.existsSync(
              rutaImagenAnterior
            )
          ) {
            fs.unlinkSync(
              rutaImagenAnterior
            );
          }
        }
      }

      const stockRecibido =
        Number(req.body.stock);

      const stock =
        Number.isFinite(stockRecibido)
          ? Math.max(
              0,
              stockRecibido
            )
          : 0;

      productos[indice] = {
        id:
          productoActual.id,

        nombre:
          req.body.nombre || "",

        precio:
          Number(req.body.precio) || 0,

        categoria:
          req.body.categoria || "",

        talla:
          req.body.talla || "",

        descripcion:
          req.body.descripcion || "",

        imagen:
          imagenProducto,

        stock:
          stock
      };

      fs.writeFileSync(
        productsFile,
        JSON.stringify(
          productos,
          null,
          2
        )
      );

      res.json({
        mensaje:
          "Producto actualizado correctamente",

        producto:
          productos[indice]
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "No se pudo actualizar el producto"
      });
    }
  }
);

/* =========================================================
   ELIMINAR PRODUCTO
   🔐 PROTEGIDO
========================================================= */

app.delete(
  "/api/productos/:id",
  protegerAdmin,
  (req, res) => {
    try {
      const productos = JSON.parse(
        fs.readFileSync(
          productsFile,
          "utf8"
        )
      );

      const id =
        String(req.params.id);

      const productoEliminar =
        productos.find(
          producto =>
            String(producto.id) === id
        );

      if (!productoEliminar) {
        return res.status(404).json({
          error:
            "Producto no encontrado"
        });
      }

      const productosActualizados =
        productos.filter(
          producto =>
            String(producto.id) !== id
        );

      fs.writeFileSync(
        productsFile,
        JSON.stringify(
          productosActualizados,
          null,
          2
        )
      );

      if (
        productoEliminar.imagen &&
        productoEliminar.imagen.startsWith(
          "/images/"
        )
      ) {
        const nombreImagen =
          productoEliminar.imagen.replace(
            "/images/",
            ""
          );

        const rutaImagen =
          path.join(
            imagesFolder,
            nombreImagen
          );

        if (
          fs.existsSync(
            rutaImagen
          )
        ) {
          fs.unlinkSync(
            rutaImagen
          );
        }
      }

      res.json({
        mensaje:
          "Producto eliminado correctamente",

        producto:
          productoEliminar
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "No se pudo eliminar el producto"
      });
    }
  }
);

/* =========================================================
   CREAR PEDIDO
========================================================= */

app.post(
  "/api/pedidos",
  (req, res) => {
    console.log(
      "PEDIDO RECIBIDO EN EL SERVIDOR"
    );

    try {
      const productos = JSON.parse(
        fs.readFileSync(
          productsFile,
          "utf8"
        )
      );

      const pedidos = JSON.parse(
        fs.readFileSync(
          ordersFile,
          "utf8"
        )
      );

      const datos =
        req.body || {};

      const items =
        Array.isArray(datos.productos)
          ? datos.productos
          : Array.isArray(datos.carrito)
            ? datos.carrito
            : [];

      if (!items.length) {
        return res.status(400).json({
          error:
            "El carrito está vacío."
        });
      }
/* =====================================================

   VERIFICAR PRODUCTOS Y STOCK

===================================================== */

for (const item of items) {

  const producto =

    productos.find(

      p =>

        String(p.id) ===

        String(item.id)

    );

  if (!producto) {

    return res.status(400).json({

      error:

        "Uno de los productos ya no está disponible."

    });

  }

  const cantidad =

    Number(

      item.cantidad ||

      item.quantity ||

      1

    );

  const stock =

    Number(

      producto.stock || 0

    );

  if (

    !Number.isFinite(cantidad) ||

    cantidad <= 0

  ) {

    return res.status(400).json({

      error:

        "Cantidad de producto inválida."

    });

  }

  if (cantidad > stock) {

  return res.status(400).json({

    error: "No hay suficiente stock de " + producto.nombre + "."

  });

}

}
     
      /* =====================================================
         DESCONTAR STOCK
      ===================================================== */

      for (const item of items) {
        const producto =
          productos.find(
            p =>
              String(p.id) ===
              String(item.id)
          );

        const cantidad =
          Number(
            item.cantidad ||
            item.quantity ||
            1
          );

        producto.stock =
          Math.max(
            0,
            Number(producto.stock || 0) -
            cantidad
          );
      }

      /* =====================================================
         CREAR PEDIDO
      ===================================================== */

      const nuevoPedido = {
        id: Date.now(),

        fecha:
          new Date().toISOString(),

        cliente: {
          nombre:
            datos.cliente?.nombre || "",

          telefono:
            datos.cliente?.telefono || ""
        },

        nombre:
          datos.cliente?.nombre || "",

        telefono:
          datos.cliente?.telefono || "",

        direccion:
          datos.entrega?.direccion || "",

        referencia:
          datos.entrega?.referencia || "",

        departamento:
          datos.entrega?.departamento || "",

        municipio:
          datos.entrega?.municipio || "",

        metodoEntrega:
          datos.entrega?.metodo || "",

        metodoPago:
          datos.pago?.metodo || "",

        banco:
          datos.pago?.banco || "",

        productos:
          items,

        subtotal:
          Number(
            datos.subtotal || 0
          ),

        descuento:
          Number(
            datos.descuento || 0
          ),

        total:
          Number(
            datos.total || 0
          ),

        codigoPromocional:
          datos.promocion?.codigo || "",

        estado:
          "Pendiente"
      };

      /* =====================================================
         GUARDAR PEDIDO
      ===================================================== */

      pedidos.push(
        nuevoPedido
      );

      fs.writeFileSync(
        ordersFile,
        JSON.stringify(
          pedidos,
          null,
          2
        )
      );

      /* =====================================================
         GUARDAR STOCK ACTUALIZADO
      ===================================================== */

      fs.writeFileSync(
        productsFile,
        JSON.stringify(
          productos,
          null,
          2
        )
      );

      res.status(201).json({
        mensaje:
          "Pedido creado correctamente",

        pedido:
          nuevoPedido
      });

    } catch (error) {
      console.error(
        "ERROR CREANDO PEDIDO:",
        error
      );

      res.status(500).json({
        error:
          "No se pudo crear el pedido"
      });
    }
  }
);

/* =========================================================
   OBTENER PEDIDOS
   🔐 PROTEGIDO
========================================================= */

app.get(
  "/api/pedidos",
  protegerAdmin,
  (req, res) => {
    try {
      const pedidos = JSON.parse(
        fs.readFileSync(
          ordersFile,
          "utf8"
        )
      );

      res.json(pedidos);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "No se pudieron cargar los pedidos"
      });
    }
  }
);

/* =========================================================
   CAMBIAR ESTADO DE PEDIDO
   🔐 PROTEGIDO
========================================================= */

app.patch(
  "/api/pedidos/:id/estado",
  protegerAdmin,
  (req, res) => {
    try {
      const pedidos = JSON.parse(
        fs.readFileSync(
          ordersFile,
          "utf8"
        )
      );

      const id =
        String(req.params.id);

      const estado =
        String(
          req.body?.estado || ""
        ).trim();

      const estadosPermitidos = [
        "Pendiente",
        "Confirmado",
        "Preparando",
        "Enviado",
        "Entregado",
        "Cancelado"
      ];

      if (
        !estadosPermitidos.includes(
          estado
        )
      ) {
        return res.status(400).json({
          error:
            "Estado de pedido inválido."
        });
      }

      const indice =
        pedidos.findIndex(
          pedido =>
            String(pedido.id) === id
        );

      if (indice === -1) {
        return res.status(404).json({
          error:
            "Pedido no encontrado."
        });
      }

      pedidos[indice].estado =
        estado;

      fs.writeFileSync(
        ordersFile,
        JSON.stringify(
          pedidos,
          null,
          2
        )
      );

      res.json({
        mensaje:
          "Estado actualizado correctamente",

        pedido:
          pedidos[indice]
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "No se pudo actualizar el estado del pedido"
      });
    }
  }
);

/* =========================================================
   CONSULTAR ESTADO DE UN PEDIDO
   🔓 PÚBLICO
========================================================= */

app.get(
  "/api/pedidos/:id",
  (req, res) => {
    try {
      const pedidos = JSON.parse(
        fs.readFileSync(
          ordersFile,
          "utf8"
        )
      );

      const id =
        String(req.params.id);

      const pedido =
        pedidos.find(
          p =>
            String(p.id) === id
        );

      if (!pedido) {
        return res.status(404).json({
          error:
            "Pedido no encontrado."
        });
      }

      res.json({
        id: pedido.id,
        fecha: pedido.fecha,
        estado: pedido.estado,
        total: pedido.total
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "No se pudo consultar el pedido"
      });
    }
  }
);

/* =========================================================
   MANEJO DE ERRORES
========================================================= */

app.use(
  (error, req, res, next) => {
    console.error(error);

    res.status(400).json({
      error:
        error.message ||
        "Ocurrió un error."
    });
  }
);

/* =========================================================
   INICIAR SERVIDOR
========================================================= */

app.listen(
  PORT,
  () => {
    console.log(
      "NOVAGUET funcionando en el puerto " +
      PORT
    );
  }
);