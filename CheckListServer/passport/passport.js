const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    userService
} = require('../services/userService');
let config = require('./config');

passport.use(new LocalStrategy(
    (username, password, done) => {
        try {
            userService.findUser(username, (err, result) => {
                if (err) {
                    return done(err);
                }
                if (!result) {
                    return done(null, false, {
                        message: 'Incorrect username.'
                    });
                }
                if (!bcrypt.compareSync(password, result.password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                //BUILD OUR TOKEN
                let newToken = jwt.sign({
                        username: result.user,
                        permissions: result.permissions
                    },
                    config.secret, {
                        expiresIn: '1h'
                    }); // expires in 1 hour '1h' , 5 - 5 seconds
                let output = {
                    user: result,
                    token: newToken
                }
                return done(null, output);
            });
        } catch(err) {
            return done(null, err)
        }
    }
));

module.exports = passport;