const angular = require('angular');
const fitCliqueApp = angular.module('fitCliqueApp', [require('angular-route')]);

require('./services')(fitCliqueApp);
require('./user')(fitCliqueApp);
// require('./auth')(fitCliqueApp);

fitCliqueApp.config(['$routeProvider', function($rp) {
  $rp
  .when('/user', {
    templateUrl: 'templates/user/views/user_view.html',
    controller: 'UserController',
    controllerAs: 'userctrl'
  })
  .when('/signin', {
    templateUrl: 'templates/auth/views/auth_view.html',
    controller: 'SignInController',
    controllerAs: 'authctrl'
  })
  .when('/signup', {
    templateUrl: 'templates/auth/views/auth_view.html',
    controller: 'SignUpController',
    controllerAs: 'authctrl'
  })
  .otherwise({
    redirectTo: '/signin'
  });
}]);
