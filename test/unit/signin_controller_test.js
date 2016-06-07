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
    authctrl = $controller('SignInController');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should sign in a user', function() {
    $httpBackend.expectGET(config.baseUrl + '/api/signin',
      {
        'Authorization': 'Basic UGhpbDp1bmRlZmluZWQ=',
        'Accept': 'application/json, text/plain, */*'
      })
      .respond(200, { token: 'slothbear' });
    $httpBackend.expectGET(config.baseUrl + '/api/profile')
      .respond(200, { username: 'testuser' });
    authctrl.authenticate({ username: 'Phil' });
    $httpBackend.flush();
    expect(window.localStorage.token).toBe('slothbear');
  });
});
