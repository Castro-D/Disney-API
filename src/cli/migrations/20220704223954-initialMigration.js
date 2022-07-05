const Pelicula = require('../../pelicula');
const Genero = require('../../genero');
const Personaje = require('../../personaje');
const PeliculaPersonaje = require('../../peliculaPersonaje');

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      Pelicula.setup(queryInterface.sequelize),
      Personaje.setup(queryInterface.sequelize),
      Genero.setup(queryInterface.sequelize),
      PeliculaPersonaje.setup(queryInterface.sequelize),

      Pelicula.sync(),
      Personaje.sync(),
      Genero.sync(),
      PeliculaPersonaje.sync(),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('peliculas', { cascade: true });
    await queryInterface.dropTable('personajes', { cascade: true });
    await queryInterface.dropTable('generos', { cascade: true });
    await queryInterface.dropTable('peliculas_personajes', { cascade: true });
  },
};
