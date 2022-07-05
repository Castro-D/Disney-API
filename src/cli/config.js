require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
};
