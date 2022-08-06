const { fromModelToEntity } = require('../mapper/peliculaMapper');

module.exports = class PeliculaRepository {
  /**
   * @param {import('../model/pelicula')} peliculaModel
   * @param {import('../../personaje/model/personaje')} personajeModel
   */
  constructor(peliculaModel, personajeModel) {
    this.peliculaModel = peliculaModel;
    this.personajeModel = personajeModel;
  }

  async getAllMovies() {
    const peliculas = await this.peliculaModel.findAll({
      attributes: ['imagen', 'titulo', 'fechaCreacion'],
    });
    return peliculas.map((pelicula) => fromModelToEntity(pelicula));
  }

  async getFilteredMovies(query) {
    const options = {
      where: {},
    };
    if (query.name) {
      options.where.titulo = query.name;
    }
    if (query.genre) {
      options.where.fk_genero = query.genre;
    }
    if (query.order) {
      options.order = [['fecha_creacion', query.order]];
    }
    const filteredMovies = await this.peliculaModel.findAll(options);
    return filteredMovies.map((movie) => fromModelToEntity(movie));
  }

  async getMovieById(id) {
    const pelicula = await this.peliculaModel.findByPk(id, {
      include: {
        model: this.personajeModel,
        as: 'personajes',
        through: 'peliculas_personajes',
      },
    });
    return fromModelToEntity(pelicula);
  }

  async saveMovie(data) {
    const buildOptions = {
      isNewRecord: !data.id,
    };
    let peliculaModel;
    peliculaModel = this.peliculaModel.build(data, buildOptions);
    peliculaModel = await peliculaModel.save();
    return fromModelToEntity(peliculaModel);
  }

  async deleteMovie(id) {
    await this.peliculaModel.destroy({ where: { id } });
  }
};
