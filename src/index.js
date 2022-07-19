require('dotenv').config();
const express = require('express');
const {
  Sequelize, DataTypes, Model,
} = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Pelicula = require('./pelicula');
const Personaje = require('./personaje');
const Genero = require('./genero');
const PeliculaPersonaje = require('./peliculaPersonaje');
const Usuario = require('./usuario');

const app = express();
const port = 3000;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const getTokenFrom = (req) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7);
  }
  return null;
};

Pelicula.setup(sequelize);
Personaje.setup(sequelize);
Genero.setup(sequelize);
PeliculaPersonaje.setup(sequelize);
Usuario.setup(sequelize);

Pelicula.setupAssociation(Personaje);
Personaje.setupAssociation(Pelicula);
Genero.setupAssociation(Pelicula);

app.use(express.json());

app.get('/characters', async (req, res) => {
  const token = getTokenFrom(req);
  // const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  if (req.query) {
    const {
      nombre, edad, peliculas, peso,
    } = req.query;
    const query = {};
    if (peliculas != null) {
      const personajes = await Pelicula.findOne({
        where: {
          titulo: peliculas,
        },
        attributes: {
          exclude: ['id', 'imagen', 'titulo', 'fechaCreacion', 'calificacion', 'fk_genero', 'created_at', 'updated_at'],
        },
        include: {
          model: Personaje,
          as: 'personajes',
          through: 'peliculas_personajes',
        },

      });
      return res.json(personajes);
    }
    if (nombre != null) query.nombre = nombre;
    if (edad != null) query.edad = edad;
    if (peso != null) query.peso = peso;
    const result = await Personaje.findAll({
      where: query,
    });
    return res.json(result);
  }
  const personajes = await Personaje.findAll({
    attributes: ['imagen', 'nombre'],
  });
  return res.status(200).json(personajes);
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

app.get('/movies', async (req, res) => {
  if (req.query.name) {
    const titulo = req.query.name;
    const pelicula = await Pelicula.findOne({
      where: {
        titulo,
      },
    });
    return res.json(pelicula.toJSON());
  } if (req.query.genre) {
    const { genre } = req.query;
    const pelicula = await Pelicula.findAll({
      where: {
        fk_genero: genre,
      },
    });
    return res.json(pelicula);
  } if (req.query.order) {
    const { order } = req.query;
    const peliculas = await Pelicula.findAll({
      order: [['fecha_creacion', order]],
    });
    return res.json(peliculas);
  }
  const peliculas = await Pelicula.findAll({
    attributes: ['imagen', 'titulo', 'fechaCreacion'],
  });
  return res.json(peliculas);
});

app.get('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const pelicula = await Pelicula.findByPk(id, {
    include: {
      model: Personaje,
      as: 'personajes',
      through: 'peliculas_personajes',
    },
  });
  res.json({ pelicula });
});

app.post('/movies', async (req, res) => {
  const data = req.body;
  const pelicula = Pelicula.build(data);
  await pelicula.save();
  res.json(pelicula.toJSON());
});

app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  const pelicula = await Pelicula.findByPk(id);
  await pelicula.update(changes);
  res.json(pelicula.toJSON());
});

app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  await Pelicula.destroy({ where: { id } });
  res.json({ msg: 'deleted' });
});

app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await Usuario.findOne({
    where: {
      username,
    },
  });
  if (existingUser) {
    return res.status(400).json({
      error: 'username must be unique',
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = Usuario.build({
    username,
    passwordHash,
  });
  const savedUser = await user.save();
  return res.status(201).json(savedUser);
});

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Usuario.findOne({
    where: {
      username,
    },
  });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username',
    });
  }
  const userForToken = {
    username: user.username,
    id: user.id,
  };
  const token = jwt.sign(userForToken, process.env.SECRET);
  return res.status(200).send({ token, username });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
