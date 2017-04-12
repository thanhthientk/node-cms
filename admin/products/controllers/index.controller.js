"use strict";
const _info = require('../index').info;
const _Module = _app.model.post;
const Slug = require(_join('libraries/slug'));
const co = require('co');

const generateColumns = function (users = [{}]) {
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
            width: '25%',
            search: {
                type: 'text'
            }
        },
        {
            label: 'Alias',
            name: 'slug',
            displayType: 'title',
            headSort: true,
            width: '18%',
            search: {
                type: 'text'
            }
        },
        {
            label: 'Status',
            name: 'status',
            displayType: 'label',
            headSort: true,
            width: '10%',
            itemsInfo: {
                show: {
                    class: 'bg-green',
                    text: 'Hiển thị'
                },
                hide: {
                    class: 'bg-gray',
                    text: 'Ẩn'
                }
            },
            search: {
                type: 'select',
                fieldDisplay: 'name',
                items: [
                    {id: 'show', name: 'Hiển thị'},
                    {id: 'hide', name: 'Ẩn'}
                ]
            }
        },
        {
            label: 'Created by',
            name: 'createdBy',
            access: 'createdBy.fullname',
            displayType: 'sort',
            headSort: true,
            width: '14%',
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
            width: '10%',
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

        let paginateParams = generatePaginateParams(
            generateColumns(),
            setPaginateOptions,
            req.query,
            {postType: 'product'}
        );

        Promise.all([
            _Module.paginate(paginateParams.queries, paginateParams.options),
            _app.model.user.find().select('fullname').sort({fullname: 'desc'}),
        ])
            .then((results => {
                let users = results[1];
                let items = results[0].docs;
                let paginated = generatePaginateLink(req, results[0]);
                let columns = generateColumns(users);
                res.render(_info.views.index, { items, paginated, columns });
            }))
            .catch(err => {
                next(err);
            })
    },

    create: co.wrap(function* (req, res, next) {
        try {
            let categories = yield _app.model.taxonomy.find({module: 'products', type: 'product_category'}).select('name');
            res.render(_info.views.create, { categories });
        } catch (err) {
            next(err);
        }
    }),

    store: co.wrap(function* (req, res, next) {
        req.checkBody('name', `Vui lòng nhập tên bài viết`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        req.body.createdBy = req.user._id.toString();
        req.body.fields = generateBodyFields(req);

        req.body.slug = yield Slug.generateSlug(req.body.name, 'post');

        let _module = new _Module(cleanObj(req.body));
        _module.save()
            .then(() => {
                req.flash('success', `Bạn đã thêm một ${_info.label} mới!`);
                res.redirect(`/admin/${_info.slug}`);
            })
            .catch(err => {
                next(err);
            });
    }),

    edit: co.wrap(function* (req, res, next) {
        try {
            let queries = yield Promise.all([
                _Module.findById(req.params.id).populate('gallery', 'path ext'),
                _app.model.taxonomy.find({module: 'products', type: 'product_category'}).select('name')
            ]);
            let item = queries[0],
                categories = queries[1];

            res.render(_info.views.create, { item, categories });
        } catch (err) {
            next(err);
        }
    }),

    update: function(req, res, next) {
        req.checkBody('name', `Vui lòng nhập tên ${_info.label}`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        req.body.fields = generateBodyFields(req);
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
                    return res.redirect(`/admin/${_info.slug}`);
                res.redirect(`back`);
            })
            .catch(err => {
                next(err);
            })
    },

    apiChangeSlug: co.wrap(function* (req, res, next) {
        let response = yield Slug.updateSlug(req, 'post');
        res.json(response);
    }),

    duplicate: co.wrap(function* (req, res, next) {
        try {
            let item = yield _app.model.post.findById(req.params.id);

            let newItemData = item.toObject();
            delete newItemData._id;

            let newItem = new _app.model.post(newItemData);
            yield newItem.save();

            res.redirect(`/admin/${_info.slug}`);
        } catch (err) {
            next(err);
        }
    })

};