const bcrypt = require('bcrypt');

async function compare(user, pass) {
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(pass, user.passwordHash);
  return passwordCorrect;
}

module.exports = {
  compare,
};
