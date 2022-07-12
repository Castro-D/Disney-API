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

app.use(express.json());

app.get('/characters', async (req, res) => {
  const personajes = await Personaje.findAll({
    attributes: ['imagen', 'nombre'],
  });
  res.status(200).json(personajes);
});

app.get('/characters/:id', async (req, res) => {
  const { id } = req.params;
  const personaje = await Personaje.findByPk(id, {
    include: {
      model: Pelicula,
      as: 'peliculas',
      through: 'peliculas_personajes',
    },
  });
  res.status(200).json({ data: personaje });
});

app.post('/characters', async (req, res) => {
  const personaje = req.body;
  const { peliculas } = personaje;
  const newPersonaje = Personaje.build(personaje);
  await newPersonaje.save();
  if (peliculas) {
    peliculas.forEach(async (p) => {
      const pelicula = await Pelicula.findOne({
        where: {
          titulo: p.titulo,
        },
      });
      const peliculaPersonaje = PeliculaPersonaje.build({
        fk_pelicula: pelicula.id,
        fk_personaje: newPersonaje.id,
      });
      await peliculaPersonaje.save();
    });
  }
  res.status(200).json(newPersonaje.toJSON());
});

app.put('/characters/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const personaje = await Personaje.findByPk(id);
  await personaje.update(data);
  res.status(200).json(personaje.toJSON());
});

app.delete('/characters/:id', async (req, res) => {
  const { id } = req.params;
  await Personaje.destroy({ where: { id } });
  res.status(200).json({ deleted: 'true' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
