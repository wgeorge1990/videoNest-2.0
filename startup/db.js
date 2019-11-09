const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
    // Connect to mongoDB
    // Runs based on enviornment set at NODE_ENV= ( test, development, production )
    mongoose.connect(config.get('db'),
        { useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }) // Line to connect to mongoDB.Compass
            .then(() => winston.info(`Connected to ${config.get('db')} ===> 😱`));
};
