const musicaService = require('../services/villancicoService');

exports.getAll = async (req, res) => {
  try {
    const villancicos = await musicaService.obtenerVillancicos();
    res.json(villancicos);
  } catch (error) {
    console.error('Error al obtener villancicos:', error);
    res.status(500).json({ mensaje: 'Error al obtener villancicos' });
  }
};