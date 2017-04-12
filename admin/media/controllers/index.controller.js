"use strict";
const _info = require('../index').info;
const _Module = _app.model[_info.singular_slug];
const multer = require(_join('configs/upload.js'));
const upload = multer.single('file');
const path = require('path');
const Jimp = require('jimp');
const fs = require('fs');
const co = require('co');

const generateColumns = function (users = {}, type = 'image') {
    return [
        {
            displayType: 'checkbox',
            width: '3%',
        },
        {
            label: '',
            name: 'path',
            headSort: false,
            displayType: 'image-thumb'
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
                {
                    name: 'type',
                    value: type
                }
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
        },
        {
            displayType: 'edit-button'
        }
    ];
};

module.exports = {

    index: function (req, res, next) {
        let setPaginateOptions = {
            populate: [
                {path: 'createdBy', select: 'fullname'}
            ],
            limit: 20
        };
        let paginateParams = generatePaginateParams(
            generateColumns(),
            setPaginateOptions,
            req.query,
            {type: req.query.type || 'image'}
        );

        Promise.all([
            _Module.paginate(paginateParams.queries, paginateParams.options),
            _app.model.user.find().select('fullname').sort({fullname: 'desc'})
        ])
            .then((results => {
                let users = results[1];
                let items = results[0].docs;

                console.log(items);

                let paginated = generatePaginateLink(req, results[0]);
                let columns = generateColumns(users, req.query.type);
                res.render(_info.views.index, { items, paginated, columns });
            }))
            .catch(err => {
                next(err);
            })
    },

    create: co.wrap(function* (req, res, next) {
        res.render(_info.views.create);
    }),

    store: function(req, res, next) {
        let response = {};
        upload(req, res, (err) => {
            if (err || !req.file) {
                response.status = 0;
                if (err.code == 'LIMIT_FILE_SIZE') {
                    response.message = 'File quá lớn!'
                } else if (err.message == 'NOT_ALLOW_EXTENSION') {
                    response.message = 'Định dạng không được cho phép!'
                } else {
                    response.message = 'Có lỗi xảy ra!'
                }
                res.json(response);
            } else {
                let {name, ext} = path.parse(req.file.filename);
                let newFile = new _Module({
                    name,
                    ext,
                    path: name,
                    createdBy: req.user.id,
                    type: req.query.type || 'image'
                });
                newFile.save()
                    .then((file) => {
                        response.file = file;
                        return Jimp.read(`./public/uploads/${name}${ext}`)
                    })
                    .then((image) => {
                        image.cover(150, 150)
                            .write(`./public/uploads/${name}-150x150${ext}`);

                        response.status = 1;
                        response.message = 'Đã tải lên thành công';
                        res.json(response);
                    })
                    .catch(err => {
                        console.log('File: ', name, err);
                        response.status = 0;
                        response.message = 'Có lỗi xảy ra!';
                        res.json(response);
                    })
            }
        })
    },

    edit: co.wrap(function* (req, res, next) {
        try {
            let Results = yield Promise.all([
                _Module.findById(req.params.id),
            ]);
            let item = Results[0];
            res.render(_info.views.create, { item });
        }
        catch (err) {
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
        let arrPromise = [];
        let listId = (Array.isArray(req.body.listId)) ? req.body.listId : [req.body.listId];
        for (let id of listId) {
            arrPromise.push(_Module.findByIdAndRemove(id));
        }
        Promise.all(arrPromise)
            .then((files) => {
                let arrPromise = [];
                for (let file of files) {
                    if (fs.existsSync(`./public/uploads/${file.path}${file.ext}`
                        && `./public/uploads/${file.path}-150x150${file.ext}`)){
                        arrPromise.push(fs.unlink(`./public/uploads/${file.path}${file.ext}`));
                        arrPromise.push(fs.unlink(`./public/uploads/${file.path}-150x150${file.ext}`));
                    }
                }

                return Promise.all(arrPromise);
            })
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

    apiGetAll: function (req, res, next) {
        let type = req.query.type || 'image';
        _app.model.media
            .paginate({type}, {
                page: req.query.page,
                limit: 32,
                sort: {createdOn: 'desc'}
            })
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                res.json(err);
            });
    }

};