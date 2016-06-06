const config = require('../config');

module.exports = function(app) {
  app.factory('fbUserAuth', ['$http', '$q', function($http, $q) {
    return {
      fbToken: '',
      fbRefreshToken: '',
      fbUserId: '',
      getFbTokens: function(urlCode) {
        this.urlCode = urlCode;
        $http({
          method: 'POST',
          url: config.fbAuthUrl,
          headers: {
            'Authorization': 'Basic ' +
              window.btoa(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            'clientId': process.env.CLIENT_ID,
            'grant_type': 'authorization_code',
            'redirect_uri': 'https%3A%2F%2Ffit-cliques.herokuapp.com%2Fsignup',
            'code': urlCode
          }
        }).then((res) => {
          this.fbToken = res.data.access_token;
          this.fbRefreshToken = res.data.refresh_token;
          this.fbUserId = res.data.user_id;
        });
      }
    };
  }]);
};
