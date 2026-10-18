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


/* =========================
   INICIO DE SESIÓN DE CLIENTES
========================= */

function verificarContrasenaCliente(contrasena, hashGuardado) {
  return new Promise((resolve, reject) => {
    const partes = hashGuardado.split(":");

    if (partes.length !== 2) {
      return resolve(false);
    }

    const salt = partes[0];
    const hashOriginal = Buffer.from(partes[1], "hex");

    crypto.scrypt(contrasena, salt, 64, (error, clave) => {
      if (error) {
        return reject(error);
      }

      if (clave.length !== hashOriginal.length) {
        return resolve(false);
      }

      resolve(crypto.timingSafeEqual(clave, hashOriginal));
    });
  });
}

function crearTokenSesionCliente(clienteId) {
  const datos =
    "NOVAGUET_CLIENTE:" +
    clienteId +
    ":" +
    Date.now() +
    ":" +
    crypto.randomBytes(32).toString("hex");

  const firma = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(datos)
    .digest("hex");

  return Buffer.from(datos + "." + firma).toString("base64url");
}

function obtenerClienteSesion(req) {
  const cookies = req.headers.cookie || "";
  const coincidencia = cookies.match(
    /(?:^|;\s*)novaguet_cliente_session=([^;]+)/
  );

app.get("/api/clientes/sesion", async (req, res) => {
  try {
    const sesion = obtenerClienteSesion(req);

    if (!sesion) {
      return res.status(401).json({
        ok: false,
        mensaje: "No hay una sesión activa."
      });
    }

    const resultado = await pool.query(
      "SELECT id, nombre, email FROM clientes WHERE id = $1",
      [sesion.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        ok: false,
        mensaje: "La cuenta no existe."
      });
    }

    return res.json({
      ok: true,
      cliente: resultado.rows[0]
    });
  } catch (error) {
    console.error("Error al comprobar la sesión:", error.message);

    return res.status(500).json({
      ok: false,
      mensaje: "No se pudo comprobar la sesión."
    });
  }
});

  if (!coincidencia) return null;

  try {
    const token = decodeURIComponent(coincidencia[1]);
    const decodificado = Buffer.from(token, "base64url").toString("utf8");
    const separador = decodificado.lastIndexOf(".");

    if (separador === -1) return null;

    const datos = decodificado.substring(0, separador);
    const firma = decodificado.substring(separador + 1);

    const firmaEsperada = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(datos)
      .digest("hex");

    if (firma.length !== firmaEsperada.length) return null;

    if (
      !crypto.timingSafeEqual(
        Buffer.from(firma),
        Buffer.from(firmaEsperada)
      )
    ) {
      return null;
    }

    const partes = datos.split(":");

    if (partes.length !== 4 || partes[0] !== "NOVAGUET_CLIENTE") {
      return null;
    }

    if (!/^\d+$/.test(partes[1])) return null;

    const fecha = Number(partes[2]);

    if (!Number.isSafeInteger(fecha)) return null;
    if (fecha > Date.now() + 60000) return null;
    if (Date.now() - fecha > 86400000) return null;

    return { id: partes[1] };
  } catch (error) {
    return null;
  }
}

app.post("/api/clientes/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    const contrasena = String(req.body?.password || "");

    if (!email || !contrasena) {
      return res.status(400).json({
        error: "Introduce tu correo y contraseña."
      });
    }

    const resultado = await pool.query(
      "SELECT id, nombre, email, password_hash FROM clientes WHERE email = $1",
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        error: "Correo o contraseña incorrectos."
      });
    }

    const cliente = resultado.rows[0];

    const valida = await verificarContrasenaCliente(
      contrasena,
      cliente.password_hash
    );

    if (!valida) {
      return res.status(401).json({
        error: "Correo o contraseña incorrectos."
      });
    }

    const token = crearTokenSesionCliente(cliente.id);

    const esHttps =
      req.headers["x-forwarded-proto"] === "https" ||
      process.env.NODE_ENV === "production";

    const cookie = [
      "novaguet_cliente_session=" + encodeURIComponent(token),
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      "Max-Age=86400"
    ];

    if (esHttps) {
      cookie.push("Secure");
    }

    res.setHeader("Set-Cookie", cookie.join("; "));

    return res.json({
      ok: true,
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        email: cliente.email
      }
    });
  } catch (error) {
    console.error("Error en el inicio de sesión del cliente:", error.message);

    return res.status(500).json({
      error: "No se pudo iniciar sesión. Inténtalo de nuevo."
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
