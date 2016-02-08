var schedule = require('node-schedule');

var mailScheduler = function (job) {
  // set rules for scheduler
  var rule = new schedule.RecurrenceRule();
      rule.seconds = [60];
      // rule.dayOfWeek = [new schedule.Range(0, 6)];
      // rule.hour = 7;
      // rule.minute = 45;
  // scheduleJob take a rule and a function
  // you will need to pass a function object
  // into the mailScheduler function
  schedule.scheduleJob(rule, job);
};

module.exports = mailScheduler;
