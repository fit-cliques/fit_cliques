var config = require('../../config');
const async = require('async');

module.exports = function(app) {
  app.controller('MapController', ['$http', 'fbUserAuth', function($http, fbUserAuth) {
    var mapEle = document.getElementById('map');

    var ctx = document.getElementById('myChart');

    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['98004', '98115'],
        datasets: [{
          label: '# of Votes',
          data: [400, 500],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
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

    console.log(fbUserAuth);

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
                title: ele + ' Average Steps: ' + zipCodes[ele].avgTodaySteps
              });
            });
          });
        });
      });
  }]);
};
