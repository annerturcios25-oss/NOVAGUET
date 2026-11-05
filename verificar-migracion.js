require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verificar() {
  try {
    const productos = await pool.query("SELECT COUNT(*) AS total FROM productos");
    const pedidos = await pool.query("SELECT COUNT(*) AS total FROM pedidos");

    console.log("PRODUCTOS:", productos.rows[0].total);
    console.log("PEDIDOS:", pedidos.rows[0].total);
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await pool.end();
  }
}

verificar();