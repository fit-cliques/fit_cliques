'use strict';
const Router = require('express').Router;
const User = require(__dirname + '/../models/user');
const jwToken = require(__dirname + '/../lib/jwt_auth');
const handleErr = require(__dirname + '/../lib/handle_err');

let zipcodeRouter = module.exports = Router();

zipcodeRouter.route('/user/zipcode/:zipcode_id')

.get(jwToken, (req, res) => {
  let promise = User.find( { zipCode: req.params.zipcode_id }).exec();
  promise.then((data) => {
    let count = 0;
    let avgLifeTimeSteps;
    let totalSteps = 0;
    for (var i = 0; i < data.length; i++) {
      count++;
      totalSteps += data[i].lifetimeSteps;
    }
    avgLifeTimeSteps = totalSteps / count;
    res.status(200).send({ averageLifeTimeSteps: avgLifeTimeSteps, users: data });
  })
  .catch((err) => {
    if (err) return handleErr(err, res);
  });
});
