"use strict";
//======imports=====
var express = require('express');
var app = express();

var bcrypt = require('bcrypt');

var session = require('express-session');
app.use(session({
  secret: "armbar",
  resave: false,
  saveUnitialized: true
}));

var shoe_manager = require('./shoe_manager');


//var routes = require('./routes')
//=====code=====

app.get("/", function(req, res) {
  res.send('hello world');
});



app.get("/request_challenge", function(req, res) {
  function userMustEnterPassword() {
    //TODO: send message saying 'you must enter your password'
  };
  function sendChallenge(permChallenge, tempChallenge) {
    //TODO respond with challenges
  };
  function badDevice(){
    //TODO send message saying 'this device is invalid'
  };

  var uid = req.body.uid;
  var perm_pk = req.body.perm_pk;
  var temp_pk = req.body.temp_pk;
  var password_cb = userMustEnterPassword;
  var challenge_cb = sendChallenge;
  var failure_cb = badDevice;
  shoe_manager.request_challenge( uid, perm_pk, temp_pk, password_cb , challenge_cb, failure_cb );

});

app.get("/response", function(req, res) {
  function success() {
    //tell the user they succeeded
  }

  function failure() {
    //tell teh user they failed
  }

  var success_cb = success;
  var failure_cb = failure;
  var uid = req.body.uid;
  var perm_response = req.body.perm_response;
  var temp_response = req.body.temp_response;


  shoe_manager.check_response(uid, perm_response, temp_response, success_cb, failure_cb)
});









app.listen(8080, function() {
  console.log("listening on port: 8080");
});
