const angular = require('angular');
const config = require('../../app/js/config');

describe('crudResource', function() {
  var crudResource;

  beforeEach(angular.mock.module('fitCliqueApp'));

  it('should return a function', angular.mock.inject(function(crudResource) {
    expect(typeof crudResource).toBe('function');
  }));

  it('should update a user', angular.mock.inject(function(crudResource, $httpBackend) {
    $httpBackend.expectPUT(config.baseUrl + '/api/user/1', { username: 'Phil', fitbitToken: 1234, _id: 1 }).respond(200);
    var userArray = [{ username: 'Phil', fitbitToken: 1111, _id: 1 }];
    var errorsArray = [];
    var baseUrl = config.baseUrl + '/api/user';
    var resource = new crudResource(userArray, errorsArray, baseUrl); // eslint-disable-line new-cap

    userArray[0].fitbitToken = 1234;
    resource.update(userArray[0]);
    $httpBackend.flush();
    expect(userArray[0].fitbitToken).toBe(1234);
  }));
});
