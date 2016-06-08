var config = require('../../config');
const async = require('async');

module.exports = function(app) {
  app.controller('SignInController', ['$http', '$location',
  'fcHandleError', 'fitCliqueAuth', 'fbUserAuth',
  function($http, $location, handleError, fitCliqueAuth, fbUserAuth) {
    this.buttonText = 'Sign in to existing user';
    this.errors = [];

    this.authenticate = function(user) {
      $http({
        method: 'GET',
        url: config.baseUrl + '/api/signin',
        headers: {
          'Authorization': 'Basic ' + window.btoa(user.username + ':' + user.password)
        }
      }).then((res) => {
        fitCliqueAuth.saveToken(res.data.token);
        fitCliqueAuth.getUsername()
          .then((currentUser) => {
            $http({
              method: 'GET',
              url: config.baseUrl + '/api/user/' + currentUser._id
            }).then((res) => {
              fbUserAuth.user = res.data;
              async.series([
                function(cb) {
                  fbUserAuth.updateFbUserToken(cb);
                },
                function(cb) {
                  fbUserAuth.getFbUserSteps(fbUserAuth.fbUserId, cb);
                },
                function(cb) {
                  fbUserAuth.getFbUserProfile(fbUserAuth.fbUserId, cb);
                },
                function(cb) {
                  fbUserAuth.getFbUserActivities(fbUserAuth.fbUserId, cb);
                },
                function(cb) {
                  fbUserAuth.getFbUserWeek(fbUserAuth.fbUserId, cb);
                }
              ], function(err) {
                if (err) console.log(err);
                $location.path('/user');
              });
            });
          });
      }, handleError(this.errors, 'could not sign in to user'));
    };
  }]);
};
