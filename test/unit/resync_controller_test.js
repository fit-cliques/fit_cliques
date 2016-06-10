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
    authctrl = $controller('ResyncController');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should resync tokens and store user data', function() {
    $httpBackend.expectGET(config.baseUrl + '/api/signin',
      {
        'Authorization': 'Basic UGhpbDp1bmRlZmluZWQ=',
        'Accept': 'application/json, text/plain, */*'
      })
      .respond(200, { token: 'slothbear' });

    $httpBackend.expectGET(config.baseUrl + '/api/profile')
      .respond(200, { username: 'testuser', _id: '55555' });

    $httpBackend.expectGET(config.baseUrl + '/api/user/55555')
      .respond(200, {
        _id: 55555,
        username: 'testuser',
        encodedId: 'id',
        fbToken: 'token1',
        fbRefreshToken: 'token2',
        fbUserId: 'id',
        zipCode: '98144',
        memberSince: '2016-01-01',
        strideLength: 80,
        todaySteps: 1000,
        todayDistance: 2,
        weekSteps: 4000,
        weekAvgSteps: 100,
        weekDistance: 5,
        lifetimeSteps: 10000,
        lifetimeAvgSteps: 200,
        lifetimeDistance: 10,
        lastSeven: [],
        bestSteps: {},
        bestDistance: {}
      });

    $httpBackend.expectPOST(config.fbAuthUrl)
      .respond(200, {
        access_token: 'token3',
        refresh_token: 'token4',
        user_id: 'id2'
      });

    $httpBackend.expectGET('https://api.fitbit.com/1/user/id2/activities/date/today.json')
      .respond(200, {
        summary: {
          steps: 1500
        }
      });

    $httpBackend.expectGET('https://api.fitbit.com/1/user/id2/profile.json')
      .respond(200, {
        user: {
          encodedId: 'id2',
          memberSince: '2016-01-02',
          strideLengthWalking: 85
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

    $httpBackend.expectPUT(config.baseUrl + '/api/user/55555')
      .respond(200);

    authctrl.authenticate({ username: 'Phil' });
    $httpBackend.flush();
    expect(window.localStorage.token).toBe('slothbear');
  });
});
