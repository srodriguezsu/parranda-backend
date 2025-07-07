const express = require('express');
const {login, registro} = require("./controllers/authController");
const {getAll, update, create, getOne, deleteOne} = require("./controllers/recetaController");
const {jwtMiddleware} = require("./middlewares/authMiddleware");
const app = express();
const port = 3456;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
});

app.post('/login', login)
app.post('/signup', registro)

// Recetas endpoints
app.get('/recetas', getAll)
app.get('/recetas/:id', getOne)
app.post('/recetas', jwtMiddleware, create)
app.patch('/recetas/:id', jwtMiddleware, update)
app.delete('/recetas/:id', jwtMiddleware, deleteOne)


app.get('/self', jwtMiddleware, (req, res) => {
    res.json({ message: 'Ruta protegida, usuario autenticado', user: req.user });
})


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});