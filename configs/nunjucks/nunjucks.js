'use strict';

const nunjucks = require('nunjucks');
module.exports = {
	init: function(app) {
		const engine = nunjucks.configure(['admin', 'themes'],{
		    autoescape : true,
		    watch: true,
		    express : app
		});
		engine.addGlobal('_global', require('./nunjucks-global'));
		app.set('view engine', 'xoo');
		return engine;
	},

	addGlobal: function(engine, globalName, globalValue) {
		engine.addGlobal(globalName, globalValue);
	}
};