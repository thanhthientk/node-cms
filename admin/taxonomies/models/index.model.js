"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const info = require('../index').info;

const schema = new mongoose.Schema({
    slug: {type: String},
    name: {type: String, required: true},
    description: String,
    module: String,
    type: String,
    createdBy: {type: String, ref: 'User', required: true},
    createdOn: {type: Date, default: Date.now}
});

//Paginate Plugin
schema.plugin(mongoosePaginate);

// Index


module.exports = mongoose.model(info.collection, schema);