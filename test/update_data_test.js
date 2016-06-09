// create test DB DONE
// create 1 test user DONE
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
const server = require('./_update_server');
const config = require('./test_config');
var User = require(__dirname + '/../models/user');
var update = require(__dirname + '/../bin/_update_data');

describe('update_data_test', () => {
  before((done) => {
    setup();
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
    this.user.remove((err) => {
      if (err) console.log(err);
    });
    teardown(done);
  });

  it('should update user data from fitBit', (done) => {
    update(() => {
      expect();
    });
    done();
  });
});
