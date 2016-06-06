module.exports = function(app) {
  require('./controllers')(app);
  require('./services')(app);
};
