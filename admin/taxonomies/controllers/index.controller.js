"use strict";
const _info = require('../index').info;
const _Module = _app.model[_info.singular_slug];
const Slug = require(_join('libraries/slug'));
const co = require('co');

const generateColumns = function (users = {}, taxonomyModule, postType, taxonomyType) {
    return [
        {
            displayType: 'checkbox',
            width: '3%',
        },
        {
            label: 'Name',
            name: 'name',
            displayType: 'title',
            headSort: true,
            width: '47%',
            search: {
                type: 'text'
            },
            params: [
                {name: 'module', value: taxonomyModule},
                {name: 'type', value: taxonomyType},
                {name: 'post_type', value: postType}
            ]
        },
        {
            label: 'Created by',
            name: 'createdBy',
            access: 'createdBy.fullname',
            displayType: 'sort',
            headSort: true,
            width: '25%',
            class: 'label bg-blue',
            search: {
                type: 'select',
                fieldDisplay: 'fullname',
                items: users
            }
        },
        {
            label: 'Created on',
            name: 'createdOn',
            displayType: 'time',
            headSort: true,
            width: '25%',
            search: {
                type: 'date-range'
            }
        }
    ];
};

module.exports = {

    index: function (req, res, next) {
        let setPaginateOptions = {
            populate: [
                {path: 'createdBy', select: 'fullname'}
            ]
        };
        let queries = {
            module: req.query.module,
            type: req.query.type,
        };
        if (req.query['post_type'])
            queries.postType = req.query['post_type'];

        let paginateParams = generatePaginateParams(generateColumns(), setPaginateOptions, req.query, queries);

        Promise.all([
            _Module.paginate(paginateParams.queries, paginateParams.options),
            _app.model.user.find().select('fullname').sort({fullname: 'desc'})
        ])
            .then((results => {
                let users = results[1];
                let items = results[0].docs;
                let paginated = generatePaginateLink(req, results[0]);
                let columns = generateColumns(users, req.query.module, req.query['post_type'], req.query.type);
                res.render(_info.views.index, { items, paginated, columns });
            }))
            .catch(err => {
                next(err);
            })
    },

    create: function (req, res, next) {
        res.render(_info.views.create);
    },

    store: co.wrap(function* (req, res, next) {
        req.checkBody('name', `Vui lòng nhập tên ${_info.label}`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        req.body.createdBy = req.user._id.toString();
        req.body.slug = yield Slug.generateSlug(req.body.name, 'taxonomy');

        let _module = new _Module(cleanObj(req.body));
        _module.save()
            .then(() => {
                req.flash('success', `Bạn đã thêm một ${_info.label} mới!`);
                let postType = (req.body.postType) ? `&post_type=${req.body.postType}` : '';
                res.redirect(`/admin/${_info.slug}?module=${req.body.module}&type=${req.body.type}${postType}`);
            })
            .catch(err => {
                next(err);
            });
    }),

    edit: function(req, res, next) {
        _Module.findById(req.params.id)
            .then(item => {
                res.render(_info.views.create, { item });
            })
            .catch(err => {
                next(err);
            })
    },

    update: function(req, res, next) {
        req.checkBody('name', `Vui lòng nhập tên ${_info.label}`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        delete req.body.slug;
        delete req.body.createdBy;
        _Module.findByIdAndUpdate(req.params.id, cleanObj(req.body))
            .then(() => {
                req.flash('success', 'Cập nhật thành công!');
                res.redirect('back');
            })
            .catch(err => {
                next(err);
            })
    },

    destroy: function(req, res, next) {
        if (!req.body.listId) return res.redirect('back');

        _Module.remove({ _id: { $in: req.body.listId } })
            .then(() => {
                req.flash('success', 'Đã xóa thành công!');
                if (req.body.single == 'true')
                    return res.redirect(`/admin/${_info.slug}?module=${req.body.module}&type=${req.body.type}`);
                res.redirect(`back`);
            })
            .catch(err => {
                next(err);
            })
    },

    apiCreate: co.wrap(function* (req, res, next) {
        let response = {
            status: '',
            message: '',
            data: {}
        };
        req.checkBody('name', `Vui lòng nhập tên ${_info.label}`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            response.status = 'error';
            response.message = 'Vui lòng nhập tên';
            return res.json(response);
        }

        req.body.createdBy = req.user._id.toString();
        req.body.slug = yield Slug.generateSlug(req.body.name, 'taxonomy');

        let _module = new _Module(cleanObj(req.body));
        _module.save()
            .then((result) => {
                response.status = 'success';
                response.message = 'Thêm thành công';
                response.data = result;
                res.json(response);
            })
            .catch(err => {
                response.status = 'error';
                response.message = 'Lỗi khi thêm';
                res.json(response);
            });
    }),

    apiChangeSlug: co.wrap(function* (req, res, next) {
        let response = yield Slug.updateSlug(req, 'taxonomy');
        res.json(response);
    })

};