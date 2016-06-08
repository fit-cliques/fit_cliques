var config = require('../../config');
const async = require('async');

module.exports = function(app) {
  app.controller('SignUpController', ['$http', '$location', '$routeParams',
  'fcHandleError', 'fitCliqueAuth', 'fbUserAuth', function($http, $location, $routeParams,
  handleError, fitCliqueAuth, fbUserAuth) {
    this.errors = [];
    this.buttonText = 'Create New User';

    this.authenticate = function(user) {
      async.series([
        function(cb) {
          fbUserAuth.getFbTokens($routeParams.code, cb);
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
        Object.assign(user, fbUserAuth.user);

        $http.post(config.baseUrl + '/api/signup', user)
          .then((res) => {
            fitCliqueAuth.saveToken(res.data.token);
            fitCliqueAuth.getUsername();
            $location.path('/user');
          }, handleError(this.errors, 'could not create user'));
      });
    };
  }]);
};
