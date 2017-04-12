"use strict";
const info = {
    label: "Media",
    slug: "media",
    singular_slug: "media",
    collection: 'Media',
    views: {
        index: "media/views/index",
        create: "media/views/create"
    },
    page_title: {
        index: "Media",
        create: "Thêm mới",
        update: "Cập nhật",
    }
};
const permissions = {
    read: {
        title: `Quản lý ${info.label}`,
        slug: `${info.singular_slug}_read`
    },
    create: {
        title: `Thêm mới`,
        slug: `${info.singular_slug}_create`
    },
    update: {
        title: `Cập nhật`,
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
            authenticate: true,
            csrf: false
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
            path: `/admin/${info.slug}/api/all`,
            controller: 'apiGetAll',
            method: 'get',
            authenticate: true
        }
    ],
    menu: {
        icon: 'fa fa-picture-o',
        label: info.label,
        permission: permissions.read.slug,
        url: `/admin/${info.slug}`,
        position: 60,
        activeIf: {
            module: info.slug,
            controller: ['index', 'create', 'edit']
        },
        child: [
            {
                label: 'Hình ảnh',
                url: `/admin/media?type=image`,
                activeIf: {
                    module: info.slug,
                    controller: ['index', 'create', 'edit'],
                    params: {
                        reqParam: 'type',
                        value: 'image'
                    }
                }
            },
            {
                label: 'Gallery',
                url: `/admin/media?type=gallery`,
                activeIf: {
                    module: info.slug,
                    controller: ['index', 'create', 'edit'],
                    params: {
                        reqParam: 'type',
                        value: 'gallery'
                    }
                }
            }
        ]
    }
};