"use strict";
//======imports=====
var express = require('express');
var app = express();

var session = require('express-session');
app.use(session({
  secret: "armbar",
  resave: false,
  saveUnitialized: true
}));


//var routes = require('./routes')
//=====code=====

app.get("/", function(req, res) {
  res.send('hello world');
});

app.listen(8080, function() {
  console.log("listening on port: 8080");
});
