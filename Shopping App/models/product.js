const mongoose = require('mongoose');
const categories = require('../categories.js')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: categories,
        lowercase: true
    }
})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;