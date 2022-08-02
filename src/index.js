require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const Genero = require('./module/management/model/genero');
// const Usuario = require('./module/management/model/usuario');

const app = express();

const configureDI = require('./config/di');
const { initPersonajeModule } = require('./module/personaje/module');
const { initPeliculaModule } = require('./module/pelicula/module');
const { initManagementModule } = require('./module/management/module');

const port = process.env.PORT || 8000;

const getTokenFrom = (req) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7);
  }
  return null;
};

// Genero.setup(sequelize);
// Usuario.setup(sequelize);

// Genero.setupAssociation(Pelicula);

app.use(express.json());
const container = configureDI();
initPersonajeModule(app, container);
initPeliculaModule(app, container);
initManagementModule(app, container);

// app.get('/characters', async (req, res) => {
//   const token = getTokenFrom(req);

//   if (!token) {
//     return res.status(401).json({ error: 'token missing or invalid' });
//   }

//   const decodedToken = jwt.verify(token, process.env.SECRET);
//   if (!decodedToken.id) {
//     return res.status(401).json({
//       error: 'token missing or invalid',
//     });
//   }
//   const queryObjectIsEmpty = Object.keys(req.query).length === 0;
//   if (!queryObjectIsEmpty) {
//     const {
//       nombre, edad, peliculas, peso,
//     } = req.query;
//     const query = {};
//     if (nombre != null) query.nombre = nombre;
//     if (edad != null) query.edad = edad;
//     if (peso != null) query.peso = peso;
//     const personajesAsociados = await getFilteredCharacters(query, peliculas);
//     return res.json(personajesAsociados);
//   }
//   const personajes = await getAll();
//   return res.status(200).json(personajes);
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
