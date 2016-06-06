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

  it('should get today\'s steps', angular.mock.inject(function(fbUserAuth) {
    $httpBackend.expectGET(config.fbDataUrl + 1 + '/activities/date/today.json')
      .respond(200, { summary: { steps: 87654 } });
    fbUserAuth.getFbUserSteps(1);
    $httpBackend.flush();
    expect(fbUserAuth.todaySteps).toBe(87654);
  }));

  it('should get user\'s FitBit profile', angular.mock.inject(function(fbUserAuth) {
    fbUserAuth.todaySteps = 87654;
    $httpBackend.expectGET(config.fbDataUrl + 3 + '/profile.json')
      .respond(200, { user: { encodedId: '6', memberSince: '01-01-2016', strideLengthWalking: '3' } });
    fbUserAuth.getFbUserProfile(3);
    $httpBackend.flush();
    expect(fbUserAuth.encodedId).toBe('6');
    expect(fbUserAuth.memberSince).toBe('01-01-2016');
    expect(fbUserAuth.strideLength).toBe('3');
    expect(fbUserAuth.todayDistance).toBe(fbUserAuth.todaySteps * fbUserAuth.strideLength);
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
    fbUserAuth.getFbUserActivities(2);
    $httpBackend.flush();
    expect(fbUserAuth.lifeTimeSteps).toBe(1);
    expect(fbUserAuth.lifeTimeDistance).toBe(3);
    expect(fbUserAuth.bestSteps.date).toBe('2016-01-02');
    expect(fbUserAuth.bestSteps.value).toBe(1);
    expect(fbUserAuth.bestDistance.date).toBe('2016-02-01');
    expect(fbUserAuth.bestDistance.value).toBe(8);
  }));
});
