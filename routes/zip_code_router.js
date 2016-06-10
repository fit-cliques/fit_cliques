'use strict';
const Router = require('express').Router;
const User = require(__dirname + '/../models/user');
const handleErr = require(__dirname + '/../lib/handle_err');
const async = require('async');

let zipcodeRouter = module.exports = Router();

zipcodeRouter.route('/zipcode')

.get((req, res) => {
  User.distinct('zipCode', (err, zips) => {
    if (err) return handleErr(err, res);
    var zipCodes = {};
    async.each(zips, (ele, cb) => {
      User.find({ zipCode: ele }).sort({ todaySteps: -1 }).exec((err, zip) => {
        if (err) return handleErr(err, res);
        let count = 0;
        let zipTotalTodaySteps = 0;
        let zipTotalTodayDistance = 0;
        let zipTotalWeekSteps = 0;
        let totalWeekAvgSteps = 0;
        let zipTotalWeekDistance = 0;
        let zipTotalLifetimeSteps = 0;
        let totalLifetimeAvgSteps = 0;
        let zipTotalLifetimeDistance = 0;

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

zipcodeRouter.route('/zipcode/:zipcode_id')

.get((req, res) => {
  let promise = User.find( { zipCode: req.params.zipcode_id }).sort({ todaySteps: -1 }).exec();
  promise.then((data) => {

    let count = 0;
    let zipTotalTodaySteps = 0;
    let zipTotalTodayDistance = 0;
    let zipTotalWeekSteps = 0;
    let totalWeekAvgSteps = 0;
    let zipTotalWeekDistance = 0;
    let zipTotalLifetimeSteps = 0;
    let totalLifetimeAvgSteps = 0;
    let zipTotalLifetimeDistance = 0;

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
  })
  .catch((err) => {
    if (err) return handleErr(err, res);
  });
});
