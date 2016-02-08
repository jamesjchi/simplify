var request = require('request');
var User = require('../models/user');
var bodyParser = require('body-parser');

var getWeather = function(place) {
  var location = place; 
  request(
    'http://api.openweathermap.org/data/2.5/weather?q='+location+'&units=imperial&APPID='+process.env.WEATHER_KEY,
    function(error, response, body){
    if (!error && response.statusCode == 200){
      var data = JSON.parse(body);
      
      // res.send(data)
      console.log(data)
    } else {
        console.log('response', response, body);
      }
      // return(data);
    } 
  )
};

module.exports = getWeather;