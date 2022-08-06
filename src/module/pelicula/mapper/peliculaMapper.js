const Pelicula = require('../entity/Pelicula');

function fromDataToEntity({
  id, imagen, titulo, fechaCreacion, calificacion, fk_genero,
}) {
  return new Pelicula({
    id,
    imagen,
    titulo,
    fechaCreacion,
    calificacion,
    fk_genero,
  });
}

function fromModelToEntity(model) {
  const modelJson = model.toJSON();
  return new Pelicula(modelJson);
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
