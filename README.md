# Disney-API

## Live demo: https://safe-thicket-13587.herokuapp.com/api-docs/

### Tech stack
- **Nodejs** -- a JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Expressjs** -- a Fast, unopinionated, minimalist web framework for Node.js.
- **Dotenv** -- a zero-dependency module that loads environment variables from a .env file.
- **Json web token** -- an open, industry standard RFC 7519 method for representing claims securely between two parties.
- **Postgres** --  a powerful, open source object-relational database system.
- **RSDI** -- Simple and powerful dependency injection container for with strong type checking system.
- **Sequelize** -- a modern TypeScript and Node.js ORM for Postgres, MySQL, MariaDB, SQLite and SQL Server, and more.
- **Swagger** -- API documentation.
- **Solid principles**
- **Domain driven design** -- Anemic model.
- **Mocha** -- Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser.
- **Chai** -- Chai is a BDD / TDD assertion library for node and the browser.

### How to run this project

#### Install dependencies

Run `npm install`

Rename .env.dist to .env and add your secrets.

#### Run the project
1. `npm run dev:express` to run server
2. `npm run migrations` to run Sequelize migrations
3. `npm run seed` to run seeders
4. `npm test` to run tests
