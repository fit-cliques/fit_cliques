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
    authctrl = $controller('SignUpController');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should sign up a user', function() {
    $httpBackend.expectPOST(config.baseUrl + '/api/signup', { username: 'Phil' })
      .respond(200, { token: 'slothbear' });
    $httpBackend.expectGET(config.baseUrl + '/api/profile')
      .respond(200, { username: 'testuser' });
    authctrl.authenticate({ username: 'Phil' });
    $httpBackend.flush();
    expect(window.localStorage.token).toBe('slothbear');
  });
});
