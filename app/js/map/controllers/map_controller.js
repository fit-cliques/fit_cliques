var config = require('../../config');
const async = require('async');

module.exports = function(app) {
  app.controller('MapController', ['$http', 'fbUserAuth', function($http, fbUserAuth) {
    this.user = fbUserAuth.user;
    var mapEle = document.getElementById('map');

    $http.get(config.baseUrl + '/api/zipcode')
      .then(function(res) {
        var zipCodes = res.data;

        var uniqueZipcodes = Object.keys(zipCodes);

        $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' +
        fbUserAuth.user.zipCode + '+usa')
        .then(function(res) {
          var latlng = new google.maps.LatLng(res.data.results[0].geometry.location.lat,
            res.data.results[0].geometry.location.lng);
          var mapOptions = {
            zoom: 10,
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
                title: ele + ' Average Steps: ' + zipCodes[ele].avgTodaySteps
              });
            });
          });

          var zipUsers = zipCodes[fbUserAuth.user.zipCode].data;
          if (zipUsers.length > 5) zipUsers.length = 5;
          var userNames = [];
          var userSteps = [];

          zipUsers.forEach((ele) => {
            userNames.push(ele.username);
            userSteps.push(ele.todaySteps);
          });

          var ctx = document.getElementById('myChart');

          var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: userNames,
              datasets: [{
                label: '# of Steps',
                data: userSteps,
                backgroundColor: [
                  '#EE9600',
                  '#CC8B1A',
                  '#AB8034',
                  '#89754E',
                  '#686B69'
                ],
                borderColor: [
                  '#000000',
                  '#09181D',
                  '#13313B',
                  '#1C4958',
                  '#266276'
                ],
                borderWidth: 3
              }]
            },
            options: {
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
        });
      });
  }]);
};
