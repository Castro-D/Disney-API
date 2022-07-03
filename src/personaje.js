class Personaje extends Model {}

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
  sequelize,
  underscored: true,
  modelName: 'Personaje',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'personajes',
});
