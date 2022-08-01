const bcrypt = require('bcrypt');

async function getPass(password, saltRounds) {
  const passwordHash = await bcrypt.hash(password, saltRounds);
  return passwordHash;
}

module.exports = {
  getPass,
};
