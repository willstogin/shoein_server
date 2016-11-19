"use strict";
//======imports=====
var express = require('express');
var app = express();
var httpServer = require('http').Server(app);
app.use('/static', express.static("./static"));

var bcrypt = require('bcrypt');

//session
var session = require('express-session');
var session_middleware = session({
  secret: "armbar",
  resave: false,
  saveUnitialized: true
});
app.use( session_middleware );


// sockets
var sio = require("socket.io")(httpServer);
function siomw(f) { return function(socket,next){f(socket.request, socket.request.res, next)}; };
sio.use(siomw(session_middleware));



// Our imports
var shoe_manager = require('./shoe_manager');
var socket_manager = require('./socket_manager')(sio);

//var routes = require('./routes')
//=====code=====

class User {
  constructor(name, password, token) {
      console.log("creating new user")
      this.name = name;
      this.password = password;
      this.token = token;
  }
}

var list_of_user_sessions = [];



/**************
 * Routes below
 ****************/


app.get("/", function(req, res) {
  res.send('<div>hello world</div>');
});


app.post("/request_challenge", function(req, res) {
  console.log("route /request_challenge was contacted");
  function userMustEnterPassword() {
    //TODO: send message saying 'you must enter your password'
  };
  function sendChallenge(permChallenge, tempChallenge) {
    //TODO respond with challenges
  };
  function badDevice(){
    //TODO send message saying 'this device is invalid'
  };

  var uid = req.query.uid;
  var perm_pk = req.query.perm_pk;
  var temp_pk = req.query.temp_pk;
  var password_cb = userMustEnterPassword;
  var challenge_cb = sendChallenge;
  var failure_cb = badDevice;
  shoe_manager.request_challenge( uid, perm_pk, temp_pk, password_cb , challenge_cb, failure_cb );

});

app.post("/response", function(req, res) {
  function success() {
    //tell the browser user they succeeded
  }

  function failure() {
    //tell the browser user they failed
  }

  var success_cb = success;
  var failure_cb = failure;
  var uid = req.query.uid;
  var perm_response = req.query.perm_response;
  var temp_response = req.query.temp_response;


  shoe_manager.check_response(uid, perm_response, temp_response, success_cb, failure_cb)
});


app.get("/newClient", function(req, res) {

});

app.get("/newSession/:token", function(req, res) {
  console.log(req.params);
  var token = req.params.token;
  req.session.clientToken = token;

  res.redirect("/static/login.html");

});









httpServer.listen(8080, function() {
  console.log("listening on port: 8080");
});
