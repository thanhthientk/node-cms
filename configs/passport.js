"use strict";
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = _app.model.user;

module.exports = function (app) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .select('fullname role')
            .populate('role', 'name permissions')
            .then(user => {
                done(null, user)
            })
            .catch(err => {
                done(err, null);
            });
    });

    passport.use(new LocalStrategy(
        {usernameField: 'email'},
        function (email, password, done) {
            User.findOne({email: email})
                .then((user) => {
                    if (!user) {
                        return done(null, false);
                    }
                    user.comparePassword(password, (err, result) => {
                        if (err) return done(err);
                        if (result) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    });
                })
                .catch((err) => {
                    return done(err);
                });
        }
    ));

    app.use(passport.initialize());
    app.use(passport.session());
};
