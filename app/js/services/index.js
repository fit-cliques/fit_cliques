module.exports = function(app) {
  require('./handle_error')(app);
  require('./resource.js')(app);
  require('./user_fb_auth')(app);
};
