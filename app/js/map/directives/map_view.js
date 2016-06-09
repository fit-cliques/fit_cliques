module.exports = function(app) {
  app.directive('uiGmapGoogleMaps', function() {
    return {
      restrict: 'EAC',
      replace: true,
      require: '^ngController',
      transclude: true,
      templateUrl: '/templates/maps/views/map_view.html',
      scope: {
        map: '='
      },

      link: function(scope, element, attrs, controller) {
        scope.remove = controller.removeMug;
      }
    };
  });
};
