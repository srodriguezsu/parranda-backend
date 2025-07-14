const db = require('../db');

exports.obtenerVillancicos = async () => {
  const [rows] = await db.query('SELECT * FROM canciones WHERE villancico = 1');
  return rows;
};