

module.exports = function(User) {

    var passport = require("passport");
    var LocalStrategy = require("passport-local").Strategy;


    var auth_by_password = function(username,password,next) {
        if (!User.userExists(username))
            return next(null,false);
        var user = User.getUserByUsername(username);
        user.authenticate(password,function(matches) {
            if (matches) {
                return next(null,user);
            } else {
                return next(null,false);
            }
        });
    };
    
    passport.use(new LocalStrategy(auth_by_password));

    passport.serializeUser(function(user,cb) {
        cb(null,user.username);
    });

    passport.deserializeUser(function(id,cb) {
        cb(null,User.getUserByUsername(id));
    });
    
    return passport;
};
