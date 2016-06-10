module.exports = function(app) {
  app.factory('CrudResource', ['$http', 'fcHandleError', function($http, handleError) {
    var Resource = function(resourceArr, errorsArr, baseUrl, options) {
      this.data = resourceArr;
      this.url = baseUrl;
      this.errors = errorsArr;
      this.options = options || {};
      this.options.errMessages = this.options.errMessages || {};
    };

    Resource.prototype.getAll = function() {
      return $http.get(this.url)
      .then((res) => {
        this.data.splice(0);
        for (var i = 0; i < res.data.length; i++) {
          this.data.push(res.data[i]);
        }
      }, handleError(this.errors, this.options.errMessages.getAll || 'could not retrieve data'));
    };

    Resource.prototype.create = function(resource) {
      return $http.post(this.url, resource, { headers: { token: window.localStorage.token } })
      .then((res) => {
        this.data.push(res.data);
      }, handleError(this.errors, this.options.errMessages.create || 'could not save data'));
    };

    Resource.prototype.update = function(resource) {
      return $http.put(this.url + '/' + resource._id, resource,
      { headers: { token: window.localStorage.token } })
      .catch(handleError(this.errors, this.options.errMessages.update) || 'could not be updated');
    };

    Resource.prototype.remove = function(resource) {
      return $http.delete(this.url + '/' + resource._id, resource,
      { headers: { token: window.localStorage.token } })
      .then(() => {
        this.data.splice(this.data.indexOf(resource), 1);
      }, handleError(this.errors, this.options.errMessages.remove || 'could not remove data'));
    };
    return Resource;
  }]);
};
