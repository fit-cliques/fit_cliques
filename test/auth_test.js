const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const request = chai.request;
const setup = require(__dirname + '/test_setup');
const teardown = require(__dirname + '/test_teardown');
const port = process.env.PORT = 5050;

const User = require(__dirname + '/../models/user');

describe('sign in route tests', () => {
  before((done) => {
    setup(done);
  });

  before((done) => {
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

  after((done) => {
    teardown(done);
  });

  it('should sign in and GET a new token', (done) => {
    request('rick:mustache@localhost:' + port)
      .get('/api/signin')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.token.length).to.not.eql(0);
        done();
      });
  });

  it('should sign up a new users', (done) => {
    request('localhost:' + port)
      .post('/api/signup')
      .send({
        username: 'secondRick',
        password: 'handlebars',
        encodedId: '2',
        zipCode: '98121'
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.token.length).to.not.eql(0);
        expect(res.body.token).to.not.eql(this.token);
        done();
      });
  });
});
