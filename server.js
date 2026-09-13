const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();

const PORT = process.env.PORT || 3000;

/* =========================
   CONTRASEÑA ADMINISTRADOR
========================= */
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; 
const crypto = require("crypto");

const sesiones = new Set();

function obtenerCookie(req, nombre) {
  const cookies = req.headers.cookie || "";

  const encontrada = cookies
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(nombre + "="));

  if (!encontrada) {
    return null;
  }

  return decodeURIComponent(
    encontrada.substring(nombre.length + 1)
  );
}

/* =========================
   AUTENTICACIÓN
========================= */
function protegerAdmin(req, res, next) {

  const token = obtenerCookie(

    req,

    "novaguet_session"

  );

  if (

    !token ||

    !sesiones.has(token)

  ) {

    if (

      req.path === "/admin.html"

    ) {

      return res.redirect(

        "/login.html"

      );

    }

    return res.status(401).json({

      error:

        "No autorizado"

    });

  }

  next();

}
/* =========================
   CARPETA DE IMÁGENES
========================= */

const imagesFolder =
  path.join(
    __dirname,
    "public",
    "images"
  );

if (!fs.existsSync(imagesFolder)) {

  fs.mkdirSync(
    imagesFolder,
    {
      recursive: true
    }
  );

}

/* =========================
   CONFIGURAR SUBIDA
========================= */

const storage =
  multer.diskStorage({

    destination: (req, file, cb) => {

      cb(
        null,
        imagesFolder
      );

    },

    filename: (req, file, cb) => {

      const extension =
        path.extname(
          file.originalname
        );

      const nombreSeguro =
        path.basename(
          file.originalname,
          extension
        )
        .toLowerCase()
        .replace(
          /[^a-z0-9]/g,
          "-"
        )
        .replace(
          /-+/g,
          "-"
        );

      const nombreFinal =
        String(Date.now()) +
        "-" +
        nombreSeguro +
        extension;

      cb(
        null,
        nombreFinal
      );

    }

  });

const upload =
  multer({

    storage: storage,

    limits: {

      fileSize:
        5 * 1024 * 1024

    },

    fileFilter:
      (req, file, cb) => {

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

          cb(
            null,
            true
          );

        } else {

          cb(
            new Error(
              "Solo se permiten imágenes JPG, PNG o WEBP."
            )
          );

        }

      }

  });

/* =========================
   PERMITIR JSON
========================= */

app.use(
  express.json()
);

/*=========================

   LOGIN ADMIN

========================= */

app.post(

  "/api/login",

  (req, res) => {

    const {

      username,

      password

    } = req.body;

    if (

      username !== ADMIN_USER ||

      password !== ADMIN_PASSWORD

    ) {

      return res.status(401).json({

        error:

          "Usuario o contraseña incorrectos"

      });

    }

    const token =

      crypto.randomBytes(32).toString("hex");

    sesiones.add(token);

    const secureCookie =

      process.env.NODE_ENV === "production" ||

      process.env.RENDER === "true"

        ? "; Secure"

        : "";

    res.setHeader(

      "Set-Cookie",

      "novaguet_session=" +

        token +

        "; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800" +

        secureCookie

    );

    res.json({

      ok: true

    });

  }

);

/* =========================

   CERRAR SESIÓN ADMIN

========================= */

app.post(

  "/api/logout",

  (req, res) => {

    const token = obtenerCookie(

      req,

      "novaguet_session"

    );

    if (token) {

      sesiones.delete(token);

    }

    res.setHeader(

      "Set-Cookie",

      "novaguet_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0"

    );

    res.json({

      ok: true

    });

  }

);
/* =========================
   PROTEGER PANEL ADMIN
========================= */

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

/* =========================
   ARCHIVOS PÚBLICOS
========================= */

app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);

/* =========================
   ARCHIVO DE PRODUCTOS
========================= */

const productsFile =
  path.join(
    __dirname,
    "products.json"
  );

/* =========================
   CREAR PRODUCTOS INICIALES
========================= */

if (!fs.existsSync(productsFile)) {

  const productosIniciales = [

    {

      id: 1,

      nombre:
        "Camisa de niño PAW PATROL",

      precio:
        700,

      categoria:
        "Ropa",

      talla:
        "2T",

      descripcion:
        "Camisa de niño PAW PATROL",

      imagen:
        "/images/camisa-paw-patrol.jpeg",

      stock:
        10

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

/* =========================
   PÁGINA PRINCIPAL
========================= */

app.get(
  "/",
  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "public",
        "index.html"
      )
    );

  }
);

/* =========================
   OBTENER PRODUCTOS
========================= */

app.get(
  "/api/productos",
  (req, res) => {

    try {

      const productos =
        JSON.parse(

          fs.readFileSync(
            productsFile,
            "utf8"
          )

        );

      res.json(
        productos
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({

        error:
          "No se pudieron cargar los productos"

      });

    }

  }
);

/* =========================
   AGREGAR PRODUCTO
   🔐 PROTEGIDO
========================= */

app.post(
  "/api/productos",
  protegerAdmin,
  upload.single("imagen"),
  (req, res) => {

    try {

      const productos =
        JSON.parse(

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
        Number.isFinite(
          stockRecibido
        )
          ? Math.max(
              0,
              stockRecibido
            )
          : 0;

      const nuevoProducto = {

        id:
          Date.now(),

        nombre:
          req.body.nombre,

        precio:
          Number(req.body.precio),

        categoria:
          req.body.categoria,

        talla:
          req.body.talla,

        descripcion:
          req.body.descripcion,

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

/* =========================
   EDITAR PRODUCTO
   🔐 PROTEGIDO
========================= */

app.put(
  "/api/productos/:id",
  protegerAdmin,
  upload.single("imagen"),
  (req, res) => {

    try {

      const productos =
        JSON.parse(

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
        productoActual.imagen;

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
        Number.isFinite(
          stockRecibido
        )
          ? Math.max(
              0,
              stockRecibido
            )
          : 0;

      productos[indice] = {

        id:
          productoActual.id,

        nombre:
          req.body.nombre,

        precio:
          Number(req.body.precio),

        categoria:
          req.body.categoria,

        talla:
          req.body.talla,

        descripcion:
          req.body.descripcion,

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

/* =========================
   ELIMINAR PRODUCTO
   🔐 PROTEGIDO
========================= */

app.delete(
  "/api/productos/:id",
  protegerAdmin,
  (req, res) => {

    try {

      const productos =
        JSON.parse(

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

/* =========================
   MANEJO DE ERRORES
========================= */

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
   INICIAR SERVIDOR
========================= */

app.listen(
  PORT,
  () => {

    console.log(
      "NOVAGUET funcionando en el puerto " +
      PORT
    );

  }
);