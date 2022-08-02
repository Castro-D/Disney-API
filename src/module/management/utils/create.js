require('dotenv').config();
const jwt = require('jsonwebtoken');

function create(user) {
  const userForToken = {
    username: user.username,
    id: user.id,
  };
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 });
  return token;
}

module.exports = {
  create,
};
