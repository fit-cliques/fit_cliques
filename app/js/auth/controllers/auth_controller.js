module.exports = function(app) {
  app.controller('AuthController', ['fitCliqueAuth', 'fcHandleError', '$location',
  function(fitCliqueAuth, handleError, $location) {
    this.username = '';
    this.errors = [];
    this.getUsername = function() {
      fitCliqueAuth.getUsername()
        .then((currentUser) => {
          this.username = currentUser;
        }, handleError(this.errors, 'could not get username'));
    }.bind(this);

    this.logout = function() {
      fitCliqueAuth.removeToken();
      this.username = '';
      $location.path('/signin');
    }.bind(this);
  }]);
};
