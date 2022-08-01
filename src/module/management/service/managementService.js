module.exports = class ManagementService {
  constructor(managementRepository) {
    this.managementRepository = managementRepository;
  }

  async getUser(username) {
    return this.managementRepository.getUser(username);
  }

  async save(username, passwordHash) {
    return this.managementRepository.save(username, passwordHash);
  }
};
