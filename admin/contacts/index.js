"use strict";
const info = {
    label: "Contact",
    slug: "contacts",
    singular_slug: "contact",
    collection: 'Contact',
    views: {
        index: "contacts/views/index",
        create: "contacts/views/create"
    },
    page_title: {
        index: "Contact",
        create: "Thêm mới Contact",
        update: "Cập nhật Contact",
    }
};
const permissions = {
    read: {
        title: `Quản lý ${info.label}`,
        slug: `${info.singular_slug}_read`
    },
    create: {
        title: `Thêm ${info.label} mới`,
        slug: `${info.singular_slug}_create`
    },
    update: {
        title: `Cập nhật ${info.label}`,
        slug: `${info.singular_slug}_update`
    },
    destroy: {
        title: `Xóa ${info.label}`,
        slug: `${info.singular_slug}_delete`
    }
};

module.exports = {
    info,
    permissions,
    routes: [
        {
            path: `/admin/${info.slug}`,
            controller: 'index',
            method: 'get',
            permission: permissions.read.slug,
            authenticate: true
        },
        {
            path: `/admin/${info.slug}/create`,
            controller: 'create',
            method: 'get',
            permission: permissions.create.slug,
            authenticate: true
        },
        {
            path: `/admin/${info.slug}/create`,
            controller: 'store',
            method: 'post',
            permission: permissions.create.slug,
            authenticate: true
        },
        {
            path: `/admin/${info.slug}/:id/edit`,
            controller: 'edit',
            method: 'get',
            permission: permissions.update.slug,
            authenticate: true
        },
        {
            path: `/admin/${info.slug}/:id/edit`,
            controller: 'update',
            method: 'post',
            permission: permissions.update.slug,
            authenticate: true
        },
        {
            path: `/admin/${info.slug}/delete`,
            controller: 'destroy',
            method: 'post',
            permission: permissions.destroy.slug,
            authenticate: true
        },
        {
            path: `/contact/api/create`,
            controller: 'apiCreate',
            method: 'post'
        }

    ],
    menu: {
        icon: 'fa fa-link',
        label: info.label,
        permission: permissions.read,
        position: 35,
        activeIf: {
            module: info.slug,
            controller: ['index', 'create', 'edit']
        },
        child: [
            {
                label: 'Liên hệ',
                url: `/admin/${info.slug}?type=contact`,
                activeIf: {
                    module: info.slug,
                    controller: 'all',
                    params: {
                        reqParam: 'type',
                        value: 'contact'
                    }
                }
            },
            {
                label: 'Đăng ký nhận mail',
                url: `/admin/${info.slug}?type=newsletter`,
                activeIf: {
                    module: info.slug,
                    controller: 'all',
                    params: {
                        reqParam: 'type',
                        value: 'newsletter'
                    }
                }
            },
        ]
    }
};