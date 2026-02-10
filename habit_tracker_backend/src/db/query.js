const { pool } = require('./pool');

/**
 * Execute a parameterized SQL query.
 * @param {string} text SQL query text with $1..$n parameters
 * @param {any[]} params bound parameters
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params = []) {
  return pool.query(text, params);
}

module.exports = {
  query,
};
