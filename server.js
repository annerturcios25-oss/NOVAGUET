require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

/* =====================================
   ENVIAR CORREO DE CONFIRMACIÓN
   DISEÑO PREMIUM NEGRO Y DORADO
===================================== */

async function enviarCorreoConfirmacion(pedido) {
  const emailCliente =
    pedido.cliente?.email || pedido.email;

  if (!emailCliente) {
    console.log(
      "El pedido no tiene correo del cliente."
    );
    return;
  }

  function escaparHTML(texto) {
    return String(texto || "").replace(/[&<>"']/g, function(caracter) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[caracter];
    });
  }

  const nombreCliente = escaparHTML(
    pedido.cliente?.nombre ||
    pedido.nombre ||
    "Cliente"
  );

  const numeroPedido = escaparHTML(
    pedido.id || "Pendiente"
  );

  const estadoPedido = escaparHTML(
    pedido.estado || "Pendiente de preparación"
  );

const fechaOriginal =
  pedido.fecha || pedido.fechaPedido || new Date();

const fechaPedido = new Date(fechaOriginal).toLocaleDateString(
  "es-HN",
  {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }
);

  const productos = Array.isArray(pedido.productos)
    ? pedido.productos
    : [];

  const productosHTML = productos.map(function(producto) {
    const nombre = escaparHTML(producto.nombre);
    const cantidad = Number(producto.cantidad) || 0;
    const precio = Number(producto.precio) || 0;
    const subtotal = precio * cantidad;

    return `
      <tr>
        <td style="padding:16px 10px;border-bottom:1px solid #333333;color:#ffffff;">
          <strong>${nombre}</strong>
        </td>
        <td style="padding:16px 10px;border-bottom:1px solid #333333;text-align:center;color:#dddddd;">
          ${cantidad}
        </td>
        <td style="padding:16px 10px;border-bottom:1px solid #333333;text-align:right;color:#ffffff;white-space:nowrap;">
          L ${subtotal.toFixed(2)}
        </td>
      </tr>
    `;
  }).join("");

  const total = Number(pedido.total) || 0;

  const htmlCorreo = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
    <title>Confirmación de pedido - NOVA GUET</title>
  </head>

  <body style="margin:0;padding:0;background-color:#080808;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#080808;">
      <tr>
        <td align="center" style="padding:25px 10px;">

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:650px;background-color:#101010;border:1px solid #b88a28;">

            <!-- ENCABEZADO -->
            <tr>
              <td align="center" style="padding:35px 20px;background-color:#050505;border-bottom:2px solid #d4a72c;">

                <div style="font-size:36px;font-weight:900;letter-spacing:2px;color:#ffffff;">
                  NOVA <span style="color:#e5b83e;">GUET</span>
                </div>

                <div style="margin-top:10px;font-size:12px;letter-spacing:5px;color:#dddddd;">
                  TU ESTILO, TU ESENCIA.
                </div>

              </td>
            </tr>

            <!-- MENSAJE PRINCIPAL -->
            <tr>
              <td style="padding:30px 25px 20px;">

                <h1 style="margin:0 0 25px;font-size:29px;line-height:1.3;color:#ffffff;">
                  ¡Gracias por tu <span style="color:#e5b83e;">compra!</span>
                </h1>

                <p style="margin:0 0 12px;font-size:21px;font-weight:bold;color:#ffffff;">
                  Hola, ${nombreCliente}.
                </p>

                <p style="margin:0;font-size:16px;line-height:1.7;color:#c8c8c8;">
                  Nos alegra mucho que hayas elegido <strong style="color:#e5b83e;">NOVA GUET</strong>.
                  Hemos recibido tu pedido correctamente.
                  ¡Gracias por confiar en nosotros!
                </p>

              </td>
            </tr>

            <!-- INFORMACIÓN DEL PEDIDO -->
            <tr>
              <td style="padding:10px 25px 25px;">

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #6d5522;border-radius:8px;">
                  <tr>
                    <td style="padding:18px;">

                      <div style="font-size:12px;letter-spacing:1px;color:#bbbbbb;">
                        NÚMERO DE PEDIDO
                      </div>

                      <div style="padding-top:6px;font-size:30px;font-weight:bold;color:#e5b83e;">
                        #${numeroPedido}
                      </div>

                    </td>
                  </tr>

                  <tr>
                    <td style="padding:0 18px 18px;color:#cccccc;font-size:14px;">
                      Fecha del pedido: <strong style="color:#ffffff;">${fechaPedido}</strong>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- TABLA DE PRODUCTOS -->
            <tr>
              <td style="padding:0 25px 25px;">

                <h2 style="margin:0 0 18px;padding-bottom:12px;border-bottom:1px solid #d4a72c;font-size:21px;color:#ffffff;">
                  RESUMEN DE TU PEDIDO
                </h2>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">

                  <thead>
                    <tr>
                      <th align="left" style="padding:12px 10px;border-bottom:1px solid #555555;font-size:12px;color:#e5b83e;">
                        PRODUCTO
                      </th>

                      <th align="center" style="padding:12px 5px;border-bottom:1px solid #555555;font-size:12px;color:#e5b83e;">
                        CANT.
                      </th>

                      <th align="right" style="padding:12px 10px;border-bottom:1px solid #555555;font-size:12px;color:#e5b83e;">
                        PRECIO
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    ${productosHTML}
                  </tbody>

                </table>

              </td>
            </tr>

            <!-- TOTAL -->
            <tr>
              <td style="padding:0 25px 25px;">

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#211a0c;border:1px solid #d4a72c;">
                  <tr>
                    <td style="padding:20px 15px;font-size:16px;font-weight:bold;color:#ffffff;">
                      TOTAL DEL PEDIDO
                    </td>

                    <td align="right" style="padding:20px 15px;font-size:25px;font-weight:bold;color:#f2c451;white-space:nowrap;">
                      L ${total.toFixed(2)}
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- ESTADO -->
            <tr>
              <td style="padding:0 25px 30px;">

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #444444;">
                  <tr>
                    <td style="padding:20px;">

                      <div style="font-size:12px;letter-spacing:1px;color:#bbbbbb;">
                        ESTADO DEL PEDIDO
                      </div>

                      <div style="padding-top:10px;font-size:17px;font-weight:bold;color:#e5b83e;">
                        ● ${estadoPedido}
                      </div>

                      <p style="margin:12px 0 0;font-size:14px;line-height:1.6;color:#cccccc;">
                        Te mantendremos informado sobre las novedades de tu pedido.
                      </p>

                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- DESPEDI
             -->
            <tr>
              <td style="padding:0 25px 30px;">

                <h2 style="margin:0 0 12px;font-size:21px;color:#e5b83e;">
                  ¡Gracias por confiar en nosotros!
                </h2>

                <p style="margin:0;font-size:15px;line-height:1.8;color:#cccccc;">
                  En NOVA GUET queremos que disfrutes cada compra.
                  Estamos felices de formar parte de tu estilo.
                </p>

              </td>
            </tr>

            <!-- PIE DE PÁGINA -->
            <tr>
              <td align="center" style="padding:25px 20px;background-color:#050505;border-top:1px solid #80621f;">

                <div style="font-size:25px;font-weight:900;letter-spacing:1px;color:#ffffff;">
                  NOVA <span style="color:#e5b83e;">GUET</span>
                </div>

                <p style="margin:10px 0;font-size:11px;letter-spacing:3px;color:#cccccc;">
                  TU ESTILO, TU ESENCIA.
                </p>

                <p style="margin:20px 0 0;font-size:12px;line-height:1.7;color:#999999;">
                  Este correo confirma que recibimos tu pedido.
                  <br>
                  Gracias por comprar en NOVA GUET.
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;

  await transporter.sendMail({
    from: "NOVA GUET <" + process.env.GMAIL_USER + ">",
    to: emailCliente,
    subject: "¡Gracias por tu compra! Pedido #" + numeroPedido + " | NOVA GUET",
    html: htmlCorreo
  });

  console.log(
    "Correo de confirmación enviado a:",
    emailCliente
  );
}

const app = express();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
app.use(express.json());
const PORT = process.env.PORT || 3000;
pool.query("SELECT NOW()")
  .then(() => console.log("✅ PostgreSQL conectado correctamente"))
  .catch((error) => {
    console.error("❌ Error de PostgreSQL:", error.message);
    console.error("Código:", error.code);
  });
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

app.post( "/api/pedidos",
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
const datos = req.body || {};
      const sesionCliente = obtenerClienteSesion(req);

      if (!sesionCliente) {
        return res.status(401).json({
          error: "Debes registrarte o iniciar sesión para realizar un pedido."
        });
      }
     
console.log(
  "EMAIL RECIBIDO:",
  datos.email
);

console.log(
  "EMAIL DENTRO DE CLIENTE:",
  datos.cliente?.email
);
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
clienteId: sesionCliente ? sesionCliente.id : null,
        fecha:
          new Date().toISOString(),
cliente: {
  nombre:
    datos.cliente?.nombre || "",

  telefono:
    datos.cliente?.telefono || "",

  email:
    datos.cliente?.email || ""
},

        nombre:
          datos.cliente?.nombre || "",

        telefono:
          datos.cliente?.telefono || "",

        email:
        datos.cliente?.email || "",

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
console.log(
  "CORREO RECIBIDO:",
  datos.cliente?.email
);
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

enviarCorreoConfirmacion(nuevoPedido).catch(function(error) {
  console.error("Error al enviar el correo:", error.message);
});

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
  async (req, res) => {
    try {
      const pedidos = JSON.parse(
        fs.readFileSync(ordersFile, "utf8")
      );

      const id = String(req.params.id);
      const estado = String(req.body?.estado || "").trim();

      const estadosPermitidos = [
        "Pendiente",
        "Confirmado",
        "Preparando",
        "Enviado",
        "Entregado",
        "Cancelado"
      ];

      if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({
          error: "Estado de pedido inválido."
        });
      }

      const indice = pedidos.findIndex(
        pedido => String(pedido.id) === id
      );

      if (indice === -1) {
        return res.status(404).json({
          error: "Pedido no encontrado."
        });
      }

      const pedido = pedidos[indice];
      const estadoAnterior = pedido.estado || "";

      // Guardar el nuevo estado.
      pedido.estado = estado;

      fs.writeFileSync(
        ordersFile,
        JSON.stringify(pedidos, null, 2)
      );

      // Enviar correo solamente si el estado realmente cambió.
      if (
        estadoAnterior !== estado &&
        (pedido.cliente?.email || pedido.email)
      ) {
        const emailCliente =
          pedido.cliente?.email || pedido.email;

        const mensajesEstado = {
          Pendiente: "Tu pedido está pendiente de confirmación.",
          Confirmado: "¡Tu pedido ha sido confirmado!",
          Preparando: "Estamos preparando tu pedido.",
          Enviado: "¡Tu pedido ha sido enviado!",
          Entregado: "¡Tu pedido aparece como entregado!",
          Cancelado: "Tu pedido ha sido cancelado."
        };

        try {
          await transporter.sendMail({
            from: "NOVA GUET <" + process.env.GMAIL_USER + ">",
            to: emailCliente,
            subject: "Actualización de tu pedido | NOVA GUET",
            text:
              "Hola " +
              (pedido.cliente?.nombre || pedido.nombre || "cliente") +
              ",\n\n" +
              "El estado de tu pedido #" + id + " ha cambiado.\n\n" +
              "Estado anterior: " + (estadoAnterior || "Sin estado") +
              "\nNuevo estado: " + estado +
              "\n\n" + mensajesEstado[estado] +
              "\n\nGracias por comprar en NOVA GUET.",
            html:
              "<div style='background:#111;color:#fff;padding:24px;font-family:Arial,sans-serif'>" +
              "<h2 style='color:#00bfff'>NOVA GUET</h2>" +
              "<p>Hola " +
              String(
                pedido.cliente?.nombre || pedido.nombre || "cliente"
              ).replace(/[&<>"']/g, "") +
              ",</p>" +
              "<p>Hay una actualización en tu pedido <strong>#" +
              String(id).replace(/[&<>"']/g, "") +
              "</strong>.</p>" +
              "<p>Estado anterior: <strong>" +
              String(estadoAnterior || "Sin estado").replace(/[&<>"']/g, "") +
              "</strong></p>" +
              "<p>Nuevo estado: <strong style='color:#00bfff'>" +
              String(estado).replace(/[&<>"']/g, "") +
              "</strong></p>" +
              "<p>" + mensajesEstado[estado] + "</p>" +
              "<p>Gracias por comprar en NOVA GUET.</p>" +
              "</div>"
          });
        } catch (errorCorreo) {
          // El pedido queda actualizado aunque falle el correo.
          console.error(
            "No se pudo enviar el aviso del pedido #" + id + ":",
            errorCorreo.message
          );
        }
      }

      return res.json({
        mensaje: "Estado actualizado correctamente",
        pedido
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "No se pudo actualizar el estado del pedido"
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

/* =========================
   REGISTRO DE CLIENTES
========================= */

function generarHashContrasena(contrasena) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");

    crypto.scrypt(contrasena, salt, 64, (error, clave) => {
      if (error) {
        return reject(error);
      }

      resolve(salt + ":" + clave.toString("hex"));
    });
  });
}

app.post("/api/clientes/registro", async (req, res) => {
  try {
    const nombre = String(req.body?.nombre || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const contrasena = String(req.body?.password || "");

    if (nombre.length < 2 || nombre.length > 100) {
      return res.status(400).json({
        error: "El nombre debe tener entre 2 y 100 caracteres."
      });
    }

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        error: "Introduce un correo electrónico válido."
      });
    }

    if (contrasena.length < 8 || Buffer.byteLength(contrasena, "utf8") > 1024) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 8 caracteres."
      });
    }

    const passwordHash = await generarHashContrasena(contrasena);

    const resultado = await pool.query(
      "INSERT INTO clientes (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, email",
      [nombre, email, passwordHash]
    );

    return res.status(201).json({
      ok: true,
      mensaje: "Cuenta creada correctamente.",
      cliente: resultado.rows[0]
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "Ya existe una cuenta con ese correo electrónico."
      });
    }

    console.error("Error al registrar cliente:", error.message);

    return res.status(500).json({
      error: "No se pudo crear la cuenta. Inténtalo de nuevo."
    });
  }
});

/* =========================================
   SOLICITAR RECUPERACIÓN DE CONTRASEÑA
========================================= */

app.post("/api/clientes/solicitar-recuperacion", async (req, res) => {
  const respuesta = {
    ok: true,
    mensaje:
      "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña."
  };

  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Introduce un correo electrónico válido."
      });
    }

    const resultado = await pool.query(
      "SELECT id, nombre, email FROM clientes WHERE email = $1",
      [email]
    );

    // No revelar si existe una cuenta con ese correo.
    if (resultado.rows.length === 0) {
      return res.json(respuesta);
    }

    const cliente = resultado.rows[0];

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    await pool.query(
      `DELETE FROM recuperacion_contrasenas
       WHERE cliente_id = $1 OR vence_en < NOW() OR usado = TRUE`,
      [cliente.id]
    );

    await pool.query(
      `INSERT INTO recuperacion_contrasenas
       (cliente_id, token_hash, vence_en)
       VALUES ($1, $2, NOW() + INTERVAL '30 minutes')`,
      [cliente.id, tokenHash]
    );

    const baseUrl = (
      process.env.BASE_URL || "http://localhost:3000"
    ).replace(/\/+$/, "");

    const enlace =
      baseUrl +
      "/cuenta.html?restablecer=" +
      encodeURIComponent(token);

    await transporter.sendMail({
      from: "NOVA GUET <" + process.env.GMAIL_USER + ">",
      to: cliente.email,
      subject: "Recupera tu contraseña | NOVA GUET",
      text:
        "Hola " + cliente.nombre + ",\n\n" +
        "Solicitaste recuperar tu contraseña de NOVA GUET.\n\n" +
        "Abre este enlace para crear una nueva contraseña. " +
        "Es válido durante 30 minutos:\n" +
        enlace + "\n\n" +
        "Si no solicitaste este cambio, ignora este correo.",
      html:
        "<div style='background:#111;color:#fff;padding:24px;font-family:Arial,sans-serif'>" +
        "<h2 style='color:#00bfff'>NOVA GUET</h2>" +
        "<p>Hola, " +
        String(cliente.nombre).replace(/[&<>"']/g, "") +
        ". Solicitaste recuperar tu contraseña.</p>" +
        "<p>El enlace es válido durante 30 minutos.</p>" +
        "<p><a href='" + enlace +
        "' style='display:inline-block;background:#00bfff;color:#000;padding:12px 18px;text-decoration:none;font-weight:bold'>" +
        "RECUPERAR CONTRASEÑA</a></p>" +
        "<p>Si no solicitaste este cambio, ignora este correo.</p>" +
        "</div>"
    });

    return res.json(respuesta);
  } catch (error) {
    console.error(
      "Error al solicitar recuperación:",
      error.message
    );

    return res.status(500).json({
      ok: false,
      mensaje: "No se pudo enviar el correo. Inténtalo más tarde."
    });
  }
});
/* =========================================
   RESTABLECER CONTRASEÑA DE CLIENTE
========================================= */

app.post("/api/clientes/restablecer-contrasena", async (req, res) => {
  const token = String(req.body?.token || "");
  const nuevaContrasena = String(req.body?.password || "");

  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return res.status(400).json({
      ok: false,
      mensaje: "El enlace no es válido o ha caducado."
    });
  }

  if (nuevaContrasena.length < 8 || nuevaContrasena.length > 128) {
    return res.status(400).json({
      ok: false,
      mensaje: "La contraseña debe tener entre 8 y 128 caracteres."
    });
  }

  try {
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const resultado = await pool.query(
      `SELECT cliente_id
       FROM recuperacion_contrasenas
       WHERE token_hash = $1
         AND usado = FALSE
         AND vence_en > NOW()
       LIMIT 1`,
      [tokenHash]
    );

    if (resultado.rows.length === 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El enlace no es válido o ha caducado. Solicita uno nuevo."
      });
    }

    const clienteId = resultado.rows[0].cliente_id;
    const nuevoHash = await generarHashContrasena(nuevaContrasena);

    const conexion = await pool.connect();

    try {
      await conexion.query("BEGIN");

      const comprobacion = await conexion.query(
        `SELECT cliente_id
         FROM recuperacion_contrasenas
         WHERE token_hash = $1
           AND usado = FALSE
           AND vence_en > NOW()
         FOR UPDATE`,
        [tokenHash]
      );

      if (comprobacion.rows.length === 0) {
        await conexion.query("ROLLBACK");
        return res.status(400).json({
          ok: false,
          mensaje: "El enlace ya se utilizó o ha caducado."
        });
      }

      await conexion.query(
        "UPDATE clientes SET password_hash = $1 WHERE id = $2",
        [nuevoHash, clienteId]
      );

      await conexion.query(
        `UPDATE recuperacion_contrasenas
         SET usado = TRUE
         WHERE cliente_id = $1`,
        [clienteId]
      );

      await conexion.query("COMMIT");

      return res.json({
        ok: true,
        mensaje: "Contraseña actualizada. Ya puedes iniciar sesión."
      });
    } catch (error) {
      await conexion.query("ROLLBACK");
      throw error;
    } finally {
      conexion.release();
    }
  } catch (error) {
    console.error("Error al restablecer contraseña:", error.message);

    return res.status(500).json({
      ok: false,
      mensaje: "No se pudo actualizar la contraseña. Inténtalo de nuevo."
    });
  }
});


/* CIERRE DE SESION DEL CLIENTE */

app.post("/api/clientes/logout", (req, res) => {
  const esHttps =
    req.headers["x-forwarded-proto"] === "https" ||
    process.env.NODE_ENV === "production";

  const cookie = [
    "novaguet_cliente_session=",
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0"
  ];

  if (esHttps) {
    cookie.push("Secure");
  }

  res.setHeader("Set-Cookie", cookie.join("; "));

  return res.json({
    ok: true,
    mensaje: "Sesion cerrada correctamente."
  });
});

/* =====================================================
   CANCELAR PEDIDO DEL CLIENTE
===================================================== */

app.post("/api/clientes/cancelar-pedido", (req, res) => {
  try {
    const sesion = obtenerClienteSesion(req);

    if (!sesion) {
      return res.status(401).json({
        ok: false,
        mensaje: "Inicia sesión para cancelar un pedido."
      });
    }

    const pedidoId = req.body?.pedidoId;

    if (!pedidoId) {
      return res.status(400).json({
        ok: false,
        mensaje: "Falta el número del pedido."
      });
    }

    const pedidos = JSON.parse(
      fs.readFileSync(ordersFile, "utf8")
    );

    const pedido = pedidos.find(
      p =>
        String(p.id) === String(pedidoId) &&
        String(p.clienteId) === String(sesion.id)
    );

    if (!pedido) {
      return res.status(404).json({
        ok: false,
        mensaje: "No encontramos ese pedido en tu cuenta."
      });
    }

    if (pedido.estado !== "Pendiente") {
      return res.status(400).json({
        ok: false,
        mensaje: "Solo puedes cancelar pedidos pendientes."
      });
    }

    const productos = JSON.parse(
      fs.readFileSync(productsFile, "utf8")
    );

    for (const item of pedido.productos || []) {
      const producto = productos.find(
        p => String(p.id) === String(item.id)
      );

      if (!producto) {
        return res.status(409).json({
          ok: false,
          mensaje:
            "No se pudo completar la cancelación porque falta un producto del inventario. Contacta con la tienda."
        });
      }
    }

    for (const item of pedido.productos || []) {
      const producto = productos.find(
        p => String(p.id) === String(item.id)
      );

      const cantidad = Number(
        item.cantidad || item.quantity || 1
      );

      producto.stock =
        Number(producto.stock || 0) + cantidad;
    }

    pedido.estado = "Cancelado";

    fs.writeFileSync(
      productsFile,
      JSON.stringify(productos, null, 2)
    );

    fs.writeFileSync(
      ordersFile,
      JSON.stringify(pedidos, null, 2)
    );

    return res.json({
      ok: true,
      mensaje: "Pedido cancelado correctamente."
    });
  } catch (error) {
    console.error(
      "Error al cancelar pedido:",
      error.message
    );

    return res.status(500).json({
      ok: false,
      mensaje: "No se pudo cancelar el pedido."
    });
  }
});


/* MIS PEDIDOS DEL CLIENTE */

app.get("/api/clientes/mis-pedidos", (req, res) => {
  try {
    const sesion = obtenerClienteSesion(req);

    if (!sesion) {
      return res.status(401).json({
        ok: false,
        mensaje: "Inicia sesión para consultar tus pedidos."
      });
    }

    const pedidos = JSON.parse(
      fs.readFileSync(ordersFile, "utf8")
    );

    const misPedidos = pedidos.filter(
      pedido => String(pedido.clienteId) === String(sesion.id)
    );

    return res.json({
      ok: true,
      pedidos: misPedidos
    });
  } catch (error) {
    console.error("Error al consultar pedidos:", error.message);

    return res.status(500).json({
      ok: false,
      mensaje: "No se pudieron consultar tus pedidos."
    });
  }
});


/* =========================================================
   INICIAR SERVIDOR
========================================================= */



app.listen(PORT,() => {
    console.log(
      "NOVAGUET funcionando en el puerto " +
      PORT
    );
  }
);
