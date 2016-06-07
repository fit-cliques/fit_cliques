var angular = require('angular');
require('angular-mocks');
const config = require('../../app/js/config');

describe('user controller', function() {
  var $controller;

  beforeEach(angular.mock.module('fitCliqueApp'));

  beforeEach(angular.mock.inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  it('should be a controller', function() {
    var userctrl = $controller('UserController');
    expect(typeof userctrl).toBe('object');
    expect(typeof userctrl.getAll).toBe('function');
  });

  describe('REST functionality', function() {
    var $httpBackend;
    var userctrl;
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      userctrl = $controller('UserController');
    }));
    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should send a GET request to retrieve user data', function() {
      $httpBackend.expectGET(config.baseUrl + '/api/user')
      .respond(200, [ { username: 'Phil' } ]);
      userctrl.getAll();
      $httpBackend.flush();
      expect(userctrl.user.length).toBe(1);
      expect(userctrl.user[0].username).toBe('Phil');
    });

    it('should create a user', function() {
      $httpBackend.expectPOST(config.baseUrl + '/api/user', { username: 'Phil' })
      .respond(200, { username: 'some user' });
      expect(userctrl.user.length).toBe(0);
      userctrl.newUser = { username: 'Phil' };
      userctrl.createUser();
      $httpBackend.flush();
      expect(userctrl.user[0].username).toBe('some user');
      expect(userctrl.newUser).toBe(null);
    });

    it('should update a user', function() {
      $httpBackend.expectPUT(config.baseUrl + '/api/user/1',
      { username: 'updated user!', _id: 1 }).respond(200);
      userctrl.user = [{ username: 'test user', _id: 1 }];
      userctrl.user[0].username = 'updated user!';
      userctrl.updateUser(userctrl.user[0]);
      $httpBackend.flush();
      expect(userctrl.user[0].editing).toBe(false);
    });

    it('should remove a user', function() {
      $httpBackend.expectDELETE(config.baseUrl + '/api/user/1').respond(200);
      userctrl.user = [{ username: 'test user', _id: 1 }];
      userctrl.removeUser(userctrl.user[0]);
      $httpBackend.flush();
      console.log(userctrl.user);
      expect(userctrl.user.length).toBe(0);
    });
  });
});
