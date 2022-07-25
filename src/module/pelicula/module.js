const PeliculaController = require('./controller/peliculaController');
const PeliculaService = require('./service/peliculaService');
const PeliculaRepository = require('./repository/peliculaRepository');
const PeliculaModel = require('./model/pelicula');

function initPeliculaModule(app, container) {
  const controller = container.get('PeliculaController');
  controller.configureRoutes(app);
}

module.exports = {
  PeliculaController,
  PeliculaService,
  PeliculaRepository,
  PeliculaModel,
  initPeliculaModule,
};
