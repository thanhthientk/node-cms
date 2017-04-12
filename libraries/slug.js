"use strict";
const Slug = require('slug');
const co = require('co');

/**
 *
 * @param string : input need to generator
 * @param model : model of module: like post, taxonomy...
 * @returns {Promise}
 */
const generateSlug = function (string, model) {
    if (!string || !model) throw new Error('generateSlug: empty String or model');

    let slug = Slug(string.toLowerCase());
    return new Promise(function (resolve, reject) {
        _app.model[model].count({slug: new RegExp(`^(${slug})$|(${slug})-([0-9]+)`, 'ig')})
            .then(count => {
                if (count === 0)
                    resolve(slug);
                else
                    resolve(slug + '-' + (count + 1));
            })
            .catch(err => {
                console.log(err);
                resolve(slug + '-' + Date.now());
            })
    })
};

const updateSlug = function (itemId, slug, model, response) {
    return new Promise(function (resolve) {
        _app.model[model].findByIdAndUpdate(itemId, {slug})
            .then(() => {
                response.status = 'success';
                response.message = 'Cập nhật thành công';
                response.data = {slug};
                resolve(response);
            })
            .catch((err) => {
                console.log('Update slug error: ', err);
                response.message = 'Xảy ra lỗi khi cập nhật slug!';
                resolve(response);
            });
    })
};

module.exports = {

    generateSlug,

    updateSlug: co.wrap(function* (req, model) {
        let response = {
            status: 'error',
            message: 'Đã xảy ra lỗi',
            data: {}
        };
        let currentItem;
        try {
            currentItem = yield _app.model[model].findById(req.body.itemId).select('slug');
        } catch (err) {
            response.message = 'Lỗi khi lấy thông tin slug';
            return response;
        }

        if (req.body.slug === currentItem.slug) {
            response.message = 'Slug cũ và mới giống nhau';
            return response;
        }
        let slug = yield generateSlug(req.body.slug, model);
        response = yield updateSlug(req.body.itemId, slug, model, response);

        return response
    })
};