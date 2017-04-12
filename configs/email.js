"use strict";
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'admin@gynos.vn',
        pass: 'cZBkbkGQGQh4'
    }
});

module.exports = {
    resetPassword: function (html, email) {
        let mailOptions = {
            from: 'Gynos <admin@gynos.vn>',
            to: email,
            subject: 'Gynos.vn - Khôi phục mật khẩu',
            html
        };
        return new Promise(function (res, rej) {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) return rej(error);

                res(info);
            });
        });
    },

    sendConfrimForm: function (contact) {
        let html = '';

        switch (contact.type) {
            case 'newsletter':
                html = `<h2>Bạn vừa đăng ký nhận thông tin từ website Gynos.vn</h2>`;
                break;
            case 'contact':
                html = `<h2>Chúng tôi đã nhận được thông tin liên hệ của bạn</h2>
                                <h3>Chúng tôi sẽ liên hệ lại bạn trong thời gian sớm nhất</h3>`;
                break;
        }

        let mailOptions = {
            from: 'Gynos <admin@gynos.vn>',
            to: contact.fields.email,
            subject: 'Gynos.vn - Xác nhận thông tin',
            html
        };
        return new Promise(function (res, rej) {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) return rej(error);

                res(info);
            });
        });
    }
};