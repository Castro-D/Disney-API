const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = class Pelicula extends Model {
  static setup(sequelizeInstance) {
    Pelicula.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      imagen: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      fk_genero: {
        type: DataTypes.INTEGER,
        references: {
          model: { tableName: 'generos' },
          key: 'id',
        },
      },
    }, {
      sequelize: sequelizeInstance,
      underscored: true,
      modelName: 'Pelicula',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'peliculas',
    });
    return Pelicula;
  }

  static setupAssociation(Personaje) {
    Pelicula.belongsToMany(Personaje, {
      through: 'peliculas_personajes',
      as: 'personajes',
      foreignKey: 'fk_pelicula',
      uniqueKey: 'id',
    });

    return Pelicula;
  }
};
