var express = require('express');
var User = require('../models/user');
var router = express.Router();
var jwt = require('jsonwebtoken');
var secret = 'babysquirrel';

router.route('/')
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) return res.status(500).send(err);
      res.send(users);
    });
  })
  .post(function(req, res) {
    User.create(req.body, function(err, user) {
      if (err) return res.status(500).send(err);
      var token = jwt.sign(user, secret);
      res.send({user: user, token: token});
    });
  });

router.route('/:id') 
  .get(function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (err) return res.status(500).send(err);
      res.send(user);
    });
  })
  .put(function(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  });


module.exports = router;