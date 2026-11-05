require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function revisarColumnas() {
  try {
    const sql = 'SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 ORDER BY ordinal_position';

    const resultado = await pool.query(sql, ['public', 'clientes']);

    console.log('Columnas de la tabla clientes:');
    console.table(resultado.rows);

  } catch (error) {
    console.error('Error:', error.message);

  } finally {
    await pool.end();
  }
}

revisarColumnas();