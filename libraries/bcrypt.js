"use strict";
const bcrypt = require('bcrypt-nodejs');

exports.hash = function (input) {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) reject(err);
            bcrypt.hash(input, salt, null, (err, hash) => {
                if (err) resolve(false);

                resolve(hash);
            });
        });
    });
};

const compare = function(input, hash) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(input, hash, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

exports.compare = compare;

exports.checkUserPassword = function (userId, password) {
    return new Promise(function (resolve, reject) {
        _app.model.user.findById(userId)
            .then(user => {
                if (!user) resolve(false);
                compare(password, user.password)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        console.log('Loi o ham compare - bcrypt.js: ',err);
                        resolve(false);
                    })
            })
            .catch(() => {
                resolve(false);
            })
    })
};