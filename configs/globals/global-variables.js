"use strict";
const path = require('path');
const fs = require('fs');

global.__root = path.join(__dirname, '../..');
global.__libs = path.join(__root, 'libraries');

/*** Get all modules of application */
let modules = [];
let dirs = fs.readdirSync(`${__root}/admin`);
for (let dir of dirs) {
    if (fs.statSync(`${__root}/admin/${dir}`).isDirectory()
            && fs.existsSync(`${__root}/admin/${dir}/index.js`)) {
        modules.push(dir);
    }
}
global.ALL_MODULES = modules;

/*** Get all model into Global Var */
let _app = { model: {} };
for (let module of ALL_MODULES) {
    let modelOfModule = path.join(__root, `admin/${module}/models/index.model.js`);
    if (fs.existsSync(modelOfModule)) {
        let moduleSlug = require(path.join(__root, `admin/${module}`)).info.singular_slug;
        _app.model[moduleSlug] = require(path.join(__root, `admin/${module}/models/index.model.js`));
    }
}

global._app = _app;