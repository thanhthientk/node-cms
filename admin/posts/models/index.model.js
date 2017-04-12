"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const info = require('../index').info;

const schema = new mongoose.Schema({
    name: {type: String, required: true},
    slug: {type: String, unique: true},
    postType: {type: String, default: 'post'},
    content: String,
    description: String,
    categories: [{type: String, ref: 'Taxonomy'}],
    tags: [{type: String, ref: 'Taxonomy'}],
    image: {type: String, ref: 'Media'},
    gallery: [{type: String, ref: 'Media'}],
    fields: {},
    status: {type: String, default: 'show'},
    createdBy: {type: String, ref: 'User', required: true},
    createdOn: {type: Date, default: Date.now}
});

//Paginate Plugin
schema.plugin(mongoosePaginate);

// Index


module.exports = mongoose.model(info.collection, schema);