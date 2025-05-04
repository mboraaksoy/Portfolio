const categories = require('./categories.js');
const Product = require('./models/product.js');
async function filterByCategory(req, res) {
    const {category} = req.query;
    if(category){
        if (categories.includes(category)){
            const products = await Product.find({category});
            res.render('products/allProducts.ejs', {products, categories, category});
        }
        else{
            const products = await Product.find({});
            // res.render('products/allProducts.ejs', {products, categories, category: 'All'});
            res.redirect('/products');
        }
    }
    else{
        const products = await Product.find({});
        res.render('products/allProducts.ejs', {products, categories, category: 'All'});
        }
}

module.exports = {filterByCategory};
