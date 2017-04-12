"use strict";
const PostRoles = require('../posts/index').permissions;
/**
 * Middleware
 * getTaxonomyInfo - Return module name, taxonomy type...
 */
const getTaxonomyInfo = function (req, res, next) {
    let taxonomyModule = req.query.module || 'posts',
        taxonomyType = req.query.type || 'category',
        postType = req.query['post_type'];

    let taxonomyInfo;
    if (postType)
        taxonomyInfo = require(_join(`admin/${taxonomyModule}/post_types/${postType}`)).taxonomies[taxonomyType];
    else
        taxonomyInfo = require(_join(`admin/${taxonomyModule}/index`)).taxonomies[taxonomyType];

    res.locals.moduleInfo.label = taxonomyInfo.label;
    res.locals.moduleInfo.taxonomy = {
        module: taxonomyModule,
        type: taxonomyType
    };
    next();
};

const info = {
    label: "Taxonomies",
    slug: "taxonomies",
    singular_slug: "taxonomy",
    collection: 'Taxonomy',
    views: {
        index: "taxonomies/views/index",
        create: "taxonomies/views/create"
    },
    page_title: {
        index: "Taxonomies",
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
            authenticate: true,
            middlewares: [getTaxonomyInfo]
        },
        {
            path: `/admin/${info.slug}/create`,
            controller: 'create',
            method: 'get',
            permission: permissions.create.slug,
            authenticate: true,
            middlewares: [getTaxonomyInfo]
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
            authenticate: true,
            middlewares: [getTaxonomyInfo]
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
            path: `/admin/${info.slug}/api/create`,
            controller: 'apiCreate',
            method: 'post',
            permission: PostRoles.category.slug,
            authenticate: true,
            csrf: false
        },
        {
            path: `/admin/${info.slug}/api/changeSlug`,
            controller: 'apiChangeSlug',
            method: 'post',
            permission: permissions.update.slug,
            authenticate: true,
            csrf: false
        }
    ]
};