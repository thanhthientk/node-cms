"use strict";
const info = {
    label: "Bài viết",
    slug: "posts",
    singular_slug: "post",
    collection: 'Post',
    views: {
        index: "posts/views/index",
        create: "posts/views/create"
    },
    page_title: {
        index: "Bài viết",
        create: "Thêm bài viết mới",
        update: "Cập nhật bài viết",
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
    },
    category: {
        title: 'Quản lý danh mục bài viết',
        slug: 'post_category'
    },
    tag: {
        title: 'Quản lý tag',
        slug: 'post_tag'
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
        icon: 'fa fa-files-o',
        label: info.label,
        permission: permissions.read,
        position: 2,
        activeIf: {
            module: info.slug,
            controller: 'all'
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
                label: 'Danh mục',
                permission: permissions.category.slug,
                url: `/admin/taxonomies?module=posts&type=category`,
                activeIf: {
                    module: 'taxonomies',
                    controller: 'all',
                    params: {
                        reqParam: 'type',
                        value: 'category'
                    }
                }
            },
            // {
            //     label: 'Tag',
            //     permission: permissions.tag.slug,
            //     url: `/admin/taxonomies?module=posts&type=tag`,
            //     activeIf: {
            //         module: 'taxonomies',
            //         controller: ['index', 'create', 'edit'],
            //         params: {
            //             reqParam: 'type',
            //             value: 'tag'
            //         }
            //     }
            // }
        ]
    },
    taxonomies: {
        category: {
            label: 'Danh mục'
        },
        tag: {
            label: 'Tag'
        }
    }
};