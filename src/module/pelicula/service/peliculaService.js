module.exports = class PeliculaService {
  /**
   * @param {import('../repository/peliculaRepository')} peliculaRepository
   */
  constructor(peliculaRepository) {
    this.peliculaRepository = peliculaRepository;
  }

  async getAllMovies() {
    return this.peliculaRepository.getAllMovies();
  }

  async getFilteredMovies(query) {
    return this.peliculaRepository.getFilteredMovies(query);
  }

  async getMovieById(id) {
    return this.peliculaRepository.getMovieById(id);
  }

  async saveMovie(data) {
    return this.peliculaRepository.saveMovie(data);
  }

  async deleteMovie(id) {
    return this.peliculaRepository.deleteMovie(id);
  }
};
