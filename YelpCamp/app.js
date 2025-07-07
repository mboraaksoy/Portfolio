if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: require('path').join(__dirname, '.env') });
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const ExpressError = require('./utilities/ExpressError.js');
const sanitizeV5 = require('./utilities/mongoSanitizeV5.js');
const cspConfig = require('./utilities/cspConfig.js');
const {rateLimitConfig} = require('./utilities/rateLimitConfig.js');

const User = require('./models/user.js');

const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/users.js');

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl); // 'mongodb://127.0.0.1:27017/yelp-camp'
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB Connection error:'));
db.once('open', () => console.log('DB successfully connected.'));

const app = express();
app.set('query parser', 'extended');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(sanitizeV5());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.MONGO_STORE_SECRET
    }
});

store.on('error', function (e) {
    console.log('Session store error', e);
})

const sessionConfig = {
    store,
    secret: process.env.SESSION_SECRET,
    name: 'session',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

const limiter = rateLimit.rateLimit(rateLimitConfig);

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());
app.use(limiter);
app.use(helmet.contentSecurityPolicy(cspConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('warning');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


app.get('/', (req, res) => {
    res.render('./index.ejs');
})

app.get('/about', (req, res) => {
    res.render('./about.ejs');
})

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(204).end(); // No Content
});

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('404 Not found!', 404));
})

app.use((err, req, res, next) => {
    console.log(err, req.originalUrl);
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).render('./error.ejs', { message });
})

app.listen(3000, () => {
    console.log('Listening to localhost:3000...');
})