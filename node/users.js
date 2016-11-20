



module.exports = function() {

    var users = {};

    function User(username, password) {
        this.username = username;
        this.password = password;
    }

    User.userExists = function(username) {
        return (username in users);
    }

    User.getUserByUsername = function(username) {
        return users[username];
    }

    // TODO SECURITY hash the password
    User.makeUser = function(username,password) {
        var user = new User(username,password);
        users[username] = user;
        return user;
    }

    User.prototype.authenticate = function(password,cb) {
        if (password===this.password) {
            cb(true);
        } else {
            cb(false);
        }
    };

    return User;
};
