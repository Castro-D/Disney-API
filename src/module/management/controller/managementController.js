const { getPass } = require('../utils/getHashedPassword');

module.exports = class ManagementController {
  constructor(managementService) {
    this.ROUTE_BASE = '/auth';
    this.managementService = managementService;
  }

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;

    app.post(`${ROUTE}/register`, this.register.bind(this));
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
};
