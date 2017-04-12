'use strict';
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = function(app) {
	app.use(session({
	    resave: true,
	    saveUninitialized: false,
	    secret: '454sdf46s54df5sd4we46ew544f6s4d6f',
	    store: new MongoStore({mongooseConnection: mongoose.connection}),
	    cookie: { maxAge: 1000*60*60*24 }
	}));
}