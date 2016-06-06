const config = require('../config');

module.exports = function(app) {
  app.factory('fbUserAuth', ['$http', '$q', function($http, $q) {
    return {
      fbToken: '',
      fbRefreshToken: '',
      fbUserId: '',
      todaySteps: '',
      todayDistance: '',
      memberSince: '',
      encodedId: '',
      strideLength: '',
      getFbTokens: function(urlCode) {
        this.urlCode = urlCode;
        $http({
          method: 'POST',
          url: config.fbAuthUrl,
          headers: {
            'Authorization': 'Basic ' +
              window.btoa(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            'clientId': process.env.CLIENT_ID,
            'grant_type': 'authorization_code',
            'redirect_uri': 'https%3A%2F%2Ffit-cliques.herokuapp.com%2Fsignup',
            'code': urlCode
          }
        }).then((res) => {
          this.fbToken = res.data.access_token;
          this.fbRefreshToken = res.data.refresh_token;
          this.fbUserId = res.data.user_id;
        });
      },

      getFbUserSteps: function(userId) {
        $http({
          method: 'GET',
          url: config.fbDataUrl + (userId || this.fbUserId) + '/activities/date/today.json',
          headers: {
            'Authorization': 'Bearer ' + this.fbToken
          }
        }).then((res) => {
          this.todaySteps = res.data.summary.steps;
        });
      },

      getFbUserProfile: function(userId) {
        $http({
          method: 'GET',
          url: config.fbDataUrl + (userId || this.fbUserId) + '/profile.json',
          headers: {
            'Authorization': 'Bearer ' + this.fbToken
          }
        }).then((res) => {
          this.encodedId = res.data.user.encodedId;
          this.memberSince = res.data.user.memberSince;
          this.strideLength = res.data.user.strideLengthWalking;
          this.todayDistance = parseInt(this.todaySteps, 10) * parseInt(this.strideLength, 10);
        });
      },

      getFbUserActivities: function(userId) {
        $http({
          method: 'GET',
          url: config.fbDataUrl + (userId || this.fbUserId) + '/activities.json',
          headers: {
            'Authorization': 'Bearer ' + this.fbToken
          }
        }).then((res) => {
          this.lifeTimeSteps = res.data.lifetime.total.steps;
          this.lifeTimeDistance = res.data.lifetime.total.distance;
          this.bestSteps = res.data.best.total.steps;
          this.bestDistance = res.data.best.total.distance;
        });
      }
    };
  }]);
};
