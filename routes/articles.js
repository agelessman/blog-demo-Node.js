/**
 * Created by M.C on 2017/8/18.
 */

// Get article page
exports.show = function (req, res, next) {
    if (!req.param.slug) {
        return next(new Error('No aritcle slug.'));
    }
    req.collections.articles.findOne({slug: req.param.slug}, function (err, article) {
        if (err) {
            return next(err);
        }

        if (!article.published) {
            return res.send(401);
        }

        res.render('article', article);
    })
};

// Get articles API
exports.list = function (req, res, next) {
    req.collections.articles.find({}).toArray(function (err, articles) {
        if (err) {
            return next(err);
        }

        res.send({articles: articles});
    });
};

// Post article API
exports.add = function (req, res, next) {
    if (!req.body.article) {
        return next(new Error('No article payload.'));
    }
    var article = req.body.article;
    article.published = false;
    req.collections.articles.insert(article, function (err, articleResponse) {
        if (err) {
            return next(err);
        }
        res.send(articleResponse);
    });
};

// PUT article API
exports.edit = function (req, res, next) {
    if (!req.param.id) {
        return next(new Error('No article id.'));
    }
    req.collections.articles.updateMany({_id: require('mongodb').ObjectID(req.param.id)}, {$set: req.body.article}, function (err, count) {
        if (err) {
            return next(err);
        }

        res.send({affectCount: count});
    });
};

// DELETE article API
exports.del = function (req, res, next) {
    if (!req.param.id) {
        return next(new Error('No article id.'));
    }
    req.collections.articles.deleteMany({_id: require('mongodb').ObjectID(req.param.id)}, function (err, count) {
        if (err) {
            return next(err);
        }
        res.send({affectCount: count});
    });
};

// Get article POST page
exports.post = function (req, res, next) {
    if (!req.body.title) {
        res.render('post');
    }
};

// POST artucle POST page
exports.postArticle = function (req, res, next) {
    if (!req.body.title || !req.body.slug || !req.body.text) {
        return res.render('post', {error: 'Fill title, slug and text.'});
    }
    var article = {
        title: req.body.title,
        slug: req.body.slug,
        text: req.body.text,
        published: false
    };

    req.collections.articles.insert(article, function (err, articleResponse) {
        if (err) {
            return next(err);
        }
        res.render('post', {error: 'Article was added, publish is on Admin page.'});
    });
};

// Get admin page
exports.admin = function (req, res, next) {
    req.collections.articles.find({}, {sort: {_id: -1}}).toArray(function (error, articles) {
        if (error) {
            return next(error);
        }

        res.render('admin', {articles: articles});
    })
};

