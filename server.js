//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT=8080;

const LOGIN_PAGE = "You are not shoed in";
const SIGNUP_PAGE = "Sign up for our service here";
const LOGGED_IN = "Welcome! you are now shod in";

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);

    if (request.method === 'POST' && request.url === '/login') {



    } else if (request.method === 'GET' && request.url === '/signup') {

    } else {
        response.end('Invalid URL');
    }







}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});