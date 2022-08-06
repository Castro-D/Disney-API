const Personaje = require('../entity/Personaje');

function fromDataToEntity({
  id, imagen, nombre, edad, peso, historia,
}) {
  return new Personaje({
    id,
    imagen,
    nombre,
    edad,
    peso,
    historia,
  });
}

function fromModelToEntity(model) {
  const modelJson = model.toJSON();
  return new Personaje(modelJson);
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
