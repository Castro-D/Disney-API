const Pelicula = require('../../module/pelicula/model/pelicula');
const Genero = require('../../module/management/model/genero');
const Personaje = require('../../module/personaje/model/personaje');
const PeliculaPersonaje = require('../../module/personaje/model/peliculaPersonaje');

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      Genero.setup(queryInterface.sequelize),
      Pelicula.setup(queryInterface.sequelize),
      Personaje.setup(queryInterface.sequelize),
      PeliculaPersonaje.setup(queryInterface.sequelize),

      Pelicula.setupAssociation(Personaje),
      Personaje.setupAssociation(Pelicula),
      Genero.setupAssociation(Pelicula),

      Genero.sync(),
      Pelicula.sync(),
      Personaje.sync(),
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
