/* eslint-disable no-unused-expressions */

var config = require('../../config');

module.exports = function(app) {
  app.factory('fitCliqueAuth', ['$http', '$q', function($http, $q) {
    return {
      removeToken: function() {
        this.token = null;
        this.username = null;
        this._id = null;
        window.localStorage.token = '';
      },
      saveToken: function(token) {
        this.token = token;
        window.localStorage.token = token;
        return token;
      },
      getToken: function() {
        this.token || this.saveToken(window.localStorage.token);
        return this.token;
      },
      getUsername: function() {
        return $q(function(resolve, reject) {
          if (this.username && this._id) {
            return resolve({ username: this.username, _id: this._id });
          }
          if (!this.getToken()) return reject(new Error('no app auth token'));

          $http.get(config.baseUrl + '/api/profile',
          { headers: { token: window.localStorage.token } })
            .then((res) => {
              this.username = res.data.username;
              this._id = res.data._id;
              resolve({ username: res.data.username, _id: res.data._id });
            }, reject);
        }.bind(this));
      }
    };
  }]);
};
