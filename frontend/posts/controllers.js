"use strict";
const co = require('co');

/**
 * Paginate Post
 * @param postType
 * @param limit
 * @param select
 * @param page
 * @param categoryId
 * @param search
 */
const paginatePost = function (postType, limit, select, page, categoryId, search) {
    let queries = {
        postType,
        status: 'show'
    };
    if (categoryId) queries.categories = categoryId;
    if (search) queries.name = new RegExp(search, 'i');

    return _app.model.post.paginate( queries, {
        select,
        limit,
        populate: [{path: 'image'}, {path: 'gallery', select: 'path ext'}],
        page: page || 1
    })
};

const randomId = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDocuments = function (allDocuments, currentDocument) {

    let itemsId = [];

    while (itemsId.length < 3) {
        let index = randomId(0, allDocuments.length -1);
        let itemId = allDocuments[index]._id;

        if (itemsId.indexOf(itemId) === -1 && itemId.toString() !== currentDocument._id.toString()) {
            itemsId.push(itemId)
        }
    }

    return _app.model.post
        .find({_id: {$in: itemsId}})
        .populate('gallery', 'path ext')
        .select('name gallery slug fields description')
        .limit(3);
};

module.exports = {

    // Blog
    blog: co.wrap(function* (req, res, next) {
        let Results = yield Promise.all([
            paginatePost('post', 4, 'name slug image description', req.query.page),
            _app.model.taxonomy.find({module: 'posts', type: 'category'}).select('slug name')
        ]);
        let posts = Results[0].docs,
            paginated = generatePaginateLink(req, Results[0]),
            categories = Results[1];

        res.theme('page-blog', {
            posts,
            paginated,
            categories,
            pageTitle: 'Blog',
            pageType: 'blog',
        });
    }),
    blogDetail: co.wrap(function* (req, res, next) {
        let Results = yield Promise.all([
            _app.model.post.findOne({slug: req.params.slug}).populate('image'),
            _app.model.taxonomy.find({module: 'posts', type: 'category'}).select('slug name')
        ]);
        let post = Results[0],
            categories = Results[1];

        res.theme('single-blog', {
            post,
            pageTitle: post.name,
            pageType: 'article',
            categories
        });
    }),
    blogCategory: co.wrap(function* (req, res, next) {
        try {
            let category = yield _app.model.taxonomy.findOne({slug: req.params.slug}).select('name');

            let Results = yield Promise.all([
                paginatePost('post', 4, 'name slug image description', req.query.page, category.id),
                _app.model.taxonomy.find({module: 'posts', type: 'category'}).select('slug name')
            ]);
            let posts = Results[0].docs,
                paginated = generatePaginateLink(req, Results[0]),
                categories = Results[1];

            res.theme('page-blog', {
                posts,
                paginated,
                categories,
                pageTitle: `${category.name} - Blog`,
                pageType: 'blog_category',
                categoryName: category.name
            });
        } catch (err){
            next(err);
        }
    }),

    //Products
    products: co.wrap(function* (req, res, next) {
        let Results = yield Promise.all([
            paginatePost('product', 4, 'name slug gallery description fields', req.query.page, '', req.query.s),
            _app.model.taxonomy.find({module: 'products', type: 'product_category'}).select('slug name')
        ]);
        let products = Results[0].docs,
            paginated = generatePaginateLink(req, Results[0]),
            categories = Results[1];

        res.theme('page-product', {
            products,
            paginated,
            categories,
            pageTitle: 'Sản phẩm',
            pageType: 'products',
        });
    }),
    productDetail: co.wrap(function* (req, res, next) {
        let Results = yield Promise.all([
            _app.model.post
                .findOne({slug: req.params.slug})
                .populate('gallery', 'name path ext')
                .populate('categories', '_id'),
            _app.model.taxonomy.find({module: 'products', type: 'product_category'}).select('slug name'),
            _app.model.post.find({postType: 'product'}).select('_id')
        ]);

        let product = Results[0],
            categories = Results[1],
            products = Results[2];

        let relatedProducts = yield getRandomDocuments(products, product);

        res.theme('single-product', {
            product,
            pageTitle: product.name,
            pageType: 'product',
            categories,
            relatedProducts
        });
    }),
    productCategory: co.wrap(function* (req, res, next) {
        let category = yield _app.model.taxonomy.findOne({slug: req.params.slug}).select('name');

        let Results = yield Promise.all([
            paginatePost('product', 4, 'name slug gallery description fields', req.query.page, category.id),
            _app.model.taxonomy.find({module: 'products', type: 'product_category'}).select('slug name')
        ]);

        let products = Results[0].docs,
            paginated = generatePaginateLink(req, Results[0]),
            categories = Results[1];

        res.theme('page-product', {
            products,
            paginated,
            categories,
            pageTitle: `${category.name} - Sản phẩm`,
            pageType: 'product_category',
            categoryName: category.name
        });
    }),

    // Page
    pageDetail: co.wrap(function* (req, res, next) {
        let Results = yield Promise.all([
            _app.model.post.findOne({slug: req.params.slug}).populate('gallery'),
        ]);
        let page = Results[0];

        res.theme('single-page', {
            page,
            pageTitle: page.name,
            pageType: 'page'
        });
    }),
};