const Review = require('../models/review.js');

const isReviewAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    const author = req.user;
    if (!review.author.equals(author._id)){
        req.flash('error', 'You do not have permissions for this action!');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
}

module.exports = isReviewAuthor;