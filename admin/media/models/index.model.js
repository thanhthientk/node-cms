"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const info = require('../index').info;

const schema = new mongoose.Schema({
    name: {type: String, required: true},
    path: {type: String, required: true},
    ext: {type: String, required: true},
    type: String,
    fields: {},
    createdBy: {type: String, ref: 'User', required: true},
    createdOn: {type: Date, default: Date.now}
});

//Paginate Plugin
schema.plugin(mongoosePaginate);

// Index


module.exports = mongoose.model(info.collection, schema);