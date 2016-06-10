const setup = require(__dirname + '/test_setup');
const teardown = require(__dirname + '/test_teardown');
const chai = require('chai');
const expect = chai.expect;
const dummy = require('./_update_server');
var User = require(__dirname + '/../models/user');
var update = require(__dirname + '/../bin/_update_data');
const config = require('./test_config'); // eslint-disable-line no-unused-vars

describe('update_data_test', () => {
  before((done) => {
    setup();
    var newUser = new User({
      username: 'rick',
      password: 'mustache',
      encodedId: '1',
      zipCode: '98144',
      fbUserId: '34567'
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
    dummy.close();
    teardown(done);
  });

  it('should update user data from fitBit', (done) => {
    update(config, () => {
      User.find((err, userArr) => {
        if (err) return console.log(err);
        expect(userArr[0].fbToken).to.eql('12345');
        expect(userArr[0].fbRefreshToken).to.eql('23456');
        expect(userArr[0].fbUserId).to.eql('34567');
        expect(userArr[0].todaySteps).to.eql(6789);
        expect(userArr[0].encodedId).to.eql('Rick');
        expect(userArr[0].memberSince.toString()).to.eql('Sun Oct 09 2016 17:00:00 GMT-0700 (PDT)');
        expect(userArr[0].strideLength).to.eql(80);
        expect(userArr[0].lifetimeSteps).to.eql(987654321);
        expect(userArr[0].lifetimeDistance).to.eql(1987654321);
        expect(userArr[0].bestSteps).to.eql('65432');
        expect(userArr[0].bestDistance).to.eql('165432');
        expect(userArr[0].lastSeven).to.eql([{ 'value': '11' }, { 'value': '12' },
        { 'value': '13' }, { 'value': '14' }, { 'value': '15' }, { 'value': '16' },
         { 'value': '17' }]);
        done();
      });
    });
  });
});
