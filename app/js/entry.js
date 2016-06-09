const angular = require('angular');
const fitCliqueApp = angular.module('fitCliqueApp', [require('angular-route')]);

require('./services')(fitCliqueApp);
require('./user')(fitCliqueApp);
require('./auth')(fitCliqueApp);
require('./map')(fitCliqueApp);

fitCliqueApp.config(['$routeProvider', function($rp) {
  $rp
  .when('/user', {
    templateUrl: 'templates/user/views/user_view.html',
    controller: 'MapController',
    controllerAs: 'mapCtrl'
  })
  .when('/signin', {
    templateUrl: 'templates/auth/views/sign_in_view.html',
    controller: 'SignInController',
    controllerAs: 'authctrl'
  })
  .when('/signup', {
    templateUrl: 'templates/auth/views/sign_up_view.html',
    controller: 'SignUpController',
    controllerAs: 'authctrl'
  })
  .when('/resync', {
    templateUrl: 'templates/auth/views/sign_in_view.html',
    controller: 'ResyncController',
    controllerAs: 'authctrl'
  })
  .otherwise({
    redirectTo: '/signin'
  });
}]);
