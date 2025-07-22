const pool = require('../db');

exports.obtenerRecetas = async (viewerId) => {
    const [rows] = await pool.query(
        `
            SELECT
                r.*,
                u.nombre_completo AS nombre_autor,
                ROUND((1.0 * SUM(CASE WHEN l.valor = 1 THEN 1 ELSE 0 END) / COUNT(l.valor)) * 5, 1) AS valoracion,
                COALESCE(MAX(CASE WHEN l.usuario_id = ? THEN l.valor END), 0) AS mi_like
            FROM recetas r
                     LEFT JOIN likes l ON r.id = l.receta_id
                     JOIN usuarios u ON u.id = r.autor
            GROUP BY r.id
            ORDER BY r.fecha_creacion DESC;
        `,
        [viewerId]
    );
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



exports.obtenerReceta = async (id, viewerId) => {
    const [rows] = await pool.query(
        `
            SELECT
                r.*,
                u.nombre_completo AS nombre_autor,
                ROUND((1.0 * SUM(CASE WHEN l.valor = 1 THEN 1 ELSE 0 END) / COUNT(l.valor)) * 5, 1) AS valoracion,
                COALESCE(MAX(CASE WHEN l.usuario_id = ? THEN l.valor END), 0) AS mi_like
            FROM recetas r
                     JOIN usuarios u ON u.id = r.autor
                     LEFT JOIN likes l ON r.id = l.receta_id
            WHERE r.id = ?
            GROUP BY r.id
            ORDER BY r.fecha_creacion DESC;
        `,
        [viewerId, id]
    );

    if (rows.length === 0) {
        throw new Error('Receta no encontrada');
    }

    return rows[0];
};


exports.likeReceta = async (id, usuarioId, value) => {
    if (value !== 1 && value !== -1) {
        const error = new Error('Valor de like inválido. Debe ser 1 o -1');
        error.status = 400;
        throw error;
    }

    const [rows] = await pool.query('SELECT * FROM recetas WHERE id = ?', [id]);
    if (rows.length === 0) {
        const error = new Error('Receta no encontrada');
        error.status = 404;
        throw error;
    }

    const receta = rows[0];
    const [likeRows] = await pool.query('SELECT * FROM likes WHERE receta_id = ? AND usuario_id = ?', [id, usuarioId]);
    const tipo = value === 1 ? 'Me gusta' : 'No me gusta';

    if (likeRows.length === 0) {
        // Si no existe, lo creamos
        await pool.query('INSERT INTO likes (receta_id, usuario_id, valor) VALUES (?, ?, ?)', [id, usuarioId, value]);

        return receta;
    }

    if (likeRows[0].value === value) {
        // Si ya existe un like y es con el mismo valor, le indicamos al usuario
        const error = new Error(`Ya le diste ${tipo} a esta receta`);
        error.status = 409;
        throw error;
    } else {
        // Si ya existe un like con ese valor
        await pool.query('UPDATE likes SET valor = ? WHERE receta_id = ? AND usuario_id = ?', [value, id, usuarioId]);
        const [rows] = await pool.query(
            `
            SELECT
                r.*,
                (
                    SELECT COALESCE(l.valor, 0)
                    FROM likes l
                    WHERE l.receta_id = r.id AND l.usuario_id = ?
                    LIMIT 1
                ) AS mi_like,
                (
                    SELECT ROUND((1.0 * SUM(CASE WHEN l2.valor = 1 THEN 1 ELSE 0 END) / COUNT(l2.valor)) * 5, 1)
                    FROM likes l2
                    WHERE l2.receta_id = r.id
                ) AS valoracion
            FROM recetas r
            WHERE r.id = ?
        `,
            [usuarioId, id]
        );
        return rows[0];
    }
}

// TODO: Preguntar Buscar recetas por titulo o autor