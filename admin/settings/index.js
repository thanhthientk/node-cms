"use strict";
const info = {
    label: "Cài đặt",
    slug: "settings",
    singular_slug: "setting",
    collection: 'Setting',
    views: {
        index: "setting/views/index",
        create: "setting/views/create"
    },
    page_title: {
        index: "Cài đặt",
        create: "Thêm mới setting",
        update: "Cập nhật setting",
    }
};
const permissions = {
    general: {
        title: 'Cài đặt chung',
        slug: `${info.singular_slug}_general`
    },
    themeOption: {
        title: 'Tùy chỉnh giao diện',
        slug: `${info.singular_slug}_theme_option`
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
            path: `/admin/${info.slug}/general`,
            controller: 'general',
            method: 'get',
            authenticate: true,
            permission: permissions.general.slug,
        },
        {
            path: `/admin/${info.slug}/general`,
            controller: 'postGeneral',
            method: 'post',
            authenticate: true,
            permission: permissions.general.slug,
        },
        {
            path: `/admin/${info.slug}/theme-options`,
            controller: 'themeOptions',
            method: 'get',
            authenticate: true,
            permission: permissions.themeOption.slug,
        },
        {
            path: `/admin/${info.slug}/theme-options`,
            controller: 'postThemeOptions',
            method: 'post',
            authenticate: true,
            permission: permissions.themeOption.slug,
        },
    ],
    menu: {
        icon: 'fa fa-cogs',
        label: info.label,
        position: 90,
        activeIf: {
            module: info.slug,
            controller: 'all'
        },
        child: [
            {
                label: 'Cài đặt chung',
                permission: permissions.general.slug,
                url: `/admin/${info.slug}/general`,
                activeIf: {
                    module: info.slug,
                    controller: ['general']
                }
            },
            {
                label: 'Tùy chỉnh Giao diện',
                permission: permissions.themeOption.slug,
                url: `/admin/${info.slug}/theme-options`,
                activeIf: {
                    module: info.slug,
                    controller: ['themeOptions']
                }
            },
        ]
    }
};