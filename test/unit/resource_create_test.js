const angular = require('angular');
const config = require('../../app/js/config');

describe('CrudResource', function() {
  beforeEach(angular.mock.module('fitCliqueApp'));

  it('should return a function', angular.mock.inject(function(CrudResource) {
    expect(typeof CrudResource).toBe('function');
  }));

  it('should create a user and store into array', angular.mock.inject(function(CrudResource, $httpBackend) {
    $httpBackend.expectPOST(config.baseUrl + '/api/user', { username: 'Phil' }).respond(200, { username: 'testname' });

    var userArray = [];
    var baseUrl = config.baseUrl + '/api/user';
    var errorsArray = [];
    var resource = new CrudResource(userArray, errorsArray, baseUrl);
    resource.create({ username: 'Phil' });
    $httpBackend.flush();
    expect(userArray.length).toBe(1);
    expect(errorsArray.length).toBe(0);
    expect(userArray[0].username).toBe('testname');
  }));
});
