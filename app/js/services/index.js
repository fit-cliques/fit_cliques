module.exports = function(app) {
  require('./handle_error')(app);
  require('./resource.js')(app);
};
