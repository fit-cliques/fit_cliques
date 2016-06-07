/* eslint-disable no-unused-expressions */

var config = require('../../config');

module.exports = function(app) {
  app.factory('fitCliqueAuth', ['$http', '$q', function($http, $q) {
    return {
      removeToken: function() {},
      saveToken: function() {},
      getToken: function() {},
      getUsername: function() {}
    };
  }]);
};
