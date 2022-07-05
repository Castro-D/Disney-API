const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = class Personaje extends Model {
  static setup(sequelizeInstance) {
    Personaje.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      imagen: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      edad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      peso: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      historia: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize: sequelizeInstance,
      underscored: true,
      modelName: 'Personaje',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'personajes',
    });
    return Personaje;
  }

  static setupAssociation(Pelicula) {
    Personaje.belongsToMany(Pelicula, {
      through: 'peliculas_personajes',
      as: 'personajes',
      foreignKey: 'fk_pelicula',
      uniqueKey: 'id',
    });
    return Personaje;
  }
};
