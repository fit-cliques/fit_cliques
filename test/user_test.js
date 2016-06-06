const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const request = chai.request;
const setup = require(__dirname + '/test_setup');
const teardown = require(__dirname + '/test_teardown');
const port = process.env.PORT = 5050;

var User = require(__dirname + '/../models/user');

describe('server', () => {
  before((done) => {
    setup(done);
  });

  after((done) => {
    teardown(done);
  });

  describe('user routes', () => {
    beforeEach((done) => {
      var newUser = new User({
        username: 'rick',
        password: 'mustache',
        encodedId: '1',
        zipCode: '98144'
      });
      newUser.generateHash(newUser.password);
      newUser.save((err, user) => {
        if (err) console.log(err);
        user.generateToken((err, token) => {
          if (err) console.log(err);
          this.token = token;
          this.user = user;
          done();
        });
      });
    });

    afterEach((done) => {
      this.user.remove((err) => {
        if (err) console.log(err);
        done();
      });
    });

    it('should get all the users', (done) => {
      request('localhost:' + port)
        .get('/api/user')
        .set('token', this.token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.eql(true);
          expect(res.body[0].username).to.eql('rick');
          expect(res.body[0].zipCode).to.eql('98144');
          done();
        });
    });

    it('should get a user', (done) => {
      request('localhost:' + port)
        .get('/api/user/' + this.user._id)
        .set('token', this.token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.username).to.eql('rick');
          expect(res.body.zipCode).to.eql('98144');
          done();
        });
    });

    it('should update a user', (done) => {
      request('localhost:' + port)
        .put('/api/user/' + this.user._id)
        .set('token', this.token)
        .send({ username: 'John Cena' })
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.message).to.eql('Successfully updated!');
          done();
        });
    });

    it('should delete a user', (done) => {
      request('localhost:' + port)
        .delete('/api/user/' + this.user._id)
        .set('token', this.token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.message).to.eql('Successfully deleted!');
          done();
        });
    });
  });
});
