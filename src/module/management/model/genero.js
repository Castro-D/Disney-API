const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = class Genero extends Model {
  static setup(sequelizeInstance) {
    Genero.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      imagen: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize: sequelizeInstance,
      underscored: true,
      modelName: 'Genero',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'generos',
    });
    return Genero;
  }

  static setupAssociation(Pelicula) {
    Genero.hasMany(Pelicula, {
      foreignKey: {
        name: 'fk_genero',
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    });
    return Genero;
  }
};
