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
} = require('../module/personaje/module');

const {
  PeliculaController,
  PeliculaService,
  PeliculaRepository,
  PeliculaModel,
} = require('../module/pelicula/module');

const {
  ManagementController,
  ManagementService,
  ManagementRepository,
  UserModel,
  GeneroModel,
} = require('../module/management/module');

function configureSequelizeDatabase() {
  if (process.env.NODE_ENV === 'development') {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
    });
  }
  return new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
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

function configureUserModel(container) {
  return UserModel.setup(container.get('Sequelize'));
}

function configureGeneroModel(container) {
  return GeneroModel.setup(container.get('Sequelize'));
}

function addPeliculaModuleDefinitions(container) {
  container.add({
    PeliculaController: object(PeliculaController).construct(use('PeliculaService')),
    PeliculaService: object(PeliculaService).construct(use('PeliculaRepository')),
    PeliculaRepository: object(PeliculaRepository).construct(
      use('PeliculaModel'),
      use('PersonajeModel'),
    ),
    PeliculaModel: factory(configurePeliculaModel),
  });
}

function addPersonajeModuleDefinitions(container) {
  container.add({
    PersonajeController: object(PersonajeController).construct(use('PersonajeService')),
    PersonajeService: object(PersonajeService).construct(use('PersonajeRepository')),
    PersonajeRepository: object(PersonajeRepository).construct(
      use('PersonajeModel'),
      use('PeliculaModel'),
      use('PeliculaPersonajeModel'),
    ),
    PersonajeModel: factory(configurePersonajeModel),
    PeliculaPersonajeModel: factory(configurePeliculaPersonajeModel),
  });
}

function addManagementModuleDefinitions(container) {
  container.add({
    ManagementController: object(ManagementController).construct(use('ManagementService')),
    ManagementService: object(ManagementService).construct(use('ManagementRepository')),
    ManagementRepository: object(ManagementRepository).construct(
      use('UserModel'),
    ),
    UserModel: factory(configureUserModel),
    GeneroModel: factory(configureGeneroModel),
  });
}

function setupAssociations(container) {
  const personajeModel = container.get('PersonajeModel');
  const peliculaModel = container.get('PeliculaModel');
  const generoModel = container.get('GeneroModel');

  personajeModel.setupAssociation(peliculaModel);
  peliculaModel.setupAssociation(personajeModel);
  generoModel.setupAssociation(peliculaModel);
}

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addPersonajeModuleDefinitions(container);
  addPeliculaModuleDefinitions(container);
  addManagementModuleDefinitions(container);
  setupAssociations(container);
  return container;
};
