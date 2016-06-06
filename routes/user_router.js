'use strict';
const Router = require('express').Router;
const User = require(__dirname + '/../models/user');
const bodyParser = require('body-parser').json();
const jwToken = require(__dirname + '/../lib/jwt_auth');

let userRouter = module.exports = Router();

userRouter.route('/user')

.post(jwToken, bodyParser, (req, res) => {
  let newUser = new User(req.body);
  newUser.save((err, data) => {
    if (err) {
      res.send(err);
    }
    res.status(200).json(data);
  });
})

.get(jwToken, (req, res) => {
  User.find((err, userdata) => {
    if (err) {
      res.send(err);
    }
    res.send(200).json(userdata);
  });
});

userRouter.route('/user/:user_id')

.put(jwToken, (req, res) => {
  User.findByIdAndUpdate(req.params.user_id, req.body, (err, userdata) => {
    if (err) {
      res.send(err);
    }
    userdata.save((err) => {
      if (err) {
        res.send(err);
      }
    });
    res.status(200).json({ message: 'Successfully updated!' });
  });
})

.delete(jwToken, (req, res) => {
  User.remove({
    _id: req.params.user_id
  }, (err) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: 'Successfully deleted!' });
  });
});
