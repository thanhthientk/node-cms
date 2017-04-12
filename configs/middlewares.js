'use strict';
const path = require('path');
const express = require('express');

const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const flash = require('express-flash');

module.exports = function(app) {
	app.use(favicon(path.join(__root, 'public', 'favicon.ico')));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(validator());
	app.use(flash());
	if (process.env.ENV === 'development'){
	    app.use(express.static(path.join(__root, 'public'))); //{ maxAge: '7d'}
	    app.use(express.static(path.join(__root, 'themes'))); //{ maxAge: '7d'}
		app.use(logger('dev'));
	}
};