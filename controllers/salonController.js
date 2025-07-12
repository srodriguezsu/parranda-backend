const musicaService = require('../services/salonService');

exports.getAll = async (req, res) => {
  try {
    const canciones = await musicaService.obtenerCanciones();
    res.json(canciones);
  } catch (error) {
    console.error('Error al obtener canciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener canciones' });
  }
};