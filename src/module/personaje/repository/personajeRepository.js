module.exports = class PersonajeRepository {
  /**
   * @param {import('../model/personaje')} personajeModel
   * @param {import('../../pelicula/model/pelicula')} peliculaModel
   * @param {import('../model/peliculaPersonaje')} peliculaPersonajeModel
   */
  constructor(personajeModel, peliculaModel, peliculaPersonajeModel) {
    this.personajeModel = personajeModel;
    this.peliculaModel = peliculaModel;
    this.peliculaPersonajeModel = peliculaPersonajeModel;
  }

  async getAll() {
    const personajes = await this.personajeModel.findAll({
      attributes: ['id', 'imagen', 'nombre'],
    });
    return personajes;
  }

  async getFilteredCharacters(query, pelicula = null) {
    if (pelicula != null) {
      const personajes = await this.personajeModel.findAll({
        include: {
          model: this.peliculaModel,
          as: 'peliculas',
          through: 'peliculas_personajes',
          where: {
            id: pelicula,
          },
        },
      });
      return personajes;
    }
    const result = await this.personajeModel.findAll({
      where: query,
    });
    return result;
  }

  async getCharacterById(id) {
    const personaje = await this.personajeModel.findByPk(id, {
      include: {
        model: this.peliculaModel,
        as: 'peliculas',
        through: 'peliculas_personajes',
      },
    });
    return personaje;
  }

  async save(data) {
    const buildOptions = {
      isNewRecord: !data.id,
    };
    let personajeModel;

    personajeModel = this.personajeModel.build(data, buildOptions);
    personajeModel = await personajeModel.save();
    return personajeModel;
  }

  async saveCharactersMovies(peliculas, personaje) {
    peliculas.forEach(async (p) => {
      const pelicula = await this.peliculaModel.findOne({
        where: {
          titulo: p,
        },
      });
      const peliculaPersonaje = this.peliculaPersonajeModel.build({
        fk_pelicula: pelicula.id,
        fk_personaje: personaje.id,
      });
      await peliculaPersonaje.save();
    });
  }

  async removeCharacter(id) {
    await this.personajeModel.destroy({ where: { id } });
  }
};
