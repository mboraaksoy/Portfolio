const express = require('express');
const router = express.Router();
const { campgroundValidate } = require('../models/joiSchemas.js');
const isLoggedIn = require('../utilities/isLoggedIn.js');
const isAuthor = require('../utilities/isAuthor.js');
const { index, renderNewCampgroundForm, createCampground, renderCampgroundDetails, renderEditCampgroundForm, editCampground, deleteCampground } = require('../controllers/campgrounds.js');
const multer = require('multer');
const { storage } = require('../cloudinary/index.js');
const upload = multer({ storage });

router.route('/')
    .get(index)
    .post(isLoggedIn, upload.array('image'), campgroundValidate, createCampground);

router.get('/new', isLoggedIn, renderNewCampgroundForm);

router.route('/:id')
    .get(renderCampgroundDetails)
    .put(isLoggedIn, isAuthor, upload.array('image'), campgroundValidate, editCampground)
    .delete(isLoggedIn, isAuthor, deleteCampground);

router.get('/:id/edit', isLoggedIn, isAuthor, renderEditCampgroundForm);

module.exports = router;