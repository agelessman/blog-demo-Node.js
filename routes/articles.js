/**
 * Created by M.C on 2017/8/18.
 */

// Get article page
exports.show = function (req, res, next) {
    if (!req.param.slug) {
        return next(new Error('No aritcle slug.'));
    }
    req.models.Article.findOne({slug: req.param.slug}, function (err, article) {
        if (err) {
            return next(err);
        }

        if (!article.published && !req.session.admin) {
            return res.send(401);
        }

        res.render('article', article);
    })
};

// Get articles API
exports.list = function (req, res, next) {
    req.models.Article.list(function (err, articles) {
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
    req.models.Article.create(article, function (err, articleResponse) {
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

    req.models.Article.findById(req.params.id, function(error, article) {
        if (error) return next(error);
        article.update({$set: req.body.article}, function(error, count, raw){
            if (error) return next(error);
            res.send({affectedCount: count});
        })
    });
};

// DELETE article API
exports.del = function (req, res, next) {
    if (!req.params.id) return next(new Error('No article ID.'));
    req.models.Article.findById(req.params.id, function(error, article) {
        if (error) return next(error);
        if (!article) return next(new Error('article not found'));
        article.remove(function(error, doc){
            if (error) return next(error);
            res.send(doc);
        });
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
    if (!req.body.title || !req.body.slug || !req.body.text ) {
        return res.render('post', {error: 'Fill title, slug and text.'});
    }
    var article = {
        title: req.body.title,
        slug: req.body.slug,
        text: req.body.text,
        published: false
    };
    req.models.Article.create(article, function(error, articleResponse) {
        if (error) return next(error);
        res.render('post', {error: 'Article was added. Publish it on Admin page.'});
    });
};

// Get admin page
exports.admin = function (req, res, next) {
    req.models.Article.list(function(error, articles) {
        if (error) return next(error);
        res.render('admin',{articles:articles});
    });
};

