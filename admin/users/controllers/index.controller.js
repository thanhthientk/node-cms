"use strict";
const passport = require('passport');
const co = require('co');
const recaptcha = require(`${__libs}/recaptcha`);
const _Module = _app.model.user;
const _info = require('../index').info;
const bcrypt = require(_join('libraries/bcrypt'));
const email = require(_join('configs/email'));

const generateColumns = function (users = {}, roles = {}) {
    return [
        {
            displayType: 'checkbox',
            width: '3%',
        },
        {
            label: 'Tên',
            name: 'fullname',
            displayType: 'title',
            headSort: true,
            width: '30%',
            search: {
                type: 'text'
            }
        },
        {
            label: 'Email',
            name: 'email',
            displayType: 'title',
            headSort: true,
            width: '22%',
            search: {
                type: 'text'
            }
        },
        {
            label: 'Nhóm quyền',
            name: 'role',
            access: 'role.name',
            displayType: 'sort',
            headSort: true,
            width: '15%',
            class: 'label bg-blue',
            search: {
                type: 'select',
                fieldDisplay: 'name',
                items: roles
            }
        },
        {
            label: 'Được tạo bởi',
            name: 'createdBy',
            access: 'createdBy.fullname',
            displayType: 'sort',
            headSort: true,
            width: '15%',
            class: 'label bg-blue',
            search: {
                type: 'select',
                fieldDisplay: 'fullname',
                items: users
            }
        },
        {
            label: 'Thời gian tạo',
            name: 'createdOn',
            displayType: 'time',
            headSort: true,
            width: '15%',
            search: {
                type: 'date-range'
            }
        }
    ];
};
const CheckToken = function (userId, token) {
    //return false: wrong token or userId
    return new Promise(function (resolve, reject) {
        _app.model.user.findById(userId)
            .then(user => {
                resolve((userId && token && user && user.token.value === token));
            })
            .catch(() => {
                resolve(false);
            })
    })
};

module.exports = {

    //Module routes
    index: function (req, res, next) {
        let setPaginateOptions = {
            populate: [
                {path: 'createdBy', select: 'fullname'},
                {path: 'role', select: 'name'}
            ]
        };
        let paginateParams = generatePaginateParams(generateColumns(), setPaginateOptions, req.query);

        Promise.all([
            _Module.paginate(paginateParams.queries, paginateParams.options),
            _app.model.user.find().select('fullname').sort({fullname: 'desc'}),
            _app.model.role.find().select('name').sort({name: 'desc'})
        ])
            .then((results => {
                let roles = results[2];
                let users = results[1];
                let items = results[0].docs;
                let paginated = generatePaginateLink(req, results[0]);
                let columns = generateColumns(users, roles);
                res.render(_info.views.index, { items, paginated, columns });
            }))
            .catch(err => {
                next(err);
            })
    },

    create: function (req, res, next) {
        let item = req.session.flash.itemDatas ? req.session.flash.itemDatas[0] : {};
        _app.model.role.find({}).select('name').sort({name: 'desc'})
            .then(roles => {
                res.render(_info.views.create, { item, roles });
            })
            .catch(err => {
                next(err);
            });
    },

    store: co.wrap(function* (req, res, next) {
        req.checkBody('fullname', 'Vui lòng nhập tên người dùng').notEmpty();
        req.checkBody('email', 'Vui lòng nhập email').notEmpty();
        req.checkBody('email', 'Email không đúng định dạng').isEmail();
        req.checkBody('password', 'Vui lòng nhập mật khẩu').notEmpty();
        req.checkBody('password', 'Mật khẩu tối thiểu 6 kí tự').isLength({min: 6});
        req.checkBody('password2', 'Xác nhận mật khẩu không khớp').equals(req.body.password);

        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        let checkUniqueEmail = false;
        try {
            checkUniqueEmail = yield _app.model.user.findOne({email: req.body.email});
        } catch (err) {
            next(err)
        }
        if (checkUniqueEmail) {
            req.flash('errors', [{msg: `Email ${req.body.email} đã tồn tại`}]);
            delete req.body.password;
            delete req.body.password2;
            req.flash('itemDatas', req.body);
            return res.redirect('back');
        }

        req.body.createdBy = req.user._id.toString();
        let _module = new _Module(cleanObj(req.body));
        _module.save()
            .then(() => {
                req.flash('success', 'Bạn đã thêm một người dùng mới!');
                res.redirect(`/admin/${_info.slug}`);
            })
            .catch(err => {
                next(err);
            });
    }),

    edit: function(req, res, next) {
        Promise.all([
            _Module.findById(req.params.id).select('fullname email'),
            _app.model.role.find({}).select('name').sort({name: 'desc'})
        ])
            .then(results => {
                let item = results[0];
                let roles = results[1];

                res.render(_info.views.create, { item, roles });
            })
            .catch(err => {
                next(err);
            })
    },

    update: function(req, res, next) {
        req.checkBody('fullname', 'Vui lòng nhập tên _module').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        delete req.body.password;
        delete req.body.email;
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

    destroy: function (req, res, next) {
        if (!req.body.listId) return res.redirect('back');

        if (req.body.listId === '58bfd13a753985dc8b735f49' || req.body.listId.indexOf('58bfd13a753985dc8b735f49') > -1){
            return res.redirect('back');
        }

        _Module.remove({ _id: { $in: req.body.listId } })
            .then(() => {
                req.flash('success', 'Đã xóa thành công!');
                if (req.body.single === true)
                    return res.redirect(`/admin/${_info.slug}`);
                res.redirect(`back`);
            })
            .catch(err => {
                next(err);
            })
    },

    changePassword: co.wrap(function* (req, res, next) {
        let response = {
            status: 'error',
            message: 'Xảy ra lỗi'
        };
        req.checkBody('oldPassword', 'Mật khẩu hiện tại không được trống').notEmpty();
        req.checkBody('newPassword', 'Mật khẩu mới không được trống').notEmpty();
        req.checkBody('newPassword', 'Mật khẩu mới có độ dài từ 6 đến 32 kí tự').isLength({min: 6, max: 32});
        req.checkBody('newPassword2', 'Xác nhận mật khẩu mới không khớp').equals(req.body.newPassword);
        const errors = req.validationErrors();
        if (errors) {
            response.message = 'Lỗi xác thực';
            response.errCode = 'VALIDATION_ERRORS';
            response.errors = errors;
            return res.json(response);
        }
        //Check permission
        let updatePermission = _checkPermission('user_update', req.user);
        if (!updatePermission && !(req.body.userId == req.user.id)) {
            response.message = 'Bạn không có quền thay đổi mật khẩu của tài khoản này';
            return res.json(response);
        }

        //Check old Password
        let checkOldPassword = yield bcrypt.checkUserPassword(req.body.userId, req.body.oldPassword);
        if (!checkOldPassword) {
            response.message = 'Mật khẩu hiện tại không chính xác';
            return res.json(response);
        }

        //Update Pass
        let newPass = yield bcrypt.hash(req.body.newPassword);
        if (!newPass) {
            response.message = 'Lỗi khi mã hóa mật khẩu mới. Vui lòng thử lại sau';
            return res.json(response);
        }
        _app.model.user.findByIdAndUpdate(req.body.userId, {password: newPass})
            .then(() => {
                response.status = 'success';
                response.message = 'Đổi mật khẩu thành công';
                res.json(response);
            })
            .catch(err => {
                console.log(err);
                response.message = 'Xảy ra lỗi khi cập nhật mật khẩu mới';
                res.json(response);
            })
    }),

    //Authenticate routes
    getLogin: function (req, res, next) {
        if (req.user)
            return res.redirect('/admin');
        res.render('users/views/login', { recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY });
    },

    postLogin: co.wrap(function* (req, res, next) {
        let GetCheckCaptCha;
        try {
            GetCheckCaptCha = yield recaptcha.checkCaptCha(req.body["g-recaptcha-response"]);
        } catch (err) {
            req.flash('errors', {msg: 'Lỗi xác thực captcha. Vui lòng thử lại!'});
            return res.redirect('back');
        }
        if (GetCheckCaptCha.success === false) {
            req.flash('errors', {msg: 'Invalid Captcha'});
            return res.redirect('back');
        }

        req.checkBody('email', 'Email không đúng định dạng').isEmail();
        req.checkBody('password', 'Mật khẩu không được để trống').notEmpty();
        let errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        passport.authenticate('local', (err, user, info) => {
            if (err) throw err;
            if (!user) {
                req.flash('errors', {msg: 'Email hoặc mật khẩu không đúng!'});
                return res.redirect('back');
            }
            req.logIn(user, (err) => {
                if (err) throw err;
                return res.redirect('/admin');
            })
        })(req, res, next);
    }),

    getLogout: function (req, res, next) {
        req.session.cookie.expires = null;
        req.session.passport = null;
        req.logout();
        res.redirect('/admin/login');
    },
    
    getForgotPassword: function (req, res, next) {
        res.render('users/views/forgot-password', { pageTitle: 'Quên mật khẩu', recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY })
    },

    postForgotPassword: co.wrap(function* (req, res, next) {
        req.checkBody('email', 'Email không đúng định dạng').isEmail();
        let errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        let GetCheckCaptCha;
        try {
            GetCheckCaptCha = yield recaptcha.checkCaptCha(req.body["g-recaptcha-response"]);
        } catch (err) {
            req.flash('errors', {msg: 'Lỗi xác thực captcha. Vui lòng thử lại!'});
            return res.redirect('back');
        }
        if (GetCheckCaptCha.success === false) {
            req.flash('errors', {msg: 'Lỗi xác thực captcha'});
            return res.redirect('back');
        }

        let userFound = {}, token = '';
        _app.model.user.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('email', req.body.email);
                    req.flash('errors', {msg: 'Không tìm thấy người dùng'});
                    return res.redirect('back');
                }
                userFound = user;
                return bcrypt.hash('ahskd123123jhksda' + Date.now());
            })
            .then(tokenResult => {
                token = tokenResult;
                let now = new Date();
                let expires = now.setDate(now.getDate() + 1);
                return _app.model.user.findByIdAndUpdate(userFound._id, {"token.value": token, "token.expires": expires});
            })
            .then(user => {
                let link = `http://arielhomes.vn/admin/forgot-password/confirm?f=${user.id}&s=${token}`;
                let html = `<h2>Bạn vừa thực hiện yêu cầu khôi phục mật khẩu</h2>
                            <p>Vui lòng truy cập vào liên kết sau</p>
                            <p><a href="${link}">${link}</a></p>`;

                email.resetPassword(html, user.email)
                    .then((info) => {
                        req.flash('success', 'Chúng tôi đã gửi liên kết khôi phục mật khẩu. Vui lòng kiểm tra email của bạn!');
                        res.redirect('back');
                    })
                    .catch(err => {
                        req.flash('errors', {msg: 'Có lỗi xảy ra. Vui lòng thử lại'});
                        return res.redirect('back');
                    })
            })
            .catch(err => {
                console.log(err);
                req.flash('errors', {msg: 'Xảy ra lỗi, Vui lòng thử lại!'});
                return res.redirect('back');
            })
    }),

    confirmToken: co.wrap(function* (req, res, next) {
        let userId = req.query.f,
            token = req.query.s;
        let checkToken = yield CheckToken(userId, token);

        if (!checkToken) {
            req.flash('errors', {msg: 'Liên kết không đúng hoặc đã hết thời gian thực thi. Vui lòng thử lại'});
            return res.redirect('/admin/forgot-password');
        }

        res.render('users/views/change-password', {
            userId,
            token,
            pageTitle: 'Quên mật khẩu',
            recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        })
    }),

    postChangePassword: co.wrap(function* (req, res, next) {
        let GetCheckCaptCha;
        try {
            GetCheckCaptCha = yield recaptcha.checkCaptCha(req.body["g-recaptcha-response"]);
        } catch (err) {
            req.flash('errors', {msg: 'Lỗi xác thực captcha. Vui lòng thử lại!'});
            return res.redirect('back');
        }
        if (GetCheckCaptCha.success === false) {
            req.flash('errors', {msg: 'Lỗi xác thực captcha'});
            return res.redirect('back');
        }
        //Validation
        req.checkBody('password', 'Password không được để trống').notEmpty();
        req.checkBody('password', 'Password từ 8 đến 32 kí tự').isLength({min: 6, max: 32});
        req.checkBody('password2', 'Password nhập lại không đúng').equals(req.body.password);
        let errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }
        //Check userId & token
        let userId = req.body.userId,
            token = req.body.token;
        let checkToken = yield CheckToken(userId, token);
        if (!checkToken) {
            req.flash('errors', {msg: 'Liên kết không đúng hoặc đã hết thời gian thực thi. Vui lòng thử lại'});
            return res.redirect('/admin/forgot-password');
        }

        //Update Password
        let newPass = yield bcrypt.hash(req.body.password);
        if (!newPass) {
            req.flash('errors', {msg: 'Có lỗi xảy ra. Vui lòng thử lại'});
            return res.redirect('back');
        }
        _app.model.user.findByIdAndUpdate(req.body.userId, {password: newPass})
            .then(() => {
                req.flash('success', 'Đổi mật khẩu thành công. Vui lòng đăng nhập');
                res.redirect('/admin/login');
            })
            .catch(err => {
                console.log(err);
                req.flash('errors', {msg: 'Có lỗi xảy ra. Vui lòng thử lại'});
                res.redirect('back');
            })
    })

};