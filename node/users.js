



module.exports = function() {

    var users = {};

    function User(username, password) {
        this.username = username;
        this.password = password;
    }
        
    User.userExists = function(username) {
        return (username in users);
    }

    User.makeUser = function(username,password) {
        var user = new User(username,password);
        users[username] = user;
        return user;
    }

    return User;
};
