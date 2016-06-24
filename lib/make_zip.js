module.exports = exports = function(zip) {
  var count = 0;
  var zipData = {
    zipTotalTodaySteps: 0,
    zipTotalTodayDistance: 0,
    zipTotalWeekSteps: 0,
    totalWeekAvgSteps: 0,
    zipTotalWeekDistance: 0,
    zipTotalLifetimeSteps: 0,
    totalLifetimeAvgSteps: 0,
    zipTotalLifetimeDistance: 0,
    data: zip
  };

  for (var i = 0; i < zip.length; i++) {
    count++;
    zipData.zipTotalTodaySteps += zip[i].todaySteps;
    zipData.zipTotalTodayDistance += zip[i].todayDistance;
    zipData.zipTotalWeekSteps += zip[i].weekSteps;
    zipData.totalWeekAvgSteps += zip[i].weekAvgSteps;
    zipData.zipTotalWeekDistance += zip[i].weekDistance;
    zipData.zipTotalLifetimeSteps += zip[i].lifetimeSteps;
    zipData.totalLifetimeAvgSteps += zip[i].lifetimeAvgSteps;
    zipData.zipTotalLifetimeDistance += zip[i].lifetimeDistance;
  }

  zipData.avgTodaySteps = (zipData.zipTotalTodaySteps / count).toFixed();
  zipData.avgTodayDistance = (zipData.zipTotalTodayDistance / count).toFixed(2);
  zipData.avgWeekSteps = (zipData.zipTotalWeekSteps / count).toFixed();
  zipData.avgWeekStepsPer = (zipData.totalWeekAvgSteps / count).toFixed();
  zipData.avgWeekDistance = (zipData.zipTotalWeekDistance / count).toFixed(2);
  zipData.avgLifetimeSteps = (zipData.zipTotalLifetimeSteps / count).toFixed();
  zipData.avgLifetimeStepsPer = (zipData.totalLifetimeAvgSteps / count).toFixed();
  zipData.avgLifetimeDistance = (zipData.zipTotalLifetimeDistance / count).toFixed(2);

  return zipData;
};
