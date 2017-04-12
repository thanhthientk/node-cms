'use strict';

const path = require('path');
const env = require('dotenv');

const express = require('express');
const app = express();
const nunjucks = require('./nunjucks/nunjucks');
const database = require('./database');
const co = require('co');

module.exports = {
	start: co.wrap(function* () {
		//Load Environment
		env.load({ path: path.join(__dirname, './env/.env.pro') });

		//Connect Database
		database.init();

		//Require Global
		require('./globals').init();
		//Global Theme Name
		require('../themes/index');

        //Setup view
		let engine = nunjucks.init(app);

		//Session
		require('./session')(app);

		//Passport
        require('./passport')(app);

		//Middleware
		require('./middlewares')(app);
        /** Public variables for views */
        app.use((req, res, next) => {
            res.locals.originalUrl = req.originalUrl;
            res.locals.reqQuery = req.query;
            if (req.user)
                res.locals.logged_user = req.user;
            next();
        });

        /**
         * Routes
         */
        app.use('/', require(path.join(__root, 'frontend/routes')));
        app.use('/', require(path.join(__root, 'admin/routes')));

		//Errors Handler
		require('./errors-handler')(app);

        /** Create Server Listen */
        const port = (process.env.PORT) ? Number(process.env.PORT) : 5000;
        app.listen(port, () => {
            console.log('Server is running at port: ', port);
        });
	})
};