"use strict";
const url = require('url');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

module.exports = {

    timeFormat: function (time, format) {
        return moment(time).format(format);
    },

    timeFromNow: function (time) {
        return moment(time).fromNow();
    },

    /**
     * Access in Object by string properties
     * @param object: input object like {foo: {bar: 'foobar'}}
     * @param stringProperties: string like: "foo.bar"
     */
    accessObjectByString: function (object, stringProperties) {
        let properties = stringProperties.split('.');
        let result = object;
        for (let property of properties) {
            result = result[property];
        }
        return result;
    },

    /**
     *
     * @param originalUrl
     * @param reqQuery
     * @param sortBy
     */
    createSortLink: function (originalUrl, reqQuery, sortBy) {
        let query = Object.assign({}, reqQuery);

        query.sortBy = sortBy;
        query.sort = 'asc';

        if (reqQuery.sortBy == sortBy){
            switch (reqQuery.sort) {
                case 'asc':
                    query.sort = 'desc';
                    break;
                case 'desc':
                    query.sort = 'asc';
                    break;
            }
        }

        return url.format({
            pathname: url.parse(originalUrl).pathname,
            query: query
        });
    },

    sidebarMenu: function (logged_user, module, controller, reqQuery) {
        function checkActive(menu, hasChildActive) {
            //TODO: short it :(
            if (
                (menu.activeIf.module === module || hasChildActive)
                && ( menu.activeIf.controller === 'all' || menu.activeIf.controller.indexOf(controller) >= 0)
                && (!menu.activeIf.params || (menu.activeIf.params && reqQuery[menu.activeIf.params.reqParam] === menu.activeIf.params.value))
            ){
                return 'active'
            } else {
                return '';
            }
        }

        let html = '<ul class="sidebar-menu">';

        let menus = [];
        for (let module of ALL_MODULES) {
            let Menu = require(`${__root}/admin/${module}/index`).menu;
            if (Menu) {
                if (Array.isArray(Menu)) {
                    for (let menu of Menu) {
                        menus.push(menu)
                    }
                } else {
                    menus.push(Menu);
                }
            }
        }
        menus = menus.sort(function (a, b) {
            return a.position - b.position;
        });

        for (let menu of menus) {
            if (menu.child) {
                let parentHtml = `<a href="#"><i class="${menu.icon}"></i><span>${menu.label}</span><span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span></a>`;
                let childHtml = '<ul class="treeview-menu">';
                let emptyChild = false,
                    hasChildActive = false;
                for (let child of menu.child) {
                    let childActive = checkActive(child);
                    if (childActive === 'active') hasChildActive = true;
                    if (!child.permission || _checkPermission(child.permission, logged_user)){
                        childHtml += `<li class="${childActive}"><a href="${child.url}"><i class="fa fa-circle-o"></i>${child.label}</a></li>`;
                        emptyChild = true;
                    }
                }
                childHtml += '</ul>';

                let parentActive = checkActive(menu, hasChildActive);
                if (emptyChild)
                    html += `<li class="treeview ${parentActive}">${parentHtml}${childHtml}</li>`;
            } else {
                let active = checkActive(menu);
                if (!menu.permission || (menu.permission && _checkPermission(menu.permission, logged_user)))
                    html += `<li class="${active}"><a href="${menu.url}"><i class="${menu.icon}"></i><span>${menu.label}</span></a></li>`;
            }
        }

        html += '</ul>';
        return html;
    },

    toArray: function (arrayObjects, field) {
        let arr = [];
        for (let item of arrayObjects) {
            arr.push(item[field]);
        }
        return arr;
    },

    generateUrlQuery: function (params) {
        let query = '?';
        for (let param of params) {
            if (param.name && param.value)
                query += `&${param.name}=${param.value}`;
        }
        return query;
    },

    post_thumbnail: function (imagePath, thumbName) {
        if (!imagePath) return '';
        let image = path.parse(imagePath);
        if (!thumbName)
            return `/uploads/${image.name}-150x150${image.ext}`;
        else if (thumbName === 'medium')
            return `/uploads/${image.name}-700x520${image.ext}`;
    },

    getFlag: function (languages, languageCode) {
        let language = languages.filter(language => language.code === languageCode)[0];
        return language.flag;
    },

    getField: function (item, filedName) {
        if (!item || !item.fields || !filedName) return '';
        return item.fields[filedName];
    },

    cropText: function (text, length) {
        let cropText = text.substr(0, length);
        let lastSpace = cropText.lastIndexOf(' ');
        return cropText.substr(0, lastSpace);
    }

};