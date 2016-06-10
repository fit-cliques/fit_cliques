const mongoose = require('mongoose');
const server = require(__dirname + '/../server');

module.exports = exports = (cb) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.disconnect(() => {
      server.close(cb);
    });
  });
};
