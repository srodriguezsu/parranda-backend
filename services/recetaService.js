const pool = require('../db');

exports.obtenerRecetas = async () => {
    const [rows] = await pool.query('SELECT * FROM recetas');
    return rows;
};

exports.eliminarReceta = async (id) => {
    const [result] = await pool.query('DELETE FROM recetas WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
        throw new Error('Receta no encontrada');
    }

    return { message: 'Receta eliminada correctamente' };
};

exports.crearReceta = async (receta, autorId) => {
    const { titulo, instrucciones, imagen } = receta;
    const [result] = await pool.query(
        'INSERT INTO recetas (titulo, instrucciones, autor, imagen_url) VALUES (?, ?, ?, ?)',
        [titulo, instrucciones, autorId, imagen]
    );

    return { id: result.insertId, ...receta };
}

exports.editarReceta = async (id, receta) => {
    const { titulo, instrucciones, imagen } = receta;

    const [result] = await pool.query(
        'UPDATE recetas SET titulo = ?, instrucciones = ?, imagen_url = ? WHERE id = ?',
        [titulo, instrucciones, imagen, id]
    );

    if (result.affectedRows === 0) {
        throw new Error('Receta no encontrada');
    }

    return { message: 'Receta actualizada correctamente' };
};



exports.obtenerReceta = async (id) => {
    const [rows] = await pool.query('SELECT * FROM recetas WHERE id = ?', [id]);

    if (rows.length === 0) {
        throw new Error('Receta no encontrada');
    }

    return rows[0];
}

// TODO: Preguntar Buscar recetas por titulo o autor