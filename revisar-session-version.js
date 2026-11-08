require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function revisar() {
  try {
    const resultado = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'clientes'
      AND column_name = 'session_version';
    `);

    console.log(
      "session_version existe:",
      resultado.rows.length > 0
    );
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await pool.end();
  }
}

revisar();