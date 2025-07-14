const db = require('../db');

exports.obtenerCanciones = async () => {
  const [rows] = await db.query('SELECT titulo, artista, url FROM canciones WHERE villancico = 0');
  return rows;
};