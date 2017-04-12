"use strict";
const _info = require('../index').info;
const _Module = _app.model[_info.singular_slug];
const co = require('co');
const email = require(_join('configs/email'));

const generateColumns = function (type) {
    let columns = [
        {
            displayType: 'checkbox',
            width: '3%',
        }
    ];

    const genField = function (label, field) {
        return {
            label,
            name: 'fields',
            displayType: 'field',
            access: 'fields.' + field
        }
    };

    let email = genField('Email', 'email');
    let name = genField('Name', 'name');
    let phone = genField('Phone', 'phone');

    switch (type) {
        case 'newsletter':
            columns.push(email);
            break;
        case 'contact':
            columns.push(email);
            columns.push(name);
            columns.push(phone);
            columns.push(genField('Message', 'message'));
            break;
        case 'booking':
            columns.push(email);
            columns.push(name);
            columns.push(phone);
            columns.push(genField('Date Start', 'start'));
            columns.push(genField('Date End', 'end'));
            columns.push(genField('Room', 'room'));
            columns.push(genField('Adult', 'adult'));
            columns.push(genField('Child', 'child'));
            break;
        case 'tour':
            columns.push(email);
            columns.push(name);
            columns.push(phone);
            columns.push(genField('Guest', 'guest'));
            break;
    }

    columns.push({
        label: 'Created on',
        name: 'createdOn',
        displayType: 'time',
        headSort: true,
        width: '15%',
        search: {
            type: 'date-range'
        }
    });

    return columns;
};

module.exports = {

    index: function (req, res, next) {
        if (!req.query.type) return res.redirect('/admin/contacts?type=contact');
        let setPaginateOptions = {};
        let paginateParams = generatePaginateParams(
            generateColumns(req.query.type),
            setPaginateOptions,
            req.query,
            {type: req.query.type}
        );

        Promise.all([
            _Module.paginate(paginateParams.queries, paginateParams.options),
        ])
            .then((results => {
                let items = results[0].docs;
                let paginated = generatePaginateLink(req, results[0]);
                let columns = generateColumns(req.query.type);
                res.render(_info.views.index, { items, paginated, columns });
            }))
            .catch(err => {
                next(err);
            })
    },

    create: function (req, res, next) {
        res.render(_info.views.create);
    },

    store: function(req, res, next) {
        req.checkBody('name', `Vui lòng nhập tên ${_info.label}`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

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
    },

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

    apiCreate: co.wrap(function* (req, res, next) {
        let response = {status: 'error', message: ''};
        try{
            let data = {
                type: req.body.type,
                fields: generateBodyFields(req)
            };
            let contactDocument = new _Module(data);

            let contact = yield contactDocument.save();

            if (contact) {
                response.status = 'success';
                switch (contact.type) {
                    case 'newsletter':
                        response.message = 'Chúng tôi đã nhận được đăng ký của bạn!';
                        break;
                    case 'booking':
                        response.message = 'Chúng tôi đã nhận được đặt phòng của bạn!';
                        break;
                    case 'contact':
                        response.message = 'Chúng tôi sẽ liên hệ lại bạn trong thời gian sớm nhất!';
                        break;
                    case 'tour':
                        response.message = 'Chúng tôi đã nhận được đăng ký của bạn!';
                        break;
                }
            }

            yield email.sendConfrimForm(contact);
            res.json(response);

        } catch (err) {
            res.json(response);
        }
    })

};