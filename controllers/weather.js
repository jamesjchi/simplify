var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/:search', function(req, res){
  var search = req.params.search;
  request(
    'http://api.openweathermap.org/data/2.5/weather?q='+search+'&units=imperial&APPID='+process.env.WEATHER_KEY,
    function(error, response, body){
    if (!error && response.statusCode == 200){
      var data = JSON.parse(body);
      res.send(data)
      console.log(body)
    } else{
        console.log('response', response, body);
      }
    }
  )
})

module.exports = router;