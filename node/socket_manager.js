

module.exports = function(sio) {
    
    exports = {};
    
    sio.sockets.on("connection", function(socket) {
        console.log("socket connected!");
        socket.emit("welcome", {message: "welcome from server"});
    });

    exports.sendMessage = function(message,client_token) {
        // TODO
    }

    return exports;
};
