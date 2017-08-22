var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var http = require("http");
var routes = require('./routes');

// var index = require('./routes/index');
// var users = require('./routes/users');

/// Collections
var collections;
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/blog', function (err, db) {
    collections = {
        articles: db.collection('articles'),
        users: db.collection('users')
    };
});

var session = require('express-session'),
    logger = require('morgan'),
    errorHandler = require('errorhandler'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');


var app = express();
app.locals.appTitle = "blog-express";

app.use(function(req, res, next) {
    if (!collections.articles || !collections.users) {
        var err = new Error('No collections.');
        err.status = 404;
        return next(err)
    }
    req.collections = collections;
    collections.users.find({}).toArray(function (err, users) {
        console.log(users);
    });

    next();
});

app.set("port", process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
    app.use(errorHandler());
}

// Session Middleware
app.use(cookieParser('abcdefg'));
app.use(session({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware
app.use(function (req, res, next) {
    if (req.session && req.session.admin) {
        res.locals.admin = true;
    }
    next();
});

// Authorization
var authorize = function (req, res, next) {
    console.log('session:' + JSON.stringify(req.session));
    if (req.session && req.session.admin) {
        return next();
    } else  {
        return res.sendStatus(401);
    }
};


//PAGES&ROUTES
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);
app.get('/admin', authorize,  routes.article.admin);
app.get('/post', authorize, routes.article.post);
app.post('/post', authorize, routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

//REST API ROUTES
app.all('/api', authorize);
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.delete('/api/articles/:id', routes.article.del);

app.all('*', function(req, res) {
    res.send(404);
});

var server = http.createServer(app);
var boot = function () {
    server.listen(app.get('port'), function(){
        console.info('Express server listening on port ' + app.get('port'));
    }); };
var shutdown = function() {
    server.close();
};
if (require.main === module) {
    boot(); }
else {
    console.info('Running app as a module');
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
}

module.exports = app;
