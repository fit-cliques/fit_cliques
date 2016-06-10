'use strict';
const Router = require('express').Router;
const User = require(__dirname + '/../models/user');
const bodyParser = require('body-parser').json();
const jwToken = require(__dirname + '/../lib/jwt_auth');
const handleErr = require(__dirname + '/../lib/handle_err');

let userRouter = module.exports = Router();

userRouter.route('/user')

.post(jwToken, bodyParser, (req, res) => {
  let newUser = new User(req.body);
  newUser.save((err, data) => {
    if (err) return handleErr(err, res);
    res.status(200).json(data);
  });
})

.get((req, res) => {
  User.find((err, userdata) => {
    if (err) return handleErr(err, res);
    res.status(200).json(userdata);
  });
});

userRouter.route('/user/:user_id')

.get((req, res) => {
  User.findById(req.params.user_id, (err, userdata) => {
    if (err) return handleErr(err, res);
    res.status(200).json(userdata);
  });
})

.put(jwToken, bodyParser, (req, res) => {
  User.findByIdAndUpdate(req.params.user_id, req.body, (err, userdata) => {
    if (err) return handleErr(err, res);
    userdata.save((err) => {
      if (err) return handleErr(err, res);
    });
    res.status(200).json({ msg: 'Successfully updated!' });
  });
})

.delete(jwToken, (req, res) => {
  User.remove({
    _id: req.params.user_id
  }, (err) => {
    if (err) return handleErr(err, res);
    res.json({ msg: 'Successfully deleted!' });
  });
});
