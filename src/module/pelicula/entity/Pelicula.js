module.exports = class Pelicula {
  /**
   * @param {number} id
   * @param {string} imagen
   * @param {string} titulo
   * @param {date} fechaCreacion
   * @param {number} calificacion
   * @param {number} fk_genero
   */
  constructor({
    id,
    imagen,
    titulo,
    fechaCreacion,
    calificacion,
    fk_genero,
    personajes,
  }) {
    this.id = id;
    this.imagen = imagen;
    this.titulo = titulo;
    this.fechaCreacion = fechaCreacion;
    this.calificacion = calificacion;
    this.fk_genero = fk_genero;
    this.personajes = personajes;
  }
};
