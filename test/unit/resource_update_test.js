const angular = require('angular');
const config = require('../../app/js/config');

describe('CrudResource', function() {
  beforeEach(angular.mock.module('fitCliqueApp'));

  it('should return a function', angular.mock.inject(function(CrudResource) {
    expect(typeof CrudResource).toBe('function');
  }));

  it('should update a user', angular.mock.inject(function(CrudResource, $httpBackend) {
    $httpBackend.expectPUT(config.baseUrl + '/api/user/1', { username: 'Phil', fitbitToken: 1234, _id: 1 }).respond(200);
    var userArray = [{ username: 'Phil', fitbitToken: 1111, _id: 1 }];
    var errorsArray = [];
    var baseUrl = config.baseUrl + '/api/user';
    var resource = new CrudResource(userArray, errorsArray, baseUrl);

    userArray[0].fitbitToken = 1234;
    resource.update(userArray[0]);
    $httpBackend.flush();
    expect(userArray[0].fitbitToken).toBe(1234);
  }));
});
