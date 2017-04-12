"use strict";
const co = require('co');

module.exports = {

    index: co.wrap(function* (req, res, next) {
        try {
            let Results = yield Promise.all([
                _app.model.post.find({postType: 'slide', status: 'show'}).populate('image', 'path ext'),
                _app.model.post
                    .find({postType: 'product', status: 'show'})
                    .limit(8)
                    .populate('gallery', 'path ext')
                    .select('name fields gallery slug createdOn description'),
                _app.model.post
                    .find({postType: 'post', status: 'show'})
                    .limit(3)
                    .populate('image', 'path ext')
                    .select('name image description slug time'),
            ]);
            //
            let slides = Results[0],
                products = Results[1],
                recentPosts = Results[2];

            res.theme('index', {
                slides,
                products,
                recentPosts,
                pageType: 'home'
            });
        } catch (err) {
            next(err);
        }
    }),

    contact: function (req, res, next) {
        res.theme('page-contact', {
            pageType: 'contact',
            pageTitle: 'Liên hệ'
        });
    }

};