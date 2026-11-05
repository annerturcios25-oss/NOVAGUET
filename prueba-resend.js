const { Resend } = require("resend");

async function probarCorreo() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Falta RESEND_API_KEY en el archivo .env");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: "NOVA GUET <pedidos@novaguet.com>",
    to: "annerturcios19@gmail.com",
    subject: "Prueba de correo | NOVA GUET",
    text: "Prueba de envío de NOVA GUET mediante Resend."
  });

  if (error) {
    throw new Error(error.message);
  }

  console.log("Correo aceptado por Resend. ID:", data.id);
}

probarCorreo().catch((error) => {
  console.error("Error en la prueba:", error.message);
  process.exitCode = 1;
});