require("dotenv").config();

const fs = require("fs");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const productos = JSON.parse(
  fs.readFileSync("./products.json", "utf8")
);

const pedidos = JSON.parse(
  fs.readFileSync("./orders.json", "utf8")
);

async function migrar() {
  const client = await pool.connect();

  try {
    if (!Array.isArray(productos) || !Array.isArray(pedidos)) {
      throw new Error("Los archivos JSON no tienen el formato esperado.");
    }

    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id BIGINT PRIMARY KEY,
        datos JSONB NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id BIGINT PRIMARY KEY,
        datos JSONB NOT NULL
      )
    `);

    const existentes = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM productos) AS productos,
        (SELECT COUNT(*) FROM pedidos) AS pedidos
    `);

    if (
      Number(existentes.rows[0].productos) > 0 ||
      Number(existentes.rows[0].pedidos) > 0
    ) {
      throw new Error(
        "Las tablas ya contienen datos. Se cancela la migración para protegerlos."
      );
    }

    for (const producto of productos) {
      if (producto.id == null) {
        throw new Error("Hay un producto sin ID.");
      }

      await client.query(
        `INSERT INTO productos (id, datos)
         VALUES ($1, $2::jsonb)`,
        [String(producto.id), JSON.stringify(producto)]
      );
    }

    for (const pedido of pedidos) {
      if (pedido.id == null) {
        throw new Error("Hay un pedido sin ID.");
      }

      await client.query(
        `INSERT INTO pedidos (id, datos)
         VALUES ($1, $2::jsonb)`,
        [String(pedido.id), JSON.stringify(pedido)]
      );
    }

    await client.query("COMMIT");

    console.log("Migración completada.");
    console.log("Productos copiados:", productos.length);
    console.log("Pedidos copiados:", pedidos.length);

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migración cancelada:", error.message);

  } finally {
    client.release();
    await pool.end();
  }
}

migrar();