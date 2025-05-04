const Product = require('./models/product.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
    .then(() => {
        console.log('Mongo connection successful.');
    })
    .catch(err => {
        console.log('Mongo connection error:\n', err);
    })

const seedProducts = [
    {
        name: 'Fairy Eggplant',
        price: 1.00,
        category: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        category: 'fruit'
    },
    {
        name: 'Organic Mini Seedless Watermelon',
        price: 3.99,
        category: 'fruit'
    },
    {
        name: 'Organic Selery',
        price: 1.50,
        category: 'vegetable'
    },
    {
        name: 'Chocolate Whole Milk',
        price: 2.69,
        category: 'dairy'
    }
] 

Product.insertMany(seedProducts)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    })

