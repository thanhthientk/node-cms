"use strict";
const _info = require('../index').info;
const _Module = _app.model.post;
const co = require('co');

const generateColumns = function (users = [{}]) {
    return [
        {
            displayType: 'checkbox',
            width: '3%',
        },
        {
            label: '',
            name: 'image',
            headSort: false,
            displayType: 'image-thumb',
            width: '3%'
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
                {path: 'createdBy', select: 'fullname'},
                {path: 'image', select: 'path ext'}
            ]
        };

        let paginateParams = generatePaginateParams(
            generateColumns(),
            setPaginateOptions,
            req.query,
            {postType: 'slide'}
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
            res.render(_info.views.create);
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

        req.body.fields = generateBodyFields(req);
        req.body.createdBy = req.user._id.toString();

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
            let Results = yield Promise.all([
                _Module.findById(req.params.id).populate('image'),
            ]);
            let item = Results[0]

            res.render(_info.views.create, { item });
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
    }

};