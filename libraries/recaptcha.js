"use strict";

const https = require('https');

let captcha_key = process.env.RECAPTCHA_KEY;

const checkCaptCha = function (captchaInput) {
    return new Promise((resolve, reject) => {
        https.get(
            `https://www.google.com/recaptcha/api/siteverify?secret=${captcha_key}&response=${captchaInput}`,
            (response) => {
                let data = "";
                response.on("data", (chunk) => {
                    data += chunk.toString();
                });
                response.on('end', function() {
                    try {
                        let parsedData = JSON.parse(data);
                        resolve(parsedData);
                    } catch (e) {
                        resolve(false);
                    }
                });
            }
        );
    })
};

exports.checkCaptCha = checkCaptCha;