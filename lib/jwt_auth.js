const User = require(__dirname + '/../models/user');
const jwt = require('jsonwebtoken');

module.exports = exports = function(req, res, next) {
  jwt.verify(req.headers.token, process.env.APP_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: 'could not authenticate' });
    User.findOne({ findHash: decoded.idd }, (err, user) => {
      if (err) return res.status(403).json({ msg: 'could not authenticate, db err' });
      if (!user) return res.status(403).json({ msg: 'could not authenticate, user err' });

      req.user = user;
      next();
    });
  });
};
