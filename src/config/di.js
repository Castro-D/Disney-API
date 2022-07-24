const {
  default: DIContainer, object, use, factory,
} = require('rsdi');

require('dotenv').config();

const { Sequelize } = require('sequelize');
const {
  PersonajeController,
  PersonajeService,
  PersonajeRepository,
  PersonajeModel,
  PeliculaPersonajeModel,
  PeliculaModel,
} = require('../module/personaje/module');

function configureSequelizeDatabase() {
  return new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
  });
}

function addCommonDefinitions(container) {
  container.add({
    Sequelize: factory(configureSequelizeDatabase),
  });
}

function configurePersonajeModel(container) {
  return PersonajeModel.setup(container.get('Sequelize'));
}

function configurePeliculaPersonajeModel(container) {
  return PeliculaPersonajeModel.setup(container.get('Sequelize'));
}

function configurePeliculaModel(container) {
  return PeliculaModel.setup(container.get('Sequelize'));
}

function addPersonajeModuleDefinitions(container) {
  container.add({
    PersonajeController: object(PersonajeController).construct(use(PersonajeService)),
    PersonajeService: object(PersonajeService).construct(use(PersonajeRepository)),
    PersonajeRepository: object(PersonajeRepository).construct(
      use('PersonajeModel'),
      use('PeliculaModel'),
      use('PeliculaPersonajeModel'),
    ),
    PersonajeModel: factory(configurePersonajeModel),
    PeliculaPersonajeModel: factory(configurePeliculaPersonajeModel),
    PeliculaModel: factory(configurePeliculaModel),
  });
}

function setupAssociations(container) {
  const personajeModel = container.get('ProductModel');
  const peliculaModel = container.get('PeliculaModel');

  personajeModel.setupAssociation(peliculaModel);
  peliculaModel.setupAssociation(personajeModel);
}

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addPersonajeModuleDefinitions(container);
  setupAssociations(container);
  return container;
};
