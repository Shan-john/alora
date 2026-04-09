const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`[SQL] executed query in ${duration}ms:`, text.replace(/\s+/g, ' ').trim().slice(0, 100));
    return res;
  } catch (err) {
    console.error(`[SQL Error]: ${err.message}`);
    throw err;
  }
}

async function getClient() {
  const client = await pool.connect();
  return client;
}

module.exports = {
  pool,
  query,
  getClient
};
