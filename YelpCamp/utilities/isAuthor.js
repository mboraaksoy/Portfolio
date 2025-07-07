const Campground = require('../models/campground.js');

const isAuthor = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const author = req.user;
    if (!campground.author.equals(author._id)){
        req.flash('error', 'You do not have permissions for this action!');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
}

module.exports = isAuthor;