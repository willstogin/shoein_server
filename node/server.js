"use strict";
//Lets require/import the HTTP module
var http = require('http');
var fileSystem = require('fs');
var path = require('path');
var qs = require('querystring');
//npm install pug
const pug = require('pug');


//Lets define a port we want to listen to
const PORT=8080;
class User {
    constructor(name, password) {
        this.name = name;
        this.password = password;
    }
}

var users = [];
var currentUser = null; // There can only be one user, because we don't have a means of independently validating a user session (no cookies)

// Finds the user with username
// Returns User with empty name and password on failure
function findUser(username) {
    var arrayLength = users.length;
    var found = new User("","");
    for (var i=0; i<arrayLength; i++) {
        if (users[i].name === username) {
            return users[i];
        }
    }
    return found;
}

//We need a function which handles requests and send response
function handleRequest(request, response){

    // Requests:
    // * POST login information
    // * * On success, show welcome page
    // * * On failure, show home page
    // * POST sign in information
    // * * On success, show welcome page
    // * * On failure, show home page
    // * GET login page
    // * GET sign in page
    // * default: home page
    if (request.method === 'POST' && request.url === '/login') {
        // Handle login data
        var requestBody = '';
        request.on('data', function(data) {
            requestBody += data;
        });
        request.on('end', function() {
             var formData = qs.parse(requestBody);
             var username = formData["username"];
             var password = formData["password"];
             if (username != undefined
                && password != undefined) {
                    // Check if user exists
                    var founduser = findUser(username);
                    if (founduser.name == username && founduser.password == password) {
                        currentUser = founduser;
                        // Log user in
                        const compiledWelcome =  pug.compileFile('html/welcome.pug');
                        console.log("writing to temp/welcome1.html with currentUser " + currentUser.name);
                        fileSystem.writeFile('temp/welcome1.html', compiledWelcome({user: currentUser.name}), (err) => {
                          if (err) {
                            throw err
                            console.log("writing to temp/welcome1.html failed with error" + err);
                          } else {
                            var readStream = fileSystem.createReadStream("temp/welcome1.html");
                            readStream.pipe(response);
                          }
                        });

                    } else {
                        var readStream = fileSystem.createReadStream("html/loginerr.html");
                        readStream.pipe(response);
                    }

                } else {
                    console.error("Wrong data received");
                }
        });
    } else if (request.method === 'POST' && request.url === '/signup') {
        // Handle singup data
        var requestBody = '';
        request.on('data', function(data) {
            requestBody += data;
        });
        request.on('end', function() {
             var formData = qs.parse(requestBody);
             var username = formData["username"];
             var password = formData["password"];
             if (username != undefined
                && password != undefined) {
                    // Check if user exists
                    var founduser = findUser(username);
                    if (founduser.name != username) {
                        var user = new User(username, password);
                        users.push(user);
                        console.log("Added user " + user.name
                            + " with password " + user.password);
                        currentUser = user;
                        const compiledWelcome =  pug.compileFile('html/welcome.pug');
                        console.log("writing to temp/welcome1.html with currentUser " + currentUser.name);
                        fileSystem.writeFile('temp/welcome1.html', compiledWelcome({user: currentUser.name}), (err) => {
                          if (err) {
                            throw err
                            console.log("writing to temp/welcome1.html failed with error" + err);
                          } else {
                            var readStream = fileSystem.createReadStream("temp/welcome1.html");
                            readStream.pipe(response);
                          }
                        });
                    } else {
                        console.error("Duplicate user detected");
                        var readStream = fileSystem.createReadStream("html/signuperr.html");
                        readStream.pipe(response);
                    }

                } else {
                    console.error("Wrong data received");
                }
        });
    } else if (request.method === 'POST' && request.url === '/logout') {
        var readStream = fileSystem.createReadStream("html/login.html");
        readStream.pipe(response);
    } else if (request.method === 'GET' && request.url === '/signup') {
        // Display signup page
        var readStream = fileSystem.createReadStream("html/signup.html");
        readStream.pipe(response);
    } else if(request.method === 'GET' && request.url === '/login'){
        // Display login page
        var readStream = fileSystem.createReadStream("html/login.html");
        readStream.pipe(response);
    } else if (request.method === 'GET' && request.url === '/welcome') {
        // Display welcome page
        const compiledWelcome =  pug.compileFile('html/welcome.pug');
        if ( currentUser != null ) {
          console.log("writing to temp/welcome1.html with currentUser " + currentUser.name);
          fileSystem.writeFile('temp/welcome1.html', compiledWelcome({user: currentUser.name}), (err) => {
            if (err) {
              throw err
              console.log("writing to temp/welcome1.html failed with error" + err);
            } else {
              var readStream = fileSystem.createReadStream("temp/welcome1.html");
              readStream.pipe(response);
            }
          });
        } else {
          // if there isn't a current user, redirect to the login page
          var readStream = fileSystem.createReadStream("html/login.html");
          readStream.pipe(response);
        }

    } else if (request.method === 'GET' && request.url === '/styles.css') {
        // Display styles
        var readStream = fileSystem.createReadStream("html/styles.css");
       readStream.pipe(response);
    } else if (request.method === 'GET' && request.url === '/zombo.ogg') {
        // stupid audio
        var readStream = fileSystem.createReadStream("html/zombo.ogg");
        readStream.pipe(response);
    } else {
        // Display login/home page
        console.log(request.url + " was requested, but could not find the proper file")
        var readStream = fileSystem.createReadStream("html/login.html");
        readStream.pipe(response);
    }




}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
