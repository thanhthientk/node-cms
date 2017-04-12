"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require(`${__libs}/bcrypt`);

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, ref: 'Role'},
    status: String,
    fullname: {type: String, required: true},
    phone: String,
    gender: String,
    birthday: String,
    address: String,
    token: {
        value: String,
        expires: Date
    },
    createdBy: {type: String, ref: 'User'},
    createdOn: {type: Date, default: Date.now}
});

// Pagination Plugin
userSchema.plugin(mongoosePaginate);

// Index

/** Password hash middleware */
userSchema.pre('save', function save(next) {
    const user = this;
    if (!user.isModified('password')) { return next(); }
    bcrypt.hash(user.password)
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(err => {
            throw err;
        });
});

/** Compare Password */
userSchema.methods.comparePassword = function comparePassword(passwordIn, cb) {
    bcrypt.compare(passwordIn, this.password)
        .then(result => {
            cb(null, result)
        })
        .catch(err => {
            cb(err, null)
        });
};

module.exports = mongoose.model('User', userSchema);