"use strict";
const url = require('url');

module.exports = {
    /**
     * Access in Object by string properties
     * @param object: input object like {foo: {bar: 'foobar'}}
     * @param stringProperties: string like: "foo.bar"
     */
    accessObjectByString: function (object, stringProperties) {
        let properties = stringProperties.split('.');
        let result = object;
        for (let property of properties) {
            if (result.hasOwnProperty(property)){
                result = result[property];
            } else {
                return '';
            }
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
        query.sort = 'desc';

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
    }

};