require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function revisar() {
  try {
    const resultado = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.table(resultado.rows);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await pool.end();
  }
}

revisar();
