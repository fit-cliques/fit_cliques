const config = require('../config');

module.exports = function(app) {
  app.factory('fbUserAuth', ['$http', '$q', function($http, $q) {
    return {
      getFbTokens: function(urlCode, cb) {
        this.user = {};
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
          console.log(res.data);
          this.user.fbToken = res.data.access_token;
          this.user.fbRefreshToken = res.data.refresh_token;
          this.user.fbUserId = res.data.user_id;
          if (cb) cb();
        }, (errRes) => {
          console.log(errRes);
        });
      },

      getFbUserSteps: function(userId, cb) {
        $http({
          method: 'GET',
          url: config.fbDataUrl + (userId || this.user.fbUserId) + '/activities/date/today.json',
          headers: {
            'Authorization': 'Bearer ' + this.user.fbToken
          }
        }).then((res) => {
          console.log(res.data);
          this.user.todaySteps = res.data.summary.steps;
          if (cb) cb();
        }, (errRes) => {
          console.log(errRes);
        });
      },

      getFbUserProfile: function(userId, cb) {
        $http({
          method: 'GET',
          url: config.fbDataUrl + (userId || this.user.fbUserId) + '/profile.json',
          headers: {
            'Authorization': 'Bearer ' + this.user.fbToken
          }
        }).then((res) => {
          console.log(res.data);
          this.user.encodedId = res.data.user.encodedId;
          this.user.memberSince = res.data.user.memberSince;
          this.user.strideLength = res.data.user.strideLengthWalking;
          this.user.todayDistance = parseInt(this.user.todaySteps, 10) *
            parseInt(this.user.strideLength, 10);
          if (cb) cb();
        }, (errRes) => {
          console.log(errRes);
        });
      },

      getFbUserActivities: function(userId, cb) {
        $http({
          method: 'GET',
          url: config.fbDataUrl + (userId || this.user.fbUserId) + '/activities.json',
          headers: {
            'Authorization': 'Bearer ' + this.user.fbToken
          }
        }).then((res) => {
          console.log(res.data);
          this.user.lifeTimeSteps = res.data.lifetime.total.steps;
          this.user.lifeTimeDistance = res.data.lifetime.total.distance;
          this.user.bestSteps = res.data.best.total.steps;
          this.user.bestDistance = res.data.best.total.distance;
          if (cb) cb();
        }, (errRes) => {
          console.log(errRes);
        });
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
        }, (errRes) => {
          console.log(errRes);
        });
      }
    };
  }]);
};
