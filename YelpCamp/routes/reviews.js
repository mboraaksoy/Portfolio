const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewValidate } = require('../models/joiSchemas.js');
const isLoggedIn = require('../utilities/isLoggedIn.js');
const isReviewAuthor = require('../utilities/isReviewAuthor.js');
const { createReview, deleteReview } = require('../controllers/reviews.js');

router.post('/', isLoggedIn, reviewValidate, createReview);

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, deleteReview);

module.exports = router;