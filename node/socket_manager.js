

module.exports = function(sio) {

    exports = {};

    var sockets = {};

    sio.sockets.on("connection", function(socket) {
        console.log("socket connected!");
        socket.emit("welcome", {message: "welcome from server"});
        var clientToken = socket.request.session.clientToken;
        if (clientToken)
            sockets[clientToken] = socket;
    });

    exports.sendMessage = function(message,client_token) {
        if (client_token in sockets) {
            var socket = sockets[client_token];
            socket.emit("message", {message: message});
        }
    };

    // Tell the client to enter a password
    exports.tellUserMustEnterPassword = function(client_token) {
        if (client_token in sockets) {
            var socket = sockets[client_token];
            socket.emit("user_enter_password");
        } else {
            console.log("the key" + client_token +" Is not in the list of sockets");
        }
    };

    exports.tellUserAccountIsTaken = function(client_token) {
        if (client_token in sockets) {
            var socket = sockets[client_token];
            socket.emit("user_account_name_taken");
        } else {
            console.log("tellUserAccountIsTaken() - the key" + client_token +" Is not in the list of sockets");
        }
    };

    exports.tellUserPasswordIncorrect = function(client_token){
        if (client_token in sockets) {
            var socket = sockets[client_token];
            socket.emit("password_incorrect");
        } else {
            console.log("the key" + client_token +" Is not in the list of sockets");
        }
    }

    exports.forceUserToLogOut = function(client_token) {
        if (client_token in sockets) {
            var socket = sockets[client_token];
            socket.emit("forceLogout");
        } else {
            console.log("the key" + client_token +" Is not in the list of sockets");
        }
    }

    // TODO SECURITY improve the unique token
    var counter = 0;
    exports.getUniqueToken = function() {
        counter += 1;
        return "12"+counter+"34";
    };

    return exports;
};
