require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const swaggerDocument = require('../swagger.json');

const app = express();

const configureDI = require('./config/di');
const { initPersonajeModule } = require('./module/personaje/module');
const { initPeliculaModule } = require('./module/pelicula/module');
const { initManagementModule } = require('./module/management/module');

const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
const container = configureDI();
initPersonajeModule(app, container);
initPeliculaModule(app, container);
initManagementModule(app, container);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
