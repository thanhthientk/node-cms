module.exports = [
    {
        path: '/blog/',
        controller: 'blog',
        method: 'get'
    },
    {
        path: '/blog/:slug',
        controller: 'blogDetail',
        method: 'get'
    },
    {
        path: '/blog/category/:slug',
        controller: 'blogCategory',
        method: 'get'
    },

    {
        path: '/products/',
        controller: 'products',
        method: 'get'
    },
    {
        path: '/products/:slug',
        controller: 'productDetail',
        method: 'get'
    },
    {
        path: '/products/category/:slug',
        controller: 'productCategory',
        method: 'get'
    },

    //Page
    {
        path: '/page/:slug',
        controller: 'pageDetail',
        method: 'get'
    },
];