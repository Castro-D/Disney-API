const ManagementController = require('./controller/managementController');
const ManagementService = require('./service/managementService');
const ManagementRepository = require('./repository/managementRepository');
const UserModel = require('./model/usuario');
const GeneroModel = require('./model/genero');

function initManagementModule(app, container) {
  const controller = container.get('ManagementController');
  controller.configureRoutes(app);
}

module.exports = {
  ManagementController,
  ManagementService,
  ManagementRepository,
  UserModel,
  GeneroModel,
  initManagementModule,
};
