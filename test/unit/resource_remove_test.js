const angular = require('angular');
const config = require('../../app/js/config');

describe('deleting a user', function() {
  beforeEach(angular.mock.module('fitCliqueApp'));

  it('should return a function', angular.mock.inject(function(CrudResource) {
    expect(typeof CrudResource).toBe('function');
  }));

  it('should remove a user', angular.mock.inject(function(CrudResource, $httpBackend) {
    $httpBackend.expectDELETE(config.baseUrl + '/api/user/1').respond(200);
    var userArray = [{ username: 'Phil', _id: 1 }];
    var errorsArray = [];
    var baseUrl = config.baseUrl + '/api/user';
    var resource = new CrudResource(userArray, errorsArray, baseUrl); // eslint-disable-line new-cap

    resource.remove(userArray[0]);
    $httpBackend.flush();
    expect(userArray.length).toBe(0);
  }));
});
