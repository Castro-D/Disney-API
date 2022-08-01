module.exports = class ManagementRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async getUser(username) {
    const user = await this.userModel.findOne({
      where: {
        username,
      },
    });
    return user;
  }

  async save(username, passwordHash) {
    let userModel;

    userModel = this.userModel.build({ username, passwordHash });
    userModel = await userModel.save();
    return userModel;
  }
};
