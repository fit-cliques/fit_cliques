module.exports = {
  initMap: function() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
      center: { lat: 47.608013, lng: -122.335167 },
      zoom: 10
    }
  );}
};
