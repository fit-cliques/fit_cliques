const angular = require('angular');
require('angular-mocks');
const config = require('../../app/js/config');

describe('auth controller', function() {
  var $httpBackend;
  var $controller;
  var authctrl;

  beforeEach(angular.mock.module('fitCliqueApp'));

  beforeEach(angular.mock.inject(function(_$controller_, _$httpBackend_) {
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    authctrl = $controller('AuthController');
    window.localStorage.token = 'token';
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('get a username', function() {
    $httpBackend.expectGET(config.baseUrl + '/api/profile')
      .respond(200, { username: 'testuser' });
    authctrl.getUsername();
    $httpBackend.flush();
    expect(authctrl.username).toBe('testuser');
  });

  it('log out a user', function() {
    authctrl.logout();
    expect(window.localStorage.token).toBe('');
  });
});
