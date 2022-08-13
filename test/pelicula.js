const { Sequelize } = require('sequelize');
const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const personajeModel = require('../src/module/personaje/model/personaje');
const peliculaModel = require('../src/module/pelicula/model/pelicula');
const peliculaPersonajeModel = require('../src/module/personaje/model/peliculaPersonaje');
const generoModel = require('../src/module/management/model/genero');
const usuarioModel = require('../src/module/management/model/usuario');
const server = require('../src/index');

const should = chai.should();

chai.use(chaiHttp);

describe('characters', () => {
  let sequelize;
  let PersonajeModel;
  let PeliculaModel;
  let PeliculaPersonajeModel;
  let GeneroModel;
  let UsuarioModel;
  beforeEach(async () => {
    sequelize = new Sequelize('sqlite::memory', { logging: false });
    PersonajeModel = personajeModel.setup(sequelize);
    PeliculaModel = peliculaModel.setup(sequelize);
    PeliculaPersonajeModel = peliculaPersonajeModel.setup(sequelize);
    GeneroModel = generoModel.setup(sequelize);
    UsuarioModel = usuarioModel.setup(sequelize);

    PersonajeModel.setupAssociation(PeliculaModel);
    PeliculaModel.setupAssociation(PersonajeModel);
    GeneroModel.setupAssociation(PeliculaModel);

    await sequelize.sync({ force: true });

    const genero = {
      nombre: 'genero',
      imagen: 'asda',
    };
    const pelicula = {
      imagen: 'asd',
      titulo: 'chai',
      fechaCreacion: '1991-10-23',
      calificacion: 5,
      fk_genero: 1,
    };

    const savedGenero = GeneroModel.build(genero);
    await savedGenero.save();

    const savedPelicula = PeliculaModel.build(pelicula);
    await savedPelicula.save();

    const user = {
      username: 'admin',
      password: 'admin',
    };
    const passwordHash = await bcrypt.hash(user.password, 10);
    const savedUser = UsuarioModel.build({
      username: user.username,
      passwordHash,
    });
    savedUser.save();
  });

  afterEach(async () => {
    await UsuarioModel.destroy({ truncate: true });
    await GeneroModel.destroy({ truncate: true });
    await PeliculaModel.destroy({ truncate: true });
  });

  describe('/GET movies', () => {
    it('it should return unauthorized status when not logged in', (done) => {
      chai.request(server)
        .get('/movies')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('it should Login, and get a movie', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .end((err, res) => {
          const { token } = res.body;
          chai.request(server)
            .get('/movies/1')
            .set('Authorization', `bearer ${token}`)
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('object');
              done();
            });
        });
    });
    it('it should Login, and get all movies', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        }) // this is like sending $http.post or this.http.post in Angular
        .end((err, res) => { // when we get a response from the endpoint
          // in other words,
          // the res object should have a status of 201
          res.should.have.status(200);
          res.body.should.have.property('token');
          const { token } = res.body;
          chai.request(server)
            .get('/movies')
            .set('Authorization', `bearer ${token}`)
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('array');
              done();
            });
        });
    });
  });
});
