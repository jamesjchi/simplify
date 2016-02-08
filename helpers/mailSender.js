var mailgun_api = process.env.MAILGUN_API_KEY;
var mailgun_domain = process.env.MAILGUN_DOMAIN;
var Mailgun = require('mailgun-js');
var User = require('../models/user');
var weather = require("Openweather-Node");
weather.setAPPID(process.env.WEATHER_KEY);
weather.setCulture("us");
weather.setForecastType("daily");

// function to send user email given template and subject     
var mailSender = function (userEmail, userName, userLocation) {
  
    // create new mailgun instance with credentials
    var mailgun = new Mailgun({
      apiKey: mailgun_api, 
      domain: mailgun_domain
    });
    // setup the basic mail data
    var mailData = {
      from: 'postmaster@sandbox294685585e924f97bb9a0a128b63aa48.mailgun.org',
      to: userEmail,
      subject: 'Your Daily Simplify List',
      html: 'Hi ' + userName + '.<br><br>The current weather in ' + userLocation + ' is 45 degrees and cloudy.<br><br>Your suggested clothing list is:<br>-Jeans<br>-Plaid Shirt<br>-Mountain Hardwear Puffy Jacket.',
      // only sends test emails if this option is set to true
      // 'o:testmode': true,
    };
    // send to mailgun for processing
    mailgun.messages().send(mailData, function (error, body) {
    if (error) {
      console.log("error");
    } else {
      console.log("email sent");
      }
    });
}; 

module.exports = mailSender;