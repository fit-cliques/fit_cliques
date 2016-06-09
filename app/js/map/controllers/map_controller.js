var config = require('../../config');
const async = require('async');

module.exports = function(app) {
  app.controller('MapController', ['$http', 'fbUserAuth', function($http, fbUserAuth) {
    var mapEle = document.getElementById('map');


    $http.get(config.baseUrl + '/api/zipcode')
      .then(function(res) {
        var zipCodes = res.data;

        var uniqueZipcodes = Object.keys(zipCodes);

        $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' +
        98144 + '+usa')
        .then(function(res) {
          var latlng = new google.maps.LatLng(res.data.results[0].geometry.location.lat,
            res.data.results[0].geometry.location.lng);
          var mapOptions = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          this.map = new google.maps.Map(mapEle, mapOptions);

          uniqueZipcodes.forEach((ele) => {
            $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' +
            ele + 'usa')
            .then((res) => {
              var zipLatLng = new google.maps.LatLng(res.data.results[0].geometry.location.lat,
                res.data.results[0].geometry.location.lng);
              var marker = new google.maps.Marker({
                position: zipLatLng,
                map: this.map,
                title: 'Hello World!'
              });
            });
          });
        });
      });
  }]);
};
