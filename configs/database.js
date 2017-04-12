'use strict';

const mongoose = require('mongoose');

module.exports = {
	init: function() {
		mongoose.Promise = global.Promise;
		mongoose.connect(process.env.MONGO_URI);
		mongoose.connection.on('error', () => {
		    throw new Error('Mongodb Connection Error!');
		});
	}
};