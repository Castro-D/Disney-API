module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('peliculas_personajes', 'fk_personaje', {
        type: 'INTEGER USING CAST("fk_personaje" as INTEGER)',
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('peliculas_personajes', 'fk_personaje', {
        type: Sequelize.DataTypes.STRING,
      }),
    ]);
  },
};
