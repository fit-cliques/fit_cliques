const Router = require('express').Router;
const User = require(__dirname + '/../models/user');
const handleErr = require(__dirname + '/../lib/handle_err');
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

          var count = 0;
          var zipTotalTodaySteps = 0;
          var zipTotalTodayDistance = 0;
          var zipTotalWeekSteps = 0;
          var totalWeekAvgSteps = 0;
          var zipTotalWeekDistance = 0;
          var zipTotalLifetimeSteps = 0;
          var totalLifetimeAvgSteps = 0;
          var zipTotalLifetimeDistance = 0;

          for (var i = 0; i < zip.length; i++) {
            count++;
            zipTotalTodaySteps += zip[i].todaySteps;
            zipTotalTodayDistance += zip[i].todayDistance;
            zipTotalWeekSteps += zip[i].weekSteps;
            totalWeekAvgSteps += zip[i].weekAvgSteps;
            zipTotalWeekDistance += zip[i].weekDistance;
            zipTotalLifetimeSteps += zip[i].lifetimeSteps;
            totalLifetimeAvgSteps += zip[i].lifetimeAvgSteps;
            zipTotalLifetimeDistance += zip[i].lifetimeDistance;
          }

          var avgTodaySteps = (zipTotalTodaySteps / count).toFixed();
          var avgTodayDistance = (zipTotalTodayDistance / count).toFixed(2);
          var avgWeekSteps = (zipTotalWeekSteps / count).toFixed();
          var avgWeekStepsPer = (totalWeekAvgSteps / count).toFixed();
          var avgWeekDistance = (zipTotalWeekDistance / count).toFixed(2);
          var avgLifetimeSteps = (zipTotalLifetimeSteps / count).toFixed();
          var avgLifetimeStepsPer = (totalLifetimeAvgSteps / count).toFixed();
          var avgLifetimeDistance = (zipTotalLifetimeDistance / count).toFixed(2);

          zipCodes[ele] = {
            zipTotalTodaySteps: zipTotalTodaySteps,
            zipTotalTodayDistance: zipTotalTodayDistance,
            avgTodaySteps: avgTodaySteps,
            avgTodayDistance: avgTodayDistance,
            zipTotalWeekSteps: zipTotalWeekSteps,
            zipTotalWeekDistance: zipTotalWeekDistance,
            avgWeekSteps: avgWeekSteps,
            avgWeekStepsPer: avgWeekStepsPer,
            avgWeekDistance: avgWeekDistance,
            zipTotalLifetimeSteps: zipTotalLifetimeSteps,
            zipTotalLifetimeDistance: zipTotalLifetimeDistance,
            avgLifetimeSteps: avgLifetimeSteps,
            avgLifetimeStepsPer: avgLifetimeStepsPer,
            avgLifetimeDistance: avgLifetimeDistance,
            data: zip
          };
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
      var count = 0;
      var zipTotalTodaySteps = 0;
      var zipTotalTodayDistance = 0;
      var zipTotalWeekSteps = 0;
      var totalWeekAvgSteps = 0;
      var zipTotalWeekDistance = 0;
      var zipTotalLifetimeSteps = 0;
      var totalLifetimeAvgSteps = 0;
      var zipTotalLifetimeDistance = 0;

      for (var i = 0; i < data.length; i++) {
        count++;
        zipTotalTodaySteps += data[i].todaySteps;
        zipTotalTodayDistance += data[i].todayDistance;
        zipTotalWeekSteps += data[i].weekSteps;
        totalWeekAvgSteps += data[i].weekAvgSteps;
        zipTotalWeekDistance += data[i].weekDistance;
        zipTotalLifetimeSteps += data[i].lifetimeSteps;
        totalLifetimeAvgSteps += data[i].lifetimeAvgSteps;
        zipTotalLifetimeDistance += data[i].lifetimeDistance;
      }

      var avgTodaySteps = (zipTotalTodaySteps / count).toFixed();
      var avgTodayDistance = (zipTotalTodayDistance / count).toFixed(2);
      var avgWeekSteps = (zipTotalWeekSteps / count).toFixed();
      var avgWeekStepsPer = (totalWeekAvgSteps / count).toFixed();
      var avgWeekDistance = (zipTotalWeekDistance / count).toFixed(2);
      var avgLifetimeSteps = (zipTotalLifetimeSteps / count).toFixed();
      var avgLifetimeStepsPer = (totalLifetimeAvgSteps / count).toFixed();
      var avgLifetimeDistance = (zipTotalLifetimeDistance / count).toFixed(2);

      res.status(200).send({
        zipTotalTodaySteps: zipTotalTodaySteps,
        zipTotalTodayDistance: zipTotalTodayDistance,
        avgTodaySteps: avgTodaySteps,
        avgTodayDistance: avgTodayDistance,
        zipTotalWeekSteps: zipTotalWeekSteps,
        zipTotalWeekDistance: zipTotalWeekDistance,
        avgWeekSteps: avgWeekSteps,
        avgWeekStepsPer: avgWeekStepsPer,
        avgWeekDistance: avgWeekDistance,
        zipTotalLifetimeSteps: zipTotalLifetimeSteps,
        zipTotalLifetimeDistance: zipTotalLifetimeDistance,
        avgLifetimeSteps: avgLifetimeSteps,
        avgLifetimeStepsPer: avgLifetimeStepsPer,
        avgLifetimeDistance: avgLifetimeDistance,
        users: data
      });
  });
});
