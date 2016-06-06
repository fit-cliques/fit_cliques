const angular = require('angular');
require('angular-mocks');
const config = require('../../app/js/config');

describe('fb user auth service', function() {
  var $httpBackend;

  beforeEach(function() {
    angular.mock.module('fitCliquesApp');
    angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
    });
  });

  it('should return an object', angular.mock.inject(function(fbUserAuth) {
    expect(typeof fbUserAuth).toBe('object');
  }));

  it('should append tokens to the service object', angular.mock.inject(function(fbUserAuth) {
    $httpBackend.expectPOST(config.fbAuthUrl).respond(200, {
      access_token: '12345',
      refresh_token: '789',
      user_id: 'awesomeFbUser'
    });
    fbUserAuth.getFbTokens('5678');
    $httpBackend.flush();
    expect(fbUserAuth.fbToken).toBe('12345');
    expect(fbUserAuth.fbRefreshToken).toBe('789');
    expect(fbUserAuth.fbUserId).toBe('awesomeFbUser');
  }));

});
