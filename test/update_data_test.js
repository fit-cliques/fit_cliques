// create test DB DONE
// create 2 test users TODO
// capture fitBit API requests TODO
//   return mock data TODO
// check values on user objects TODO
// check http://robdodson.me/mocking-requests-with-mocha-chai-and-sinon/
// and http://sinonjs.org
//         for more info on how to do this
const setup = require(__dirname + '/test_setup');
const teardown = require(__dirname + '/test_teardown');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const port = process.env.PORT = 5050;
var User = require(__dirname + '/../models/user');
var update = require(__dirname + '/../bin/update_data');

describe('update_data_test', () => {
  before((done) => {
    setup(done);
  });

  after((done) => {
    teardown(done);
  });
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

  it('should update user data from fitBit');
});
