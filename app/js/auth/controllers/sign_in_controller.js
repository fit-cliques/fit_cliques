var config = require('../../config');
const async = require('async');

module.exports = function(app) {
  app.controller('SignInController', ['$http', '$location', '$window',
  'fcHandleError', 'fitCliqueAuth', 'fbUserAuth',
  function($http, $location, $window, handleError, fitCliqueAuth, fbUserAuth) {
    this.buttonText = 'Sign In';
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
                  fbUserAuth.updateFbUserToken((err) => {
                    if (err) {
                      $window.location.href = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=227THV&redirect_uri=http%3A%2F%2Flocalhost:5555%2Fresync&scope=activity%20profile&expires_in=604800'; // eslint-disable-line max-len
                      // 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=227THV&redirect_uri=https%3A%2F%2Ffit-cliques.herokuapp.com%2Fresync&scope=activity%20profile&expires_in=604800'; // eslint-disable-line max-len
                    }
                    cb();
                  });
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
