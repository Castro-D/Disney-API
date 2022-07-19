const Usuario = require('../../usuario');

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      Usuario.setup(queryInterface.sequelize),

      Usuario.sync(),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios', { cascade: true });
  },
};
