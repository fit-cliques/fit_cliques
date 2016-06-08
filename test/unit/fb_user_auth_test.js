/* eslint-disable camelcase */
const angular = require('angular');
require('angular-mocks');
const config = require('../../app/js/config');

describe('fb user auth service', function() {
  var $httpBackend;

  beforeEach(function() {
    angular.mock.module('fitCliqueApp');
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
    expect(fbUserAuth.user.fbToken).toBe('12345');
    expect(fbUserAuth.user.fbRefreshToken).toBe('789');
    expect(fbUserAuth.user.fbUserId).toBe('awesomeFbUser');
  }));

  it('should get today\'s steps', angular.mock.inject(function(fbUserAuth) {
    $httpBackend.expectGET(config.fbDataUrl + 1 + '/activities/date/today.json')
      .respond(200, { summary: { steps: 87654 } });
    fbUserAuth.user = {
      access_token: '12345',
      refresh_token: '789',
      user_id: 'awesomeFbUser'
    };

    fbUserAuth.getFbUserSteps(1);
    $httpBackend.flush();
    expect(fbUserAuth.user.todaySteps).toBe(87654);
  }));

  it('should get user\'s FitBit profile', angular.mock.inject(function(fbUserAuth) {
    fbUserAuth.todaySteps = 87654;
    $httpBackend.expectGET(config.fbDataUrl + 3 + '/profile.json')
      .respond(200, { user: { encodedId: '6', memberSince: '01-01-2016', strideLengthWalking: '3' } });
    fbUserAuth.user = {
      access_token: '12345',
      refresh_token: '789',
      user_id: 'awesomeFbUser',
      todaySteps: 500
    };

    fbUserAuth.getFbUserProfile(3);
    $httpBackend.flush();
    expect(fbUserAuth.user.encodedId).toBe('6');
    expect(fbUserAuth.user.memberSince).toBe('01-01-2016');
    expect(fbUserAuth.user.strideLength).toBe('3');
    expect(fbUserAuth.user.todayDistance).toBe(fbUserAuth.user.todaySteps * fbUserAuth.user.strideLength);
  }));

  it('should get user\'s activities', angular.mock.inject(function(fbUserAuth) {
    $httpBackend.expectGET(config.fbDataUrl + 2 + '/activities.json')
      .respond(200, { lifetime: {
        total: {
          steps: 1,
          distance: 3
        }
      },
      best: {
        total: {
          steps: {
            date: '2016-01-02',
            value: 1
          },
          distance: {
            date: '2016-02-01',
            value: 8
          }
        }
      }
    });
    fbUserAuth.user = {
      access_token: '12345',
      refresh_token: '789',
      user_id: 'awesomeFbUser'
    };

    fbUserAuth.getFbUserActivities(2);
    $httpBackend.flush();
    expect(fbUserAuth.user.lifeTimeSteps).toBe(1);
    expect(fbUserAuth.user.lifeTimeDistance).toBe(3);
    expect(fbUserAuth.user.bestSteps.date).toBe('2016-01-02');
    expect(fbUserAuth.user.bestSteps.value).toBe(1);
    expect(fbUserAuth.user.bestDistance.date).toBe('2016-02-01');
    expect(fbUserAuth.user.bestDistance.value).toBe(8);
  }));

  it('should update the user token', angular.mock.inject(function(fbUserAuth) {
    $httpBackend.expectPOST(config.fbAuthUrl).respond(200, {
      access_token: '67890',
      refresh_token: '123',
      user_id: 'testFbUser'
    });
    fbUserAuth.user = {
      access_token: '12345',
      refresh_token: '789',
      user_id: 'awesomeFbUser'
    };

    fbUserAuth.updateFbUserToken();
    $httpBackend.flush();
    expect(fbUserAuth.user.fbToken).toBe('67890');
    expect(fbUserAuth.user.fbRefreshToken).toBe('123');
    expect(fbUserAuth.user.fbUserId).toBe('testFbUser');
  }));
});
