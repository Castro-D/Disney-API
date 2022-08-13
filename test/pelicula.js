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

describe('Movies', () => {
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
              response.body.pelicula.should.be.a('object');
              response.body.pelicula.should.have.property('imagen');
              response.body.pelicula.should.have.property('titulo');
              response.body.pelicula.should.have.property('fechaCreacion');
              response.body.pelicula.should.have.property('calificacion');
              response.body.pelicula.should.have.property('fk_genero');
              done();
            });
        });
    });
    it('it should get all movies', (done) => {
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
            .get('/movies')
            .set('Authorization', `bearer ${token}`)
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('array');
              response.body[0].should.be.a('object');
              response.body[0].should.have.property('imagen');
              response.body[0].should.have.property('titulo');
              response.body[0].should.have.property('fechaCreacion');
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
            .get('/movies/9999')
            .set('Authorization', `bearer ${token}`)
            .end((err, response) => {
              response.should.have.status(400);
              response.body.message.should.equal("Cannot read property 'toJSON' of null");
              done();
            });
        });
    });
  });
  describe('/POST movies', () => {
    it('it should return unauthorized status when not logged in', (done) => {
      chai.request(server)
        .post('/movies')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('it should Login, create a movie when properties are correct', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .end((err, res) => {
          const { token } = res.body;
          chai.request(server)
            .post('/movies')
            .set('Authorization', `bearer ${token}`)
            .send({
              imagen: 'asdas',
              titulo: 'mocha 2',
              fechaCreacion: '1991-10-26',
              calificacion: 3,
              fk_genero: 1,
            })
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('object');
              response.body.should.have.property('imagen');
              response.body.should.have.property('titulo');
              response.body.should.have.property('fechaCreacion');
              response.body.should.have.property('calificacion');
              response.body.should.have.property('fk_genero');
              done();
            });
        });
    });
    it('it should return 400 code when calificacion is not between 1 to 5', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .end((err, res) => {
          const { token } = res.body;
          chai.request(server)
            .post('/movies')
            .set('Authorization', `bearer ${token}`)
            .send({
              imagen: 'asdas',
              titulo: 'mocha 2',
              fechaCreacion: '1991-10-26',
              calificacion: 7,
              fk_genero: 1,
            })
            .end((err, response) => {
              response.should.have.status(400);
              response.body.should.be.a('object');
              response.body.message.should.equal('Validation error: Validation max on calificacion failed');
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
            .post('/movies')
            .set('Authorization', `bearer ${token}`)
            .send({
              imagen: 'asdas',
              titulo: 'mocha 2',
              fechaCreacion: '1991-10-26',
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
    it('it should Login and modify an existing user', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .end((err, res) => {
          const { token } = res.body;
          chai.request(server)
            .put('/movies/1')
            .set('Authorization', `bearer ${token}`)
            .send({
              imagen: 'asdas',
              titulo: 'updated!',
            })
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('object');
              response.body.titulo.should.equal('updated!');
              done();
            });
        });
    });
  });
  describe('/DELETE movies', () => {
    it('it should return unauthorized status when not logged in', (done) => {
      chai.request(server)
        .post('/movies')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('it should delete a movie', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin',
        })
        .end((err, res) => {
          const { token } = res.body;
          chai.request(server)
            .delete('/movies/1')
            .set('Authorization', `bearer ${token}`)
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('object');
              response.body.msg.should.equal('deleted');
              done();
            });
        });
    });
  });
});
