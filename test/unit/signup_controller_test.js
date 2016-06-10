/* eslint-disable camelcase */
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
    $httpBackend.expectPOST(config.fbAuthUrl)
      .respond(200, {
        access_token: 'token3',
        refresh_token: 'token4',
        user_id: 'id2'
      });

    $httpBackend.expectGET('https://api.fitbit.com/1/user/id2/activities/date/today.json')
      .respond(200, {
        summary: {
          steps: 1000
        }
      });

    $httpBackend.expectGET('https://api.fitbit.com/1/user/id2/profile.json')
      .respond(200, {
        user: {
          encodedId: 'id2',
          memberSince: '2016-01-02',
          strideLengthWalking: 80
        }
      });

    $httpBackend.expectGET('https://api.fitbit.com/1/user/id2/activities.json')
      .respond(200, {
        lifetime: {
          total: {
            steps: 100,
            distance: 3
          }
        },
        best: {
          total: {
            steps: 100,
            distance: 4
          }
        }
      });

    $httpBackend.expectGET('https://api.fitbit.com/1/user/id2/activities/steps/date/today/1w.json')
      .respond(200, {
        'activities-steps': [100, 100, 100, 100, 100, 100, 100]
      });

    $httpBackend.expectPOST(config.baseUrl + '/api/signup', {
      'username': 'Phil',
      'fbToken': 'token3',
      'fbRefreshToken': 'token4',
      'fbUserId': 'id2',
      'todaySteps': 1000,
      'encodedId': 'id2',
      'memberSince': '2016-01-02',
      'strideLength': 80,
      'todayDistance': '0.63',
      'lifetimeSteps': 100,
      'lifetimeDistance': 3,
      'bestSteps': 100,
      'bestDistance': 4,
      'lifetimeAvgSteps': 1,
      'lastSeven': [100, 100, 100, 100, 100, 100, 100],
      'weekSteps': null,
      'weekAvgSteps': null,
      'weekDistance': null
    })
      .respond(200, { token: 'slothbear' });

    $httpBackend.expectGET(config.baseUrl + '/api/profile')
      .respond(200, { username: 'testuser' });

    authctrl.authenticate({ username: 'Phil' });
    $httpBackend.flush();
    expect(window.localStorage.token).toBe('slothbear');
  });
});
