const recetaService = require('../services/recetaService');
const multer = require('multer');
const path = require('path');


// TODO: Finish the functionality to update the image of a recipe

// Configuración de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/recetas') // Asegúrate de crear esta carpeta
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('El archivo debe ser una imagen'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite de 5MB
    }
});

// Obtener todas las recetas
exports.getAll = async (req, res) => {
    try {
        const recetas = await recetaService.obtenerRecetas();
        res.json(recetas);
    } catch (error) {
        console.error('Error al obtener recetas:', error);
        res.status(500).json({ error: 'Error al obtener recetas' });
    }
};

// Obtener una receta por ID
exports.getOne = async (req, res) => {
    const { id } = req.params;

    try {
        const receta = await recetaService.obtenerReceta(id);
        res.json(receta);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        upload.single('imagen')(req, res, async function(err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: 'Error al subir la imagen' });
            } else if (err) {
                return res.status(400).json({ error: err.message });
            }

            const receta = req.body;
            const autorId = req.user.id;

            // Agregar la ruta de la imagen a la receta si se subió una imagen
            if (req.file) {
                receta.imagen = req.file.path;
            }

            try {
                const nuevaReceta = await recetaService.crearReceta(receta, autorId);
                res.status(201).json(nuevaReceta);
            } catch (error) {
                console.error('Error al crear receta:', error);
                res.status(500).json({ error: 'Error al crear la receta' });
            }
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Editar una receta existente
exports.update = async (req, res) => {

    try {
        upload.single('imagen')(req, res, async function(err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: 'Error al subir la imagen' });
            } else if (err) {
                return res.status(400).json({ error: err.message });
            }

            const { id } = req.params;
            const receta = req.body;
            const autorId = req.user.id;

            // Agregar la ruta de la imagen a la receta si se subió una imagen
            if (req.file) {
                receta.imagen = req.file.path;
            }

            try {
                const existeReceta = await recetaService.obtenerReceta(id);

                if (existeReceta.imagen_url) {
                    const fs = require('fs');
                    fs.unlink(existeReceta.imagen_url, (err) => {
                        if (err) {
                            console.error('Error al eliminar la imagen anterior:', err);
                        }
                    });
                }

                const nuevaReceta = await recetaService.editarReceta(id, receta);
                res.status(201).json(nuevaReceta);
            } catch (error) {
                console.error('Error al crear receta:', error);
                res.status(500).json({ error: 'Error al crear la receta' });
            }
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(404).json({ error: error.message });
    }
};

// Eliminar una receta
exports.deleteOne = async (req, res) => {
    const { id } = req.params;

    try {
        const existeReceta = await recetaService.obtenerReceta(id);
        if (existeReceta.imagen_url) {
            const fs = require('fs');
            fs.unlink(existeReceta.imagen_url, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen:', err);
                }
            });
        }
        const resultado = await recetaService.eliminarReceta(id);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};