const helmet = require('helmet');

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
    "https://cdn.maptiler.com/",
    "https://cdn.jsdelivr.net/"
];

const fontSrcUrls = [];

const cspConfig = {
    directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
            "'self'",
            "blob:",
            "data:",
            "https://res.cloudinary.com/dtpt2f4hj/",
            "https://images.unsplash.com/",
            "https://cdn-icons-png.flaticon.com/",
            "https://api.maptiler.com/",
            "https://cdn.maptiler.com/"
        ],
        fontSrc: ["'self'", ...fontSrcUrls],
    }
};

module.exports = cspConfig;