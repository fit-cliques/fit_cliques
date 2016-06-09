const config = require('../config');

module.exports = function(app) {
  app.factory('fbUserAuth', ['$http', '$q', 'fcHandleError', function($http, $q, handleError) {
    return {
      getFbTokens: function(urlCode, cb) {
        this.user = {};
        this.errors = [];
        this.urlCode = urlCode;
        $http({
          method: 'POST',
          url: config.fbAuthUrl,
          headers: {
            'Authorization': 'Basic ' +
              window.btoa(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: 'grant_type=authorization_code' +
            '&clientId=' + process.env.CLIENT_ID +
            // 'redirect_uri': 'https%3A%2F%2Ffit-cliques.herokuapp.com%2Fsignup',
            '&redirect_uri=http%3A%2F%2Flocalhost:5555%2Fsignup' +
            '&code=' + urlCode
        }).then((res) => {
          this.user.fbToken = res.data.access_token;
          this.user.fbRefreshToken = res.data.refresh_token;
          this.user.fbUserId = res.data.user_id;
          if (cb) cb();
        }, handleError(this.errors, 'could not get tokens'));
      },

      getFbUserSteps: function(userId, cb) {
        $http({
          method: 'GET',
          url: config.fbDataUrl + (userId || this.user.fbUserId) + '/activities/date/today.json',
          headers: {
            'Authorization': 'Bearer ' + this.user.fbToken
          }
        }).then((res) => {
          this.user.todaySteps = res.data.summary.steps;
          if (cb) cb();
        }, handleError(this.errors, 'could not get steps'));
      },

      getFbUserProfile: function(userId, cb) {
        $http({
          method: 'GET',
          url: config.fbDataUrl + (userId || this.user.fbUserId) + '/profile.json',
          headers: {
            'Authorization': 'Bearer ' + this.user.fbToken
          }
        }).then((res) => {
          this.user.encodedId = res.data.user.encodedId;
          this.user.memberSince = res.data.user.memberSince;
          this.user.strideLength = res.data.user.strideLengthWalking;
          var strideNum = parseInt(this.user.strideLength, 10);
          var todayStepNum = parseInt(this.user.todaySteps, 10);
          var todayDistNum = todayStepNum / 2 * strideNum * 0.00001578;
          this.user.todayDistance = todayDistNum.toFixed(2);
          if (cb) cb();
        }, handleError(this.errors, 'could not get profile'));
      },

      getFbUserActivities: function(userId, cb) {
        $http({
          method: 'GET',
          url: config.fbDataUrl + (userId || this.user.fbUserId) + '/activities.json',
          headers: {
            'Authorization': 'Bearer ' + this.user.fbToken
          }
        }).then((res) => {
          this.user.lifetimeSteps = res.data.lifetime.total.steps;
          this.user.lifetimeDistance = res.data.lifetime.total.distance;
          this.user.bestSteps = res.data.best.total.steps;
          this.user.bestDistance = res.data.best.total.distance;
          var curDate = new Date();
          var dateArr = this.user.memberSince.split('-');
          var memberSince = new Date(dateArr[0], dateArr[1], dateArr[2]);
          var numDays = Math.round(Math.abs(+curDate - +memberSince) / 8.64e7);
          this.user.lifetimeAvgSteps = this.user.lifetimeSteps / numDays;
          this.user.lifetimeAvgSteps = +this.user.lifetimeAvgSteps.toFixed();
          if (cb) cb();
        }, handleError(this.errors, 'could not get lifetime'));
      },

      getFbUserWeek: function(userId, cb) {
        $http({
          method: 'GET',
          url: config.fbDataUrl + (userId || this.user.fbUserId) +
          '/activities/steps/date/today/1w.json',
          headers: {
            'Authorization': 'Bearer ' + this.user.fbToken
          }
        }).then((res) => {
          this.user.lastSeven = res.data['activities-steps'];
          this.user.weekSteps = 0;
          this.user.lastSeven.forEach((ele) => {
            this.user.weekSteps += parseInt(ele.value, 10);
          });
          this.user.weekAvgSteps = this.user.weekSteps / 7;
          this.user.weekAvgSteps = +this.user.weekAvgSteps.toFixed();
          var strideNum = parseInt(this.user.strideLength, 10);
          var weekDistNum = this.user.weekSteps / 2 * strideNum * 0.00001578;
          this.user.weekDistance = +weekDistNum.toFixed(2);
          if (cb) cb();
        }, handleError(this.errors, 'could not get username'));
      },

      updateFbUserToken: function(cb) {
        $http({
          method: 'POST',
          url: config.fbAuthUrl,
          headers: {
            'Authorization': 'Basic ' +
              window.btoa(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: 'grant_type=refresh_token' +
            '&refresh_token=' + this.user.fbRefreshToken
        }).then((res) => {
          this.user.fbToken = res.data.access_token;
          this.user.fbRefreshToken = res.data.refresh_token;
          this.user.fbUserId = res.data.user_id;
          if (cb) cb();
        }, (err) => {
          console.log(err);
          cb(err);
        });
      },

      resyncFbTokens: function(urlCode, cb) {
        this.errors = [];
        this.urlCode = urlCode;
        $http({
          method: 'POST',
          url: config.fbAuthUrl,
          headers: {
            'Authorization': 'Basic ' +
              window.btoa(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: 'grant_type=authorization_code' +
            '&clientId=' + process.env.CLIENT_ID +
            // 'redirect_uri': 'https%3A%2F%2Ffit-cliques.herokuapp.com%2Fresync',
            '&redirect_uri=http%3A%2F%2Flocalhost:5555%2Fresync' +
            '&code=' + urlCode
        }).then((res) => {
          this.user.fbToken = res.data.access_token;
          this.user.fbRefreshToken = res.data.refresh_token;
          this.user.fbUserId = res.data.user_id;
          if (cb) cb();
        }, handleError(this.errors, 'could not get tokens'));
      }
    };
  }]);
};
