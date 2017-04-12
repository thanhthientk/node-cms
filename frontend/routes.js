"use strict";
const express = require('express');
const ROUTER = express.Router();
const csrf = require('csurf');
const co = require('co');

let modules = ['index', 'posts'];

ROUTER.use(function (req, res, next) {
    res.theme = function (path, params) {
        return res.render(`${THEME}/${path}`, params)
    };

    next();
});

for (let module of modules) {
    let controllers = require(`./${module}/controllers`);
    let routes = require(`./${module}/routes`);
    for (let route of routes) {
        let middlewares = [];

        let {path, controller, method} = route;

        if (typeof controllers[controller] !== 'function')
            throw new Error(`Not Found Controller: ${controller} - Module: ${module}`);

        if (route.middlewares && route.middlewares.length > 0) {
            for (let i = 0; i < route.middlewares.length; i++) {
                middlewares.push(route.middlewares[i]);
            }
        }

        if (route.csrf !== false) {
            middlewares.push(csrf());
            middlewares.push(function (req, res, next) {
                res.locals._csrf = req.csrfToken();
                next();
            })
        }

        // Get Options
        middlewares.push(co.wrap(function* (req, res, next) {
            try {
                let queries = yield Promise.all([
                    _app.model.setting.findById('58df4d0b2e26d9206c620ec4').select('data'),
                ]);

                let Options = queries[0];

                let images = yield Promise.all([
                    _app.model.media.find({ _id: { $in: Options.data['product_gallery'] } }).select('name ext path'),
                    _app.model.media.find({ _id: { $in: Options.data['blog_gallery'] } }).select('name ext path')
                ]);
                Options.data['product_gallery'] = images[0];
                Options.data['blog_gallery'] = images[1];

                res.locals.Options = Options.data;
                res.locals.URL = 'http://gynos.vn';
                next();
            }
            catch (err) {
                next(err);
            }
        }));

        ROUTER[method](path, middlewares, controllers[controller]);
    }
}

module.exports = ROUTER;