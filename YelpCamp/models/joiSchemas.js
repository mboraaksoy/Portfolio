const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');
const ExpressError = require('../utilities/ExpressError.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const objectId = BaseJoi.string().hex().length(24);

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include special characters!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                    return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundValidate = function (req, res, next) {
    const campgroundJoiSchema = Joi.object({
        title: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        images: Joi.object({
            url: Joi.string().required().escapeHTML(),
            filename: Joi.string().required().escapeHTML()
        }).optional(),
        price: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML(),
        author: objectId.optional(),
        reviews: Joi.array().items(objectId).optional(),
        deleteImages: Joi.array().optional(),
        coordsLatitude: Joi.number().optional(),
        coordsLongitude: Joi.number().optional()
    }).required();
    const { error } = campgroundJoiSchema.validate(req.body);
    if (error) throw new ExpressError(error, 400);
    next();
}

module.exports.reviewValidate = function (req, res, next) {
    const reviewJoiSchema = Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(0).max(5),
        author: objectId.optional()
    }).required();

    if (parseInt(req.body.rating) === 0) {
        req.flash('error', 'Please enter a rating!');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }

    const { error } = reviewJoiSchema.validate(req.body);
    if (error) throw new ExpressError(error, 400);
    next();
}