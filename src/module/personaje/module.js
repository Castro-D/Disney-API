const PersonajeController = require('./controller/personajeController');
const PersonajeService = require('./service/personajeService');
const PersonajeRepository = require('./repository/personajeRepository');
const PersonajeModel = require('./model/personaje');
const PeliculaPersonajeModel = require('./model/peliculaPersonaje');

function initPersonajeModule(app, container) {
  const controller = container.get('PersonajeController');
  controller.configureRoutes(app);
}

module.exports = {
  PersonajeController,
  PersonajeService,
  PersonajeRepository,
  PersonajeModel,
  PeliculaPersonajeModel,
  initPersonajeModule,
};
