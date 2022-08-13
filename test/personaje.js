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

describe('Characters', () => {
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

    const personaje = {
      imagen: 'asd',
      nombre: 'pepe',
      edad: 24,
      peso: 44,
      historia: 'asd',
    };

    const savedPersonaje = PersonajeModel.build(personaje);
    await savedPersonaje.save();

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
    await PersonajeModel.destroy({ truncate: true });
  });

  describe('/GET characters', () => {
    it('it should return unauthorized status when not logged in', (done) => {
      chai.request(server)
        .get('/characters')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('it should Login, and get a character', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .end((err, res) => {
          const { token } = res.body;
          chai.request(server)
            .get('/characters/1')
            .set('Authorization', `bearer ${token}`)
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('object');
              response.body.data.should.have.property('imagen');
              response.body.data.should.have.property('nombre');
              response.body.data.should.have.property('edad');
              response.body.data.should.have.property('peso');
              response.body.data.should.have.property('historia');
              done();
            });
        });
    });
    it('it should throw error when id does not exist', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');
          const { token } = res.body;
          chai.request(server)
            .get('/characters/9999')
            .set('Authorization', `bearer ${token}`)
            .end((err, response) => {
              response.should.have.status(400);
              response.body.message.should.equal("Cannot read property 'toJSON' of null");
              done();
            });
        });
    });
    it('it should get all characters', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');
          const { token } = res.body;
          chai.request(server)
            .get('/characters')
            .set('Authorization', `bearer ${token}`)
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('array');
              response.body[0].should.be.a('object');
              response.body[0].should.have.property('imagen');
              response.body[0].should.have.property('nombre');
              done();
            });
        });
    });
  });
  describe('/POST characters', () => {
    it('it should return unauthorized status when not logged in', (done) => {
      chai.request(server)
        .post('/movies')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('it should Login, create a character when properties are correct', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .end((err, res) => {
          const { token } = res.body;
          chai.request(server)
            .post('/characters')
            .set('Authorization', `bearer ${token}`)
            .send({
              imagen: 'asdas',
              nombre: 'mocha 3',
              edad: 21,
              peso: 30,
              historia: 'asdsa',
            })
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('object');
              response.body.should.have.property('imagen');
              response.body.should.have.property('nombre');
              response.body.should.have.property('edad');
              response.body.should.have.property('peso');
              response.body.should.have.property('historia');
              done();
            });
        });
    });

    it('it should throw error when a field is missing', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .end((err, res) => {
          const { token } = res.body;
          chai.request(server)
            .post('/characters')
            .set('Authorization', `bearer ${token}`)
            .send({
              imagen: 'asdas',
              nombre: 'mocha 2',
              edad: 12,
            })
            .end((err, response) => {
              response.should.have.status(400);
              response.body.should.be.a('object');
              response.body.should.have.property('message');
              done();
            });
        });
    });
  });
  describe('/PUT movies', () => {
    it('it should return unauthorized status when not logged in', (done) => {
      chai.request(server)
        .post('/movies')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('it should Login and modify an existing character', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .end((err, res) => {
          const { token } = res.body;
          chai.request(server)
            .put('/characters/1')
            .set('Authorization', `bearer ${token}`)
            .send({
              nombre: 'updated!',
            })
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('object');
              response.body.nombre.should.equal('updated!');
              done();
            });
        });
    });
  });
  describe('/DELETE characters', () => {
    it('it should return unauthorized status when not logged in', (done) => {
      chai.request(server)
        .post('/movies')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('it should delete a character', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .end((err, res) => {
          const { token } = res.body;
          chai.request(server)
            .delete('/characters/1')
            .set('Authorization', `bearer ${token}`)
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('object');
              done();
            });
        });
    });
  });
});
