//Lets require/import the HTTP module
var http = require('http');
var fileSystem = require('fs');
var path = require('path');

//Lets define a port we want to listen to
const PORT=8080;

const NOT_LOGGED_IN = "You are not shoed in"
const LOGIN_PAGE = "Please shoe in";
const SIGNUP_PAGE = "Sign up for our service here";
const LOGGED_IN = "Welcome! you are now shod in";



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

    } else if (request.method === 'POST' && request.url === '/signup') {
        //do some shit
    } else if (request.method === 'GET' && request.url === '/signup') {
        // CHANGE THIS WHEN HTML WRITTEN response.sendfile('html/DUMMY', {root: __dirname });
    } else if(request.method === 'GET' && request.url === '/login'){
        //do more shit
    } else {
        var readStream = fileSystem.createReadStream("html/home.html");
        // We replaced all the event handlers with a simple call to readStream.pipe()
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