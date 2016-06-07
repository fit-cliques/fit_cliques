var config = require('../../config');

module.exports = function(app) {
  app.controller('SignInController', ['$http', '$location', 'fcHandleError', 'fitCliqueAuth',
  function($http, $location, handleError, fitCliqueAuth) {
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
        fitCliqueAuth.getUsername();
        $location.path('/user');
      }, handleError(this.errors, 'could not sign in to user'));
    };
  }]);
};
