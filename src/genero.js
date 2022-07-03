class Genero extends Model {}

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
  sequelize,
  underscored: true,
  modelName: 'Genero',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'generos',
});
