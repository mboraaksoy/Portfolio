require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const mongoose = require('mongoose');
const Campground = require('../models/campground.js');
const cities = require('./cities.js');
const { descriptors, places } = require('./seedHelpers.js');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = 'b9jr5ajSVqTjC84zDB2c';

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB Connection error:'));
db.once('open', () => console.log('DB successfully connected.'));


const sample = (array) => array[Math.floor(Math.random() * array.length)];

const imageRandomizer = () => {
    return [{
        url: `/images/campgroundSeeds/${Math.floor(Math.random() * 15) + 1}.jpg`,
        filename: 'nqwhrbhjoegsbsvgxupq'
    },
    {
        url: `/images/campgroundSeeds/${Math.floor(Math.random() * 15) + 1}.jpg`,
        filename: 'jmp1srsaucltoddjgmdv'
    }];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const randomCityIndex = Math.floor(Math.random() * 1000);
        const randomCity = cities[randomCityIndex];
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${randomCity.city}, ${randomCity.state}`,
            images: imageRandomizer(),
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus reprehenderit facere minima facilis necessitatibus eveniet distinctio odio perspiciatis, tenetur dignissimos sint autem, reiciendis pariatur aliquid, nesciunt sit. Voluptate, consequuntur voluptatum? Aliquam pariatur placeat earum aut dicta? Impedit iusto rerum et nihil perferendis alias? Corrupti nostrum dicta accusantium placeat perspiciatis ad minus. Autem consequatur nisi sapiente praesentium, ullam velit officia repellendus? Sit quis repellat exercitationem, molestias aliquam culpa doloribus et minima rerum fuga dolorem aut, necessitatibus quos expedita autem, maxime earum ullam in dicta reiciendis voluptates modi pariatur. Exercitationem, veniam incidunt.',
            price: Math.floor(Math.random() * 20) + 30,
            author: '6841cf0703c2f36767d2c0b5',
            geometry: {
                type: 'Point',
                coordinates: [randomCity.longitude, randomCity.latitude]
            }
        });
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
        console.log('DB connection closed.');
    })
    .catch(err => {
        console.log(err);
    })