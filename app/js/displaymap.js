module.exports = {
  initMap: function(currentLat, currentLng) {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
      center: new google.maps.LatLng(currentLat, currentLng),
      zoom: 15,
      mapTypeId:google.maps.MapTypeId.ROADMAP
    });
  }
};
