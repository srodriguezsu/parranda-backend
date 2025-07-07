const {verify} = require("jsonwebtoken");

exports.jwtMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del header Authorization

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        req.user = verify(token, process.env.JWT_SECRET); // Guardar la información del usuario decodificada en el request
        next(); // Llamar al siguiente middleware o ruta
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(401).json({ error: 'Token inválido' });
    }
}