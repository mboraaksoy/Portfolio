function isLoggedOut(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/campgrounds');
    }
    next();
}

module.exports = isLoggedOut;