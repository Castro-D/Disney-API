const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = class PeliculaPersonaje extends Model {
  static setup(sequelizeInstance) {
    PeliculaPersonaje.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      fk_pelicula: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      fk_personaje: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize: sequelizeInstance,
      underscored: true,
      modelName: 'PeliculaPersonaje',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'peliculas_personajes',
    });
    return PeliculaPersonaje;
  }
};
