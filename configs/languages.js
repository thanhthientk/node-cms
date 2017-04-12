"use strict";
const co = require('co');

co(function* () {
    let languages =  yield _app.model.language.find({status: true}).select('code');
    let languagesCode = [];
    for (let language of languages) {
        languagesCode.push(language.code);
    }
    global.LANGUAGES = languagesCode;
    console.log(LANGUAGES);
});