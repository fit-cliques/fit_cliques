const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  findHash: { type: String, unique: true },
  encodedId: String,
  fitbitToken: String,
  fitbitRefreshToken: String,
  secQuestion1: String,
  secQuestion2: String,
  secAnswer1: String,
  secAnswer2: String,
  zipCode: String,
  cliques: [String],
  memberSince: Date,
  strideLength: Number,
  todaySteps: Number,
  todayDistance: Number,
  weekSteps: Number,
  weekAvgSteps: Number,
  weekDistance: Number,
  lifetimeSteps: Number,
  lifetimeAvgSteps: Number,
  lifetimeDistance: Number,
  lastSeven: [],
  bestSteps: {},
  bestDistance: {}
});

userSchema.methods.generateHash = function(password) {
  return this.password = bcrypt.hashSync(password, 8);
};

userSchema.methods.compareHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateFindHash = function(cb) {
  var tries = 0;
  var timeout;
  var _generateFindHash = () => {
    var hash = crypto.randomBytes(32);
    this.findHash = hash.toString('hex');
    this.save((err) => {
      if (err) {
        if (tries > 9) {
          return cb(new Error('could not generate hash'));
        }
        return timeout = setTimeout(() => {
          _generateFindHash();
          tries++;
        }, 1000);
      }

      if (timeout) clearTimeout(timeout);
      cb(null, hash.toString('hex'));
    });
  };
  _generateFindHash();
};

userSchema.methods.generateToken = function(cb) {
  this.generateFindHash(function(err, hash) {  // eslint-disable-line prefer-arrow-callback
    if (err) return cb(err);
    cb(null, jwt.sign({ idd: hash }, process.env.APP_SECRET));
  });
};

module.exports = exports = mongoose.model('User', userSchema);
