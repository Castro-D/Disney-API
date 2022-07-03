class PeliculaPersonaje extends Model {}

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
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'PeliculaPersonaje',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'peliculas_personajes',
});
