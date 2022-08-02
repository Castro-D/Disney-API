const { getTokenFrom } = require('../../management/utils/getToken');
const { verifyToken } = require('../../management/utils/verifyToken');

module.exports = class PeliculaController {
  /**
   * @param {import('../service/peliculaService')} peliculaService
   */
  constructor(peliculaService) {
    this.peliculaService = peliculaService;
  }

  configureRoutes(app) {
    const ROUTE = '/movies';

    app.get(`${ROUTE}`, this.auth.bind(this), this.getAll.bind(this));
    app.get(`${ROUTE}/:id`, this.auth.bind(this), this.getMovie.bind(this));
    app.post(`${ROUTE}`, this.auth.bind(this), this.create.bind(this));
    app.put(`${ROUTE}/:id`, this.auth.bind(this), this.edit.bind(this));
    app.delete(`${ROUTE}/:id`, this.auth.bind(this), this.remove.bind(this));
  }

  async auth(req, res, next) {
    const token = getTokenFrom(req);
    if (!token) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken.id) {
      return res.status(401).json({
        error: 'token missing or invalid',
      });
    }
    return next();
  }

  async getAll(req, res) {
    try {
      const queryObjectIsEmpty = Object.keys(req.query).length === 0;
      if (!queryObjectIsEmpty) {
        const movies = await this.peliculaService.getFilteredMovies(req.query);
        return res.status(200).json({ movies });
      }
      const peliculas = await this.peliculaService.getAllMovies();
      return res.status(200).json(peliculas);
    } catch (e) {
      return res.status(400).json({ message: `${e.message}` });
    }
  }

  async getMovie(req, res) {
    try {
      const { id } = req.params;
      const pelicula = await this.peliculaService.getMovieById(id);
      res.status(200).json({ pelicula });
    } catch (e) {
      res.status(400).json({ message: `${e.message}` });
    }
  }

  async create(req, res) {
    try {
      const data = req.body;
      const pelicula = await this.peliculaService.saveMovie(data);
      res.status(200).json(pelicula);
    } catch (e) {
      res.status(400).json({ message: `${e.message}` });
    }
  }

  async edit(req, res) {
    try {
      const { id } = req.params;
      const pelicula = req.body;
      pelicula.id = id;
      const savedPelicula = await this.peliculaService.saveMovie(pelicula);
      res.status(200).json(savedPelicula);
    } catch (e) {
      res.status(400).json({ message: `${e.message}` });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      await this.peliculaService.deleteMovie(id);
      res.status(200).json({ msg: 'deleted' });
    } catch (e) {
      res.status(400).json({ message: `${e.message}` });
    }
  }
};
