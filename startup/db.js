const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
    // Connect to mongoDB
    // Runs based on enviornment set at NODE_ENV= ( test, development, production )config.get('db')
    mongoose.connect(config.get('db'),{ useFindAndModify: false, useUnifiedTopology: true ,useNewUrlParser: true }) // Line to connect to mongoDB.Compass
            .then(() => winston.info(`Connected to ${config.get('db')} ===> 😱`));
};
