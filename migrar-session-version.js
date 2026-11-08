require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrar() {
  try {
    await pool.query(`
      ALTER TABLE clientes
      ADD COLUMN IF NOT EXISTS session_version
      INTEGER NOT NULL DEFAULT 0;
    `);

    console.log("Columna session_version creada correctamente.");
  } catch (error) {
    console.error("Error en migración:", error.message);
  } finally {
    await pool.end();
  }
}

migrar();