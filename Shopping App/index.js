const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const Product = require('./models/product.js');
const categories = require('./categories.js');
const filterByCategory = require('./filterByCategory.js');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
    .then(() => {
        console.log('Mongo connection successful.');
    })
    .catch(err => {
        console.log('Mongo connection error:\n', err);
    })

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/products', filterByCategory.filterByCategory);

app.get('/products/new', (req, res) => {
    res.render('products/newProduct.ejs', {categories});
})

app.get('/products/:id', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('./products/productDetails.ejs', {product});
})

app.get('/products/:id/edit', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/editProduct.ejs', {product, categories});
})

app.put('/products/:id', async (req, res) => {
    const {id} = req.params;
    let product = await Product.findById(id);
    const {name, price, category} = req.body;
    product.name = name;
    product.price = price;
    product.category = category;
    await product.save();
    res.redirect(`/products/${id}`);
})

app.post('/products', async (req, res) => {
    const {name, price, category} = req.body;
    const newProduct = new Product({name, price, category});
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
})

app.delete('/products/:id', async (req, res) => {
    const {id} = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
})


app.listen(8080, () => {
    console.log('Connecting to localhost:8080...');
})