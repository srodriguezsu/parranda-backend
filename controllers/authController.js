const {autenticarUsuario, crearUsuario} = require("../services/userService");
const {sign} = require("jsonwebtoken");

exports.login = async (req, res, next) => {

    const { email, password } = req.body;

    try {
        const usuario = await autenticarUsuario(email, password);
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = sign(
            usuario,
            process.env.JWT_SECRET,
            { expiresIn: '12h' } // El token expira en 12 horas
        );

        res.json({ message: 'Inicio de sesión exitoso', usuario, token   });
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

exports.registro = async (req, res) => {
    console.log(req.body);
    const { nombre, email, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
    }

    try {
        const nuevoUsuario = await crearUsuario({ nombre, email, password });
        res.status(201).json({ message: 'Usuario creado exitosamente', usuario: nuevoUsuario });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
}