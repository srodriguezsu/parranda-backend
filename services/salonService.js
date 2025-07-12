const db = require('../db');

exports.obtenerCanciones = async () => {
  const [rows] = await db.query('SELECT * FROM canciones');
  return rows;
};