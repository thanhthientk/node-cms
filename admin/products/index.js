"use strict";
const info = {
    label: "Sản phẩm",
    slug: "products",
    singular_slug: "product",
    views: {
        index: "products/views/index",
        create: "products/views/create"
    },
    page_title: {
        index: "Trang nội dung",
        create: "Thêm trang mới",
        update: "Cập nhật trang",
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
            path: `/admin/${info.slug}/api/changeSlug`,
            controller: 'apiChangeSlug',
            method: 'post',
            permission: permissions.update.slug,
            authenticate: true,
            csrf: false
        },
        {
            path: `/admin/${info.slug}/:id/duplicate`,
            controller: 'duplicate',
            method: 'get',
            authenticate: true
        }
    ],
    menu: {
        icon: 'fa fa-shopping-cart',
        label: 'Sản phẩm',
        permission: permissions.read,
        position: 3,
        activeIf: {
            module: info.slug,
            controller: ['index', 'create', 'edit']
        },
        child: [
            {
                label: 'Danh sách',
                permission: permissions.read.slug,
                url: `/admin/${info.slug}`,
                activeIf: {
                    module: info.slug,
                    controller: ['index']
                }
            },
            {
                label: 'Thêm mới',
                permission: permissions.create.slug,
                url: `/admin/${info.slug}/create`,
                activeIf: {
                    module: info.slug,
                    controller: ['create']
                }
            },
            {
                label: 'Danh mục Sản phẩm',
                url: `/admin/taxonomies?module=products&type=product_category`,
                activeIf: {
                    module: 'taxonomies',
                    controller: 'all',
                    params: {
                        reqParam: 'type',
                        value: 'product_category'
                    }
                }
            },
        ]
    },
    taxonomies: {
        product_category: {
            label: 'Danh mục Sản phẩm'
        }
    }
};