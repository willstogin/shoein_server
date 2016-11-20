"use strict";
//======imports=====
var express = require('express');
var app = express();
var httpServer = require('http').Server(app);
//set up statically available pages
app.use('/static', express.static("./static"));
app.use('/dynamic', express.static("./dynamic"));


//be able to parse body (for use in forms)
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//crypto
var bcrypt = require('bcrypt');

//session
var session = require('express-session');
var session_middleware = session({
  secret: "armbar",
  resave: false,
  saveUnitialized: true
});
app.use( session_middleware );

// Users
var User = require('./users')();

// passport
var passport = require('./passport')(User);
app.use(passport.initialize());
app.use(passport.session());

// sockets
var sio = require("socket.io")(httpServer);
function siomw(f) { return function(socket,next){f(socket.request, socket.request.res, next)}; };
sio.use(siomw(session_middleware));


//for dynamic content
var fileSystem = require('fs');
const pug = require('pug');


// Our imports
var shoe_manager = require('./shoe_manager');
var socket_manager = require('./socket_manager')(sio);


/**************
 * Routes below
 ****************/


app.get("/", function(req, res) {
  res.redirect("/static/login.html")
});

app.get("/newSession/:token", function(req, res) {
  console.log(req.params);
  var token = req.params.token;
  req.session.clientToken = token;

  res.redirect("/static/login.html");

});

app.post("/login", passport.authenticate('local',
                                         {successRedirect: "/dynamic/welcome.html",
                                          failureRedirect: "/static/login.html" }));

app.set("view engine", "pug");
app.get("/welcome.html", function(req, res) {
    if (!req.user) {
        return res.redirect("/static/login.html");
    }
    var user = req.user;
    console.log("writing to /dynamic/welcome.html with currentUser " + user.username);
    res.render("welcome",{user: user.username});
});

//create an account and redirect to the welcome screen
app.post("/signup", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!User.userExists(username)) {
        var user = User.makeUser(username,password);
        req.login(user, function(err) {
            if (err) console.log(err);
            res.redirect("/welcome.html");
        });
    } else {
        // TODO send a message to the client that the username exists
        
        res.redirect("/static/signup.html");
    }
});

app.post("/logout", function(req, res) {
    req.logout();
    res.redirect("/static/login.html");
});


// called by java client
app.get("/newClient", function(req, res) {
  console.log("route /newClient was contacted");
  res.send(socket_manager.getUniqueToken());
});

// called by java client
app.post("/request_challenge", function(req, res) {
  var token = req.query.token;
  console.log("route /request_challenge was contacted with token: " + token);

  function userMustEnterPassword() {
    socket_manager.tellUserMustEnterPassword(token);
    res.send("");
  };

  function sendChallenge(permChallenge, tempChallenge) {
      res.send(""+permChallenge+","+tempChallenge);
  };

  function badDevice(){
    // TODO (low priority)
  };

  var uid = req.query.uid;
  var perm_pk = req.query.perm_pk;
  var temp_pk = req.query.temp_pk;
  var password_cb = userMustEnterPassword;
  var challenge_cb = sendChallenge;
  var failure_cb = badDevice;
  shoe_manager.request_challenge( uid, perm_pk, temp_pk, password_cb , challenge_cb, failure_cb );

});

// called by java client
app.post("/response", function(req, res) {
  function success() {
    // TODO log client in
  }

  function failure() {
    // TODO (low priority) tell the browser user they failed
  }

  var success_cb = success;
  var failure_cb = failure;
  var uid = req.query.uid;
  var perm_response = req.query.perm_response;
  var temp_response = req.query.temp_response;


  shoe_manager.check_response(uid, perm_response, temp_response, success_cb, failure_cb)
});

// called by java client
app.get("/shoeDisconnected", function(req,res) {
    // TODO
});







httpServer.listen(8080, function() {
  console.log("listening on port: 8080");
});
