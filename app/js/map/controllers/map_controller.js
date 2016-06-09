module.exports = function(app) {
  app.controller('MapController', function() {
    var mapEle = document.getElementById('map');
    var mapOptions = {
      zoom: 10,
      center: new google.maps.LatLng(47.608013, -122.335167),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(mapEle, mapOptions);
  });
};
