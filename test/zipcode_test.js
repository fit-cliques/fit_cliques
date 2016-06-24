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

  describe('zipcode routes', () => {
    beforeEach((done) => {
      var newUser = new User({
        username: 'rick',
        password: 'mustache',
        encodedId: '1',
        zipCode: '98144',
        todaySteps: 100
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

    it('should get all the zipcodes', (done) => {
      request('localhost:' + port)
        .get('/api/zipcode')
        .set('token', this.token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(typeof res.body['98144']).to.eql('object');
          expect(Array.isArray(res.body['98144'].data)).to.eql(true);
          expect(res.body['98144'].data[0].username).to.eql('rick');
          done();
        });
    });

    it('should get a zipcode', (done) => {
      request('localhost:' + port)
        .get('/api/zipcode/98144')
        .set('token', this.token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(typeof res.body).to.eql('object');
          expect(res.body.zipTotalTodaySteps).to.eql(100);
          expect(res.body.data[0].username).to.eql('rick');
          done();
        });
    });
  });
});
