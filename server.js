"use strict";
//Lets require/import the HTTP module
var http = require('http');
var fileSystem = require('fs');
var path = require('path');
var qs = require('querystring');

//Lets define a port we want to listen to
const PORT=8080;
class User {
    constructor(name, password) {
        this.name = name;
        this.password = password;
    }
}

var users;


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
        // Handle login datavar requestBody = '';

    } else if (request.method === 'POST' && request.url === '/signup') {
        // Handle singup data
        request.on('data', function(data) {
            requestBody += data;
        });
        request.on('end', function() {
             var formData = qs.parse(requestBody);
             if (formData["username"] != undefined
                && formData["password"] != undefined) {
                    // Check if user exists
                    var arrayLength = users.length;
                    var founduser = new User("","");
                    for (var i=0; i<arrayLength; i++) {
                        if (user[i].username == formData["username"]) {
                            founduser = user[i];
                            break;
                        }
                    }
                    if (founduser.username != formData["username"]) {
                        var user = new User(formData["username"], formData["password"]);
                        users.push(user);
                        console.log("Added user " + user.username
                            + " with password " + user.password);
                    } else {
                        console.error("Duplicate user detected");
                    }

                }
        });

    } else if (request.method === 'GET' && request.url === '/signup') {
        // Display signup page
        var readStream = fileSystem.createReadStream("html/signup.html");
        readStream.pipe(response);
    } else if(request.method === 'GET' && request.url === '/login'){
        // Display login page
        var readStream = fileSystem.createReadStream("html/login.html");
        readStream.pipe(response);
    } else {
        // Display home page
        var readStream = fileSystem.createReadStream("html/home.html");
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