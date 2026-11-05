require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function iniciarTablas() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(254) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    console.log("✅ Tabla de clientes comprobada correctamente.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS recuperacion_contrasenas (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        cliente_id BIGINT NOT NULL
          REFERENCES clientes(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        vence_en TIMESTAMPTZ NOT NULL,
        usado BOOLEAN NOT NULL DEFAULT FALSE,
        creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    console.log("✅ Tabla de recuperación creada correctamente.");
  } catch (error) {
    console.error(
      "❌ Error al preparar las tablas:",
      error.code || error.message
    );
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

iniciarTablas();