const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const basicHTTP = require(__dirname + '/../lib/basic_http');
const User = require(__dirname + '/../models/user');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');

var authRouter = module.exports = exports = Router();

authRouter.post('/signup', bodyParser, (req, res) => {
  var password = req.body.password;
  req.body.password = null;

  if (!password) return res.status(500).json({ msg: 'no blank passwords' });

  var newUser = new User(req.body);
  newUser.generateHash(password);
  password = null;

  newUser.save((err, user) => {
    if (err) return res.status(500).json({ msg: 'could not create user' });

    user.generateToken((err, token) => {
      if (err) return res.status(500).json({ msg: 'could not generate token' });
      res.json({ token });
    });
  });
});
