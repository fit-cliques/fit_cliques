var config = require('../../config');

module.exports = function(app) {
  app.controller('SignUpController', ['$http', '$location', '$fcHandleError', 'fitCliqueAuth',
  function($http, $location, handleError, fitCliqueAuth) {
    this.signup = true;
    this.errors = [];
    this.buttonText = 'Create New User';

    this.authenticate = function(user) {
      $http.post(config.baseUrl + '/api/signup', user)
        .then((res) => {
          fitCliqueAuth.saveToken(res.data.token);
          fitCliqueAuth.getUsername();
          $location.path('/user');
        }, handleError(this.ererors, 'could not create user'));
    };
  }]);
};
