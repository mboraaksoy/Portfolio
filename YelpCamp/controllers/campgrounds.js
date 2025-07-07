const Campground = require('../models/campground.js');
const { cloudinary } = require('../cloudinary/index.js');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res, next) => {
    if (req.get('Accept') === 'application/json') {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 10);
        const skip = (page - 1) * limit;
        const campgrounds = await Campground.find({}).populate('author', '-_id username')
            .skip(skip)
            .limit(limit);
        res.json(campgrounds);
    } else {
        const mapData = await Campground.find({}).populate('author', '-_id username')
            .select('_id title location geometry author');
        const initialCampgrounds = await Campground.find({}).populate('author', '-_id username')
            .limit(10);
        res.render('./campgrounds/index.ejs', { mapData, initialCampgrounds });
    }
}

module.exports.renderNewCampgroundForm = async (req, res, next) => {
    res.render('./campgrounds/newCampground.ejs');
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground();
    Object.assign(campground, { title: req.body.title, price: req.body.price, image: req.body.image, location: req.body.location, description: req.body.description });
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    campground.geometry = { type: 'Point', coordinates: [req.body.coordsLongitude, req.body.coordsLatitude] };

    await campground.save();
    req.flash('success', `Successfully created ${req.body.title}!`);
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.renderCampgroundDetails = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author', 'username');
    if (!campground) {
        req.flash('error', 'Can not find that campground!');
        return res.redirect('/campgrounds');
    };
    res.render('./campgrounds/campgroundDetails.ejs', { campground });
}

module.exports.renderEditCampgroundForm = async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Can not find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('./campgrounds/editCampground.ejs', { campground });
}

module.exports.editCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    Object.assign(campground, { title: req.body.title, price: req.body.price, image: req.body.image, location: req.body.location, description: req.body.description });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', `Successfully updated ${campground.title}!`)
    res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', `Successfully deleted ${campground.title}!`);
    res.redirect('/campgrounds');
}
