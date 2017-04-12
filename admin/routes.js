"use strict";
const express = require('express');
const ROUTER = express.Router();
const csrf = require('csurf');

const authenticateMiddleware = (req, res, next) => {
    if (req.user)
        next();
    else
        return res.redirect('/admin/login');
};

const checkPermission = function(permission = '') {
    return function (req, res, next) {
        if (_checkPermission(permission, req.user)) {
            next()
        } else {
            res.render('views/errors/limit-permission', { pageTitle: 'Bạn không thể truy cập trang này!'});
        }
    }
};

const returnModuleInfo = function (info, controller) {
    return function (req, res, next) {
        if (controller === 'create')
            info.childLabel = 'Thêm mới';
        else if (controller === 'edit')
            info.childLabel = 'Cập nhật';

        res.locals.controller = controller;
        res.locals.moduleInfo = info;
        next();
    }
};

const modules = ALL_MODULES;

for (let module of modules) {
    let controllers = require(`./${module}/controllers/index.controller`);
    let selfModule = require(`./${module}/index`);
    let routes = selfModule.routes;
    for (let route of routes) {
        let middlewares = [];

        let {path, controller, method, permission, authenticate} = route;

        if (typeof controllers[controller] != 'function')
            throw new Error(`Not Found Controller: ${controller} - Module: ${module}`);

        if (method !== 'post')
            middlewares.push(returnModuleInfo(selfModule.info, controller));

        if (authenticate)
            middlewares.push(authenticateMiddleware);

        if (permission)
            middlewares.push(checkPermission(permission));

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

        ROUTER[method](path, middlewares, controllers[controller]);
    }
}

module.exports = ROUTER;