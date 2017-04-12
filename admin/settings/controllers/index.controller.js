"use strict";
const Setting = _app.model.setting;
const co = require('co');
const themeOptions = require('./../theme-options');

const themOptionsToArrayFields = function () {
    let allFields = {};
    Object.keys(themeOptions).map(bigGroupKey => {
        let bigGroup = themeOptions[bigGroupKey];
        Object.keys(bigGroup.fieldGroups).map(group => {
            let fields = bigGroup.fieldGroups[group].fields;
            Object.keys(fields).map(fieldKey => {
                allFields[fieldKey] = fields[fieldKey];
            });
        })
    });
    return allFields;
};

module.exports = {

    general: function (req, res, next) {
        Setting.findById('58d3896f43f9db1fe059889e')
            .then(setting => {
                res.render('settings/views/general', {pageTitle: 'Cài đặt chung', item: setting.data});
            })
            .catch(err => {
                next(err);
            })
    },
    postGeneral: function (req, res, next) {
        delete req.body._csrf;
        Setting.findByIdAndUpdate('58d3896f43f9db1fe059889e', {data: req.body})
            .then(() => {
                req.flash('success', 'Cập nhật thành công');
                res.redirect('back');
            })
            .catch((err) => {
                next(err);
            })
    },

    themeOptions: co.wrap(function* (req, res, next) {
        try {
            let Results = yield Promise.all([
                Setting.findById('58df4d0b2e26d9206c620ec4'),
            ]);
            let Options = Results[0];

            let images = yield Promise.all([
                _app.model.media.find({ _id: { $in: Options.data['product_gallery'] } }).select('name ext path'),
                _app.model.media.find({ _id: { $in: Options.data['blog_gallery'] } }).select('name ext path')
            ]);
            Options.data['product_gallery'] = images[0];
            Options.data['blog_gallery'] = images[1];

            res.render('settings/views/theme-option', {
                pageTitle: 'Tùy chỉnh giao diện',
                themeOptions,
                Options
            });
        } catch (err) {
            next(err);
        }
    }),
    postThemeOptions: co.wrap(function* (req, res, next) {
        try {
            let allFields = themOptionsToArrayFields(),
                data = {};

            Object.keys(allFields).map(fieldName => {
                let field = allFields[fieldName];
                if (field.type === 'galleryId' && req.body[fieldName]) {
                    let idImages = [];
                    req.body[fieldName].map(id => idImages.push(id));
                    data[fieldName] = idImages;
                }
                else {
                    data[fieldName] = req.body[fieldName];
                }
            });

            yield Setting.findByIdAndUpdate('58df4d0b2e26d9206c620ec4', { data });
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    }),

};