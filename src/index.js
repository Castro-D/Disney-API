require('dotenv').config();
const express = require('express');
const {
  Sequelize, DataTypes, Model,
} = require('sequelize');
const Pelicula = require('./pelicula');
const Personaje = require('./personaje');
const Genero = require('./genero');
const PeliculaPersonaje = require('./peliculaPersonaje');

const app = express();
const port = 3000;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

Pelicula.setup(sequelize);
Personaje.setup(sequelize);
Genero.setup(sequelize);
PeliculaPersonaje.setup(sequelize);

Pelicula.setupAssociation(Personaje);
Personaje.setupAssociation(Pelicula);
Genero.setupAssociation(Pelicula);

app.get('/characters', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
