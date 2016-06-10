var baseUrl = require('../../config').baseUrl;

module.exports = function(app) {
  app.controller('UserController', ['CrudResource', function(Resource) {
    this.user = [];
    this.errors = [];
    var crud = new Resource(this.user, this.errors, baseUrl + '/api/user',
    { errMessage: { getAll: 'custom error message' } });
    this.getAll = crud.getAll.bind(crud);
    this.createUser = function() {
      crud.create(this.newUser)
      .then(() => {
        this.newUser = null;
      });
    }.bind(this);
    this.updateUser = function(user) {
      crud.update(user)
      .then(() => {
        user.editing = false;
      });
    };
    this.removeUser = function(user) {
      crud.remove(user)
        .then(() => {
          this.user = crud.data;
        });
    };
  }]);
};
