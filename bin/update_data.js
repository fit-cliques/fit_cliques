const sa = require('superagent');
const config = require('../app/js/config');
const async = require('async');
const User = require(__dirname + '/../models/user');


const update = function() {
  User.find((err, allUsers) => {
    if (err) return console.log(err);
    allUsers.forEach((ele) => {
      var user;
      const authBuffer = new Buffer(process.env.CLIENT_ID +
        ':' + process.env.CLIENT_SECRET, 'base64').toString();
      async.series([
        function(cb) {
          sa.post(config.fbAuthUrl)
          .set({ 'Authorization': 'Basic ' + authBuffer,
          'Content-Type': 'application/x-www-form-urlencoded' })
          .send('grant_type=refresh_token&refresh_token=' +
          ele.fbRefreshToken)
          .end((err, res) => {
            if (err) return console.log(err);
            user.fbToken = res.data.access_token;
            user.fbRefreshToken = res.data.refresh_token;
            user.fbUserId = res.data.user_id;
            if (cb) cb();
          });
        },
        function(cb) {
          sa.get(config.fbDataUrl + ele.fbUserId + '/activities/date/today.json')
          .set({ 'Authorization': 'Bearer ' + user.fbToken })
          .end((err, res) => {
            if (err) return console.log(err);
            user.todaySteps = res.data.summary.steps;
            if (cb) cb();
          });
        },
        function(cb) {
          sa.get(config.fbDataUrl + ele.fbUserId + '/profile.json')
          .set({ 'Authorization': 'Bearer ' + user.fbToken })
          .end((err, res) => {
            if (err) return console.log(err);
            user.encodedId = res.data.user.encodedId;
            user.memberSince = res.data.user.memberSince;
            user.strideLength = res.data.user.strideLengthWalking;
            var strideNum = parseInt(user.strideLength, 10);
            var todaySteps = parseInt(user.todaySteps, 10);
            user.todayDistance = (todaySteps / 2 * strideNum * 0.00001578).toFixed(2);
            if (cb) cb();
          });
        },
        function(cb) {
          sa.get(config.fbDataUrl + ele.fbUserId + '/activities.json')
          .set({ 'Authorization': 'Bearer ' + user.fbToken })
          .end((err, res) => {
            if (err) return console.log(err);
            user.lifetimeSteps = res.data.lifetime.total.steps;
            user.lifetimeDistance = res.data.lifetime.toal.distance;
            user.bestSteps = res.data.best.total.steps;
            user.bestDistance = res.data.best.total.distance;
            var curDate = new Date();
            var dateArr = user.memberSince.split('-');
            var memberSince = new Date(dateArr[0], dateArr[1], dateArr[2]);
            var numDays = Math.round(Math.abs(+curDate - +memberSince) / 8.64e7);
            user.lifetimeAvgSteps = (user.lifetimeSteps / numDays).toFixed();
            if (cb) cb();
          });
        },
        function(cb) {
          sa.get(config.fbDataUrl + ele.fbUserId +
            '/activities/steps/date/today/1w.json')
            .set({ 'Authorization': 'Bearer ' + user.fbToken })
            .end((err, res) => {
              if (err) return console.log(err);
              user.lastSeven = res.data['activities-steps'];
              user.weekSteps = 0;
              user.lastSeven.forEach((val) => {
                user.weekSteps += parseInt(val.value, 10);
              });
              user.weekAvgSteps = (user.weekSteps / 7).toFixed();
              var strideNum = parseInt(user.strideLength, 10);
              user.weekDistance = (user.weekSteps / 2 * strideNum * 0.00001578).toFixed(2);
              if (cb) cb();
            });
        }
      ], (err) => {
        if (err) return console.log(err);
        User.findByIdAndUpdate(ele._id, user, (err) => {
          if (err) return console.log(err);
        });
      });
    });
  });
};

update();
