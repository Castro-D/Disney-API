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

// ============= repository Personaje functions ===============
async function getAll() {
  const personajes = await Personaje.findAll({
    attributes: ['id', 'imagen', 'nombre'],
  });
  return personajes;
}

async function getFilteredCharacters(query, pelicula = null) {
  if (pelicula != null) {
    const personajes = await Personaje.findAll({
      include: {
        model: Pelicula,
        as: 'peliculas',
        through: 'peliculas_personajes',
        where: {
          id: pelicula,
        },
      },
    });
    return personajes;
  }
  const result = await Personaje.findAll({
    where: query,
  });
  return result;
}

async function getCharacterById(id) {
  const personaje = await Personaje.findByPk(id, {
    include: {
      model: Pelicula,
      as: 'peliculas',
      through: 'peliculas_personajes',
    },
  });
  return personaje;
}

async function save(data) {
  const buildOptions = {
    isNewRecord: !data.id,
  };
  let personajeModel;

  personajeModel = Personaje.build(data, buildOptions);
  personajeModel = await personajeModel.save();
  return personajeModel;
}

async function saveCharactersMovies(peliculas, personaje) {
  peliculas.forEach(async (p) => {
    const pelicula = await Pelicula.findOne({
      where: {
        titulo: p,
      },
    });
    const peliculaPersonaje = PeliculaPersonaje.build({
      fk_pelicula: pelicula.id,
      fk_personaje: personaje.id,
    });
    await peliculaPersonaje.save();
  });
}

async function removeCharacter(id) {
  await Personaje.destroy({ where: { id } });
}

// ============= repository Pelicula functions ===============

async function getAllMovies() {
  const peliculas = await Pelicula.findAll({
    attributes: ['imagen', 'titulo', 'fechaCreacion'],
  });
  return peliculas;
}

async function getFilteredMovies(query) {
  const options = {
    where: {},
  };
  if (query.name) {
    options.where.titulo = query.name;
  }
  if (query.genre) {
    options.where.fk_genero = query.genre;
  }
  if (query.order) {
    options.order = [['fecha_creacion', query.order]];
  }
  const filteredMovies = await Pelicula.findAll(options);
  return filteredMovies;
}

async function getMovieById(id) {
  const pelicula = await Pelicula.findByPk(id, {
    include: {
      model: Personaje,
      as: 'personajes',
      through: 'peliculas_personajes',
    },
  });
  return pelicula;
}

async function saveMovie(data) {
  const buildOptions = {
    isNewRecord: !data.id,
  };
  let peliculaModel;

  peliculaModel = Pelicula.build(data, buildOptions);
  peliculaModel = await peliculaModel.save();
  return peliculaModel;
}

async function deleteMovie(id) {
  await Pelicula.destroy({ where: { id } });
}

app.get('/characters', async (req, res) => {
  const token = getTokenFrom(req);

  if (!token) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid',
    });
  }
  const queryObjectIsEmpty = Object.keys(req.query).length === 0;
  if (!queryObjectIsEmpty) {
    const {
      nombre, edad, peliculas, peso,
    } = req.query;
    const query = {};
    if (nombre != null) query.nombre = nombre;
    if (edad != null) query.edad = edad;
    if (peso != null) query.peso = peso;
    const personajesAsociados = await getFilteredCharacters(query, peliculas);
    return res.json(personajesAsociados);
  }
  const personajes = await getAll();
  return res.status(200).json(personajes);
});

app.get('/characters/:id', async (req, res) => {
  const { id } = req.params;
  const personaje = await getCharacterById(id);
  res.status(200).json({ data: personaje });
});

app.post('/characters', async (req, res) => {
  const personaje = req.body;
  const { peliculas } = personaje;
  const newPersonaje = await save(personaje);
  if (peliculas) {
    saveCharactersMovies(peliculas, newPersonaje);
  }
  res.status(200).json(newPersonaje.toJSON());
});

app.put('/characters/:id', async (req, res) => {
  const { id } = req.params;
  const personaje = req.body;
  personaje.id = id;
  const savedPersonaje = await save(personaje);
  res.status(200).json(savedPersonaje.toJSON());
});

app.delete('/characters/:id', async (req, res) => {
  const { id } = req.params;
  await removeCharacter(id);
  res.status(200).json({ deleted: 'true' });
});

app.get('/movies', async (req, res) => {
  const queryObjectIsEmpty = Object.keys(req.query).length === 0;
  if (!queryObjectIsEmpty) {
    const movies = await getFilteredMovies(req.query);
    return res.json({ movies });
  }

  const peliculas = await getAllMovies();
  return res.json(peliculas);
});

app.get('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const pelicula = await getMovieById(id);
  res.json({ pelicula });
});

app.post('/movies', async (req, res) => {
  const data = req.body;
  const pelicula = await saveMovie(data);
  res.json(pelicula.toJSON());
});

app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const pelicula = req.body;
  pelicula.id = id;
  const savedPelicula = await saveMovie(pelicula);
  res.json(savedPelicula);
});

app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  await deleteMovie(id);
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
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 });
  return res.status(200).send({ token, username });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
