

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
    exports.tellUserMustEnterPassword(client_token) {
        if (client_token in sockets) {
            var socket = sockets[client_token];
            socket.emit("user_enter_password");
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
