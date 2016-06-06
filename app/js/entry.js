const angular = require('angular');
require('angular-route');

const fitCliquesApp = angular.module('fitCliquesApp', ['ngRoute']);

require('./services')(fitCliquesApp);
