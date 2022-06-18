/* eslint-disable no-param-reassign */
// PostgreSQL Error Codes https://www.postgresql.org/docs/12/errcodes-appendix.html
const { Pool } = require('pg');

const pool = new Pool({
  connectionTimeoutMillis: 60000,
  max: process.env.MAX_CONN || 2,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error', err);
});

module.exports = {
  query: (query, params) => pool.query(query, params),
};
