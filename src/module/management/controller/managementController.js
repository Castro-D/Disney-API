const { getPass } = require('../utils/getHashedPassword');
const { compare } = require('../utils/comparePass');
const { create } = require('../utils/create');

module.exports = class ManagementController {
  constructor(managementService) {
    this.ROUTE_BASE = '/auth';
    this.managementService = managementService;
  }

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;

    app.post(`${ROUTE}/register`, this.register.bind(this));
    app.post(`${ROUTE}/login`, this.login.bind(this));
  }

  async register(req, res) {
    try {
      const { username, password } = req.body;
      const existingUser = await this.managementService.getUser(username);
      if (existingUser) {
        return res.status(400).json({
          error: 'username must be unique',
        });
      }
      const saltRounds = 10;
      const passwordHash = await getPass(password, saltRounds);
      const user = this.managementService.save(username, passwordHash);
      return res.status(201).json(user);
    } catch (e) {
      return res.status(400).json({ message: `${e.message}` });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await this.managementService.getUser(username);
      const isPasswordCorrect = await compare(user, password);
      if (!(user && isPasswordCorrect)) {
        return res.status(401).json({
          error: 'invalid credentials',
        });
      }
      const token = create(user);
      return res.status(200).send({ token, username });
    } catch (e) {
      return res.status(400).json({ message: `${e.message}` });
    }
  }
};
