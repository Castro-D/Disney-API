module.exports = class PersonajeService {
  /**
   * @param {import('../repository/personajeRepository')} personajeRepository
   */
  constructor(personajeRepository) {
    this.personajeRepository = personajeRepository;
  }

  async getAll() {
    return this.personajeRepository.getAll();
  }

  async getFilteredCharacters(query, pelicula) {
    return this.personajeRepository.getFilteredCharacters(query, pelicula);
  }

  async getCharacterById(id) {
    return this.personajeRepository.getCharacterById(id);
  }

  async save(data) {
    return this.personajeRepository.save(data);
  }

  async saveCharactersMovies(peliculas, personaje) {
    return this.personajeRepository.saveCharactersMovies(peliculas, personaje);
  }

  async removeCharacter(id) {
    return this.personajeRepository.removeCharacter(id);
  }
};
