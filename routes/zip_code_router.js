const Router = require('express').Router;
const User = require(__dirname + '/../models/user');
const handleErr = require(__dirname + '/../lib/handle_err');
const makeZip = require(__dirname + '/../lib/make_zip');
const async = require('async');

var zipcodeRouter = module.exports = Router();

zipcodeRouter.get('/zipcode', (req, res) => {
  User.distinct('zipCode', (err, zips) => {
    if (err) return handleErr(err, res);
    var zipCodes = {};
    async.each(zips, (ele, cb) => {
      User.find({ zipCode: ele },
        {
          password: 0,
          encodedId: 0,
          fbRefreshToken: 0,
          fbToken: 0,
          fbUserId: 0,
          findHash: 0
        })
        .sort({ todaySteps: -1 }).exec((err, zip) => {
          if (err) return handleErr(err, res);

          zipCodes[ele] = makeZip(zip);
          cb();
      });
    }, (err) => {
      if (err) return handleErr(err, res);
      res.status(200).json(zipCodes);
    });
  });
});

zipcodeRouter.get('/zipcode/:zipcode_id', (req, res) => {
  User.find( { zipCode: req.params.zipcode_id },
    {
      password: 0,
      encodedId: 0,
      fbRefreshToken: 0,
      fbToken: 0,
      fbUserId: 0,
      findHash: 0
    })
    .sort({ todaySteps: -1 }).exec((err, data) => {
      if (err) return handleErr(err, res);

      res.status(200).send(makeZip(data));
  });
});
