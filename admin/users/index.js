"use strict";
const rolePermissions = require('../roles/index').permissions;

const info = {
    label: "Người dùng",
    slug: "users",
    singular_slug: "user",
    views: {
        index: "users/views/index",
        create: "users/views/create"
    },
    page_title: {
        index: "Người dùng",
        create: "Thêm mới",
        update: "Cập nhật",
    }
};

const permissions = {
    read: {
        title: 'Quản lý người dùng',
        slug: 'user_read'
    },
    create: {
        title: 'Thêm người dùng mới',
        slug: 'user_create'
    },
    update: {
        title: 'Cập nhật người dùng',
        slug: 'user_update'
    },
    destroy: {
        title: 'Cập nhật người dùng',
        slug: 'user_delete'
    }
};

module.exports = {
    info,
    permissions,
    routes: [
        {
            path: '/admin/login',
            controller: 'getLogin',
            method: 'get',
        },
        {
            path: '/admin/login',
            controller: 'postLogin',
            method: 'post',
        },
        {
            path: '/admin/logout',
            controller: 'getLogout',
            method: 'get',
            authenticate: true
        },
        {
            path: '/admin/forgot-password',
            controller: 'getForgotPassword',
            method: 'get'
        },
        {
            path: '/admin/forgot-password',
            controller: 'postForgotPassword',
            method: 'post'
        },
        {
            path: '/admin/forgot-password/confirm',
            controller: 'confirmToken',
            method: 'get'
        },
        {
            path: '/admin/forgot-password/confirm',
            controller: 'postChangePassword',
            method: 'post'
        },
        {
            path: '/admin/users',
            controller: 'index',
            method: 'get',
            permission: permissions.read.slug,
            authenticate: true
        },
        {
            path: '/admin/users/create',
            controller: 'create',
            method: 'get',
            permission: permissions.create.slug,
            authenticate: true
        },
        {
            path: '/admin/users/create',
            controller: 'store',
            method: 'post',
            permission: permissions.create.slug,
            authenticate: true
        },
        {
            path: '/admin/users/:id/edit',
            controller: 'edit',
            method: 'get',
            permission: permissions.update.slug,
            authenticate: true
        },
        {
            path: '/admin/users/:id/edit',
            controller: 'update',
            method: 'post',
            permission: permissions.update.slug,
            authenticate: true
        },
        {
            path: '/admin/users/delete',
            controller: 'destroy',
            method: 'post',
            permission: permissions.destroy.slug,
            authenticate: true
        },
        {
            path: '/admin/users/change-password',
            controller: 'changePassword',
            method: 'post',
            authenticate: false,
            csrf: false
        }
    ],
    menu: {
        icon: 'fa fa-users',
        label: info.label,
        permission: permissions.read,
        position: 70,
        activeIf: {
            module: [info.slug, 'roles'],
            controller: ['index', 'create', 'edit']
        },
        child: [
            {
                label: 'Danh sách',
                permission: permissions.read.slug,
                url: '/admin/users',
                activeIf: {
                    module: 'users',
                    controller: ['index']
                }
            },
            {
                label: 'Thêm mới',
                permission: permissions.create.slug,
                url: '/admin/users/create',
                activeIf: {
                    module: 'users',
                    controller: ['create']
                }
            },
            {
                label: 'Nhóm quyền',
                permission: rolePermissions.read.slug,
                url: '/admin/roles',
                activeIf: {
                    module: 'roles',
                    controller: ['index', 'edit', 'create']
                }
            }
        ]
    },
};