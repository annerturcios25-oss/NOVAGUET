  const formulario = document.getElementById("formulario");
  const campoNombre = document.getElementById("campoNombre");
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const botonLogin = document.getElementById("botonLogin");
  const botonRegistro = document.getElementById("botonRegistro");
  const botonEnviar = document.getElementById("botonEnviar");
  const botonOlvide = document.getElementById("botonOlvide");
  const mensaje = document.getElementById("mensaje");

  let modo = "login";

  function mostrarMensaje(texto) {
    mensaje.textContent = texto || "";
  }

  async function leerRespuesta(respuesta) {
    try {
      return await respuesta.json();
    } catch {
      return {};
    }
  }

  function cambiarModo(nuevoModo) {
    modo = nuevoModo;
    const esRegistro = modo === "registro";

    campoNombre.classList.toggle("oculto", !esRegistro);
    nombre.required = esRegistro;

    password.autocomplete = esRegistro
      ? "new-password"
      : "current-password";

    botonLogin.classList.toggle("activa", !esRegistro);
    botonRegistro.classList.toggle("activa", esRegistro);

    botonEnviar.textContent = esRegistro
      ? "Crear cuenta"
      : "Iniciar sesión";

    botonOlvide.style.display = esRegistro ? "none" : "block";

    mostrarMensaje("");
  }

  botonLogin.addEventListener("click", () => cambiarModo("login"));
  botonRegistro.addEventListener("click", () => cambiarModo("registro"));

  // =====================================
  // RECUPERACIÓN DE CONTRASEÑA
  // =====================================

  botonOlvide.addEventListener("click", async () => {
    const correo = email.value.trim().toLowerCase();

    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      mostrarMensaje("Escribe tu correo electrónico en el campo de arriba.");
      email.focus();
      return;
    }

    mostrarMensaje("Enviando solicitud...");
    botonOlvide.disabled = true;

    try {
      const respuesta = await fetch(
        "/api/clientes/solicitar-recuperacion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ email: correo })
        }
      );

      const resultado = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        mostrarMensaje(
          resultado.mensaje ||
          resultado.error ||
          "No se pudo enviar la solicitud. Inténtalo más tarde."
        );
        return;
      }

      mostrarMensaje(
        resultado.mensaje ||
        "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña."
      );

    } catch (error) {
      console.error("ERROR RECUPERACIÓN:", error);

      mostrarMensaje(
        "No se pudo conectar con NOVAGUET. Inténtalo de nuevo."
      );

    } finally {
      botonOlvide.disabled = false;
    }
  });

  // =====================================
  // LOGIN Y REGISTRO
  // =====================================

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    mostrarMensaje("");
    botonEnviar.disabled = true;

    const datos = {
      email: email.value.trim().toLowerCase(),
      password: password.value
    };

    let ruta = "/api/clientes/login";

    if (modo === "registro") {
      datos.nombre = nombre.value.trim();
      ruta = "/api/clientes/registro";
    }

    try {
      const respuesta = await fetch(ruta, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(datos)
      });

      const resultado = await leerRespuesta(respuesta);

      // LOGIN O REGISTRO INCORRECTO
      if (!respuesta.ok || resultado.ok === false) {
        mostrarMensaje(
          resultado.error ||
          resultado.mensaje ||
          "Correo o contraseña incorrectos."
        );

        // Mantener el correo y permitir corregir la contraseña.
        password.value = "";
        password.focus();
        return;
      }

      // REGISTRO CORRECTO
      if (modo === "registro") {
        formulario.reset();
        cambiarModo("login");

        mostrarMensaje(
          resultado.mensaje ||
          "Cuenta creada correctamente. Ahora inicia sesión."
        );

        email.focus();
        return;
      }

      // LOGIN CORRECTO
      const destino = new URLSearchParams(
        window.location.search
      ).get("return");

      if (destino === "checkout") {
        window.location.href = "index.html?return=checkout";
      } else {
        window.location.href = "mis-pedidos.html";
      }

    } catch (error) {
      console.error("ERROR LOGIN:", error);

      mostrarMensaje(
        "No se pudo conectar con NOVAGUET. Inténtalo de nuevo."
      );

    } finally {
      botonEnviar.disabled = false;
    }
  });

  // =====================================
  // RESTABLECER CONTRASEÑA
  // =====================================

  const seccionRestablecer =
    document.getElementById("seccionRestablecer");

  const formularioRestablecer =
    document.getElementById("formularioRestablecer");

  const mensajeRestablecer =
    document.getElementById("mensajeRestablecer");

  const tokenRecuperacion = new URLSearchParams(
    window.location.search
  ).get("restablecer");

  if (tokenRecuperacion) {
    formulario.classList.add("oculto");
    botonLogin.classList.add("oculto");
    botonRegistro.classList.add("oculto");
    botonOlvide.classList.add("oculto");

    seccionRestablecer.classList.remove("oculto");
  }

  formularioRestablecer.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensajeRestablecer.textContent = "";

    const nueva =
      document.getElementById("nuevaPassword").value;

    const confirmar =
      document.getElementById("confirmarPassword").value;

    const boton =
      document.getElementById("botonRestablecer");

    if (nueva !== confirmar) {
      mensajeRestablecer.textContent =
        "Las contraseñas no coinciden.";
      return;
    }

    boton.disabled = true;

    try {
      const respuesta = await fetch(
        "/api/clientes/restablecer-contrasena",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            token: tokenRecuperacion,
            password: nueva
          })
        }
      );

      const resultado = await leerRespuesta(respuesta);

      mensajeRestablecer.textContent =
        resultado.mensaje ||
        resultado.error ||
        "No se pudo actualizar la contraseña.";

      if (respuesta.ok && resultado.ok !== false) {
        formularioRestablecer.reset();

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }

    } catch (error) {
      console.error("ERROR RESTABLECIMIENTO:", error);

      mensajeRestablecer.textContent =
        "No se pudo conectar con NOVAGUET. Inténtalo de nuevo.";

    } finally {
      boton.disabled = false;
    }
  });

  cambiarModo("login");