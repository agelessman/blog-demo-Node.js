// Get users listing
exports.list = function (req, res) {
    res.send('response a resource');
};

// Get login page
exports.login = function (req, res) {
    res.render('login');
};

// Get logout route
exports.logout = function (req, res, next) {
    // Destroy Session
    req.session.destroy();
    res.redirect('/');
};

// Post authenticate route
exports.authenticate = function (req, res, next) {
    if (!req.body.email || !req.body.password)
        return res.render('login', {error: 'Please enter your email and password.'});
    req.models.User.findOne({
        email: req.body.email,
        password: req.body.password
    }, function(error, user){
        if (error) return next(error);
        if (!user) return res.render('login', {error: 'Incorrect email&password combination.'});
        req.session.user = user;
        req.session.admin = user.admin;
        res.redirect('/admin');
    })

};

