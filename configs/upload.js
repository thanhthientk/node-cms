"use strict";
const multer = require('multer');
const path = require('path');

// Helper for upload file process
const allowExtension = [
    '.jpg', '.jpeg', '.gif', '.png', '.bmp'
];
// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        let { name, ext } = path.parse(file.originalname);
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});
const limits = {
    fileSize: 8*1024*1024
};
const fileFilter = function (req, file, cb) {
    let extension = path.parse(file.originalname).ext;

    if (allowExtension.indexOf(extension) === -1) {
        cb(new Error('NOT_ALLOW_EXTENSION'));
        cb(null, false);
    } else {
        cb(null, true);
    }
};

module.exports = multer({
    storage,
    limits,
    fileFilter
});