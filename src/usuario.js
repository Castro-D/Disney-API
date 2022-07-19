const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = class Usuario extends Model {
  static setup(sequelizeInstance) {
    Usuario.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },

    }, {
      sequelize: sequelizeInstance,
      underscored: true,
      modelName: 'Usuario',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'usuarios',
    });
    return Usuario;
  }
};
