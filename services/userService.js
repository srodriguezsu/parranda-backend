const pool = require('../db');
const bcrypt = require('bcrypt');

exports.crearUsuario = async (usuario) => {
    const { nombre, email, password } = usuario;

    // hashear la clave antes de guardarla
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre_completo, correo, clave_hasheada) VALUES (?, ?, ?)',
        [nombre, email, hashedPassword]
    );

    return { id: result.insertId, ...usuario };
}

exports.autenticarUsuario = async (email, password) => {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE correo = ?',
        [email]
    );
    if (rows.length === 0) {
        return null; // Usuario no encontrado
    }

    const usuario = rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.clave_hasheada);

    if (!passwordValida) {
        return null;
    }

    // Autenticación exitosa
    return {
        id: usuario.id,
        nombre: usuario.nombre_completo,
        email: usuario.correo
    };
};