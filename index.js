var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var env = require('node-env-file');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var app = express();
var moment = require('moment');
var runScheduler = require('./helpers/mailScheduler');
var mailUsers = require('./helpers/mailUsers');
var mailSender = require('./helpers/mailSender');
var weather = require("Openweather-Node");

var secret= "mysupersecretpassword";

var mongoose = require('mongoose');
var User = require('./models/user');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/optimizer');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/temperatures', require('./controllers/weather'));
app.use('/api/users', require('./controllers/users'));

app.use('/api/users', expressJWT({secret: secret})
.unless({path: ['/api/users'], method: 'post'}));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({message: 'You need an authorization token to view this information.'})
  }
});

app.post('/api/auth', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err || !user) {
      return res.send({message: 'User not found'});
    }
    user.authenticated(req.body.password, function(err, result) {
      if (err || !result) {
        return res.send({message: 'User not authenticated'});
      } 

      var token = jwt.sign(user, secret);
      res.send({user: user, token: token});
    });
  });
});

app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// test run scheduler
// runScheduler(function(){
//   console.log("in the console log");
// });

// test mailUsers
// console.log(mailUsers());

// test mail sending functionality
// mailSender();

// uncomment to start runScheduler and Mailer functionality
// runScheduler(function() {
//   console.log("in the console log");
//   mailUsers(function(users) {
//     console.log('Callback!', users);
//     for (var i = users.length - 1; i >= 0; i --) {
//       mailSender(users[i].email, users[i].name, users[i].location);
//     }
//   });
// });

// test openWeather
//set your API key if you have one 
// weather.setAPPID(process.env.WEATHER_KEY);
// //set the culture 
// weather.setCulture("us");
// //set the forecast type 
// weather.setForecastType("daily"); //or "" for 3 hours forecast 
// weather.now("Seattle",function(err, aData)
// { 
//   if(err) console.log(err);
//   else
//   {
//     var data = aData;
//     return data;
//     // console.log(aData.getDegreeTemp())
//     console.log(aData.getFahrenheitTemp())
//   }
// });




app.listen(process.env.PORT || 3000);