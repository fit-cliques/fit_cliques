const angular = require('angular');
var config = require('../../app/js/config');

describe('it should test a service', function() {
  beforeEach(angular.mock.module('fitCliqueApp'));

  it('should return a function', angular.mock.inject(function(CrudResource) {
    expect(typeof CrudResource).toBe('function');
  }));

  it('should get all users', angular.mock.inject(function(CrudResource, $httpBackend) {
    $httpBackend.expectGET(config.baseUrl + '/api/user').respond(200, [{ username: 'Phil' }]);

    var userArray = [];
    var errorsArray = [];
    var baseUrl = config.baseUrl + '/api/user';
    var resource = new CrudResource(userArray, errorsArray, baseUrl);

    resource.getAll();
    $httpBackend.flush();
    expect(userArray.length).toBe(1);
    expect(userArray[0].username).toBe('Phil');
  }));
});
