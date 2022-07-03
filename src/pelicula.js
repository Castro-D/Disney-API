class Pelicula extends Model {}

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
}, {
  sequelize,
  underscored: true,
  modelName: 'Pelicula',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'peliculas',
});
