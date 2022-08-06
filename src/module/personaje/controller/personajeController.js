const { getTokenFrom } = require('../../management/utils/getToken');
const { verifyToken } = require('../../management/utils/verifyToken');
const { fromDataToEntity } = require('../mapper/personajeMapper');

module.exports = class PersonajeController {
  /**
   * @param {import('../service/personajeService')} personajeService
   */
  constructor(personajeService) {
    this.personajeService = personajeService;
  }

  /**
   * @param {import('express'.Application)} app
   */
  configureRoutes(app) {
    const ROUTE = '/characters';

    app.get(`${ROUTE}`, this.auth.bind(this), this.getAll.bind(this));
    app.get(`${ROUTE}/:id`, this.auth.bind(this), this.getCharacter.bind(this));
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
        const {
          nombre, edad, peliculas, peso,
        } = req.query;
        const query = {};
        if (nombre != null) query.nombre = nombre;
        if (edad != null) query.edad = edad;
        if (peso != null) query.peso = peso;
        const asociaciones = await this.personajeService.getFilteredCharacters(query, peliculas);
        return res.status(200).json(asociaciones);
      }
      const personajes = await this.personajeService.getAll();
      return res.status(200).json(personajes);
    } catch (e) {
      return res.status(400).json({ message: `${e.message}` });
    }
  }

  async getCharacter(req, res) {
    try {
      const { id } = req.params;
      const personaje = await this.personajeService.getCharacterById(id);
      res.status(200).json({ data: personaje });
    } catch (e) {
      res.status(400).json({ message: `${e.message}` });
    }
  }

  async create(req, res) {
    try {
      const personaje = fromDataToEntity(req.body);
      const { peliculas } = req.body;
      const newPersonaje = await this.personajeService.save(personaje);
      if (peliculas) {
        await this.personajeService.saveCharactersMovies(peliculas, newPersonaje);
      }
      res.status(200).json(newPersonaje.toJSON());
    } catch (e) {
      res.status(400).json({ message: `${e.message}` });
    }
  }

  async edit(req, res) {
    try {
      const { id } = req.params;
      const personaje = req.body;
      personaje.id = id;
      const savedPersonaje = await this.personajeService.save(personaje);
      res.status(200).json(savedPersonaje.toJSON());
    } catch (e) {
      res.status(400).json({ message: `${e.message}` });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      await this.personajeService.removeCharacter(id);
      res.status(200).json({ deleted: 'true' });
    } catch (e) {
      res.status(400).json({ message: `${e.message}` });
    }
  }
};
