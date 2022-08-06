module.exports = class Personaje {
  /**
   * @param {number} id
   * @param {string} imagen
   * @param {string} nombre
   * @param {number} edad
   * @param {number} peso
   * @param {string} historia
   */
  constructor({
    id,
    imagen,
    nombre,
    edad,
    peso,
    historia,
  }) {
    this.id = id;
    this.imagen = imagen;
    this.nombre = nombre;
    this.edad = edad;
    this.peso = peso;
    this.historia = historia;
  }
};
