const PersonajeController = require('./controller/personajeController');
const PersonajeService = require('./service/personajeService');
const PersonajeRepository = require('./repository/personajeRepository');
const PersonajeModel = require('./model/personaje');
const PeliculaPersonajeModel = require('./model/peliculaPersonaje');

const PeliculaModel = require('../pelicula/model/pelicula');

module.exports = {
  PersonajeController,
  PersonajeService,
  PersonajeRepository,
  PersonajeModel,
  PeliculaPersonajeModel,
  PeliculaModel,
};
