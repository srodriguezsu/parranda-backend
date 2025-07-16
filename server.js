const express = require('express');
const cors = require('cors');
const {login, registro} = require("./controllers/authController");
const recetaController = require("./controllers/recetaController");
const {jwtMiddleware} = require("./middlewares/authMiddleware");
const musicaController = require('./controllers/salonController');
const villancicoController = require('./controllers/villancicoController');
const app = express();
const port = 3456;

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173']
}));



app.post('/login', login)
app.post('/signup', registro)

// Recetas endpoints
app.get('/recetas', recetaController.getAll)
app.get('/recetas/:id', recetaController.getOne)
app.post('/recetas', jwtMiddleware, recetaController.create)
app.put('/recetas/:id', jwtMiddleware, recetaController.update)
app.delete('/recetas/:id', jwtMiddleware, recetaController.deleteOne)
app.post('/recetas/:id/like', jwtMiddleware, recetaController.like )
app.post('/recetas/:id/dislike', jwtMiddleware, recetaController.dislike )
app.use('/uploads', express.static('uploads'));

// Salon endpoints
app.get('/musica', musicaController.getAll)

// Villancicos endpoints
app.get('/villancicos', villancicoController.getAll);

app.get('/self', jwtMiddleware, (req, res) => {
    res.json({ message: 'Ruta protegida, usuario autenticado', user: req.user });
})

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});