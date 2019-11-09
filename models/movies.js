const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genres');

const Movie = mongoose.model('Movie',
    new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trip: true, //Gets rid of any extra padding
            minlength: 5,
            maxlength: 200
        },
        genre: {
            type: genreSchema,  //imported from the genre model
            required: true
        },
        numberInStock: {
            type: Number,
            required: true,
            min: 0,
            max: 255
        },
        dailyRentalRate: {
            type: Number,
            required: true,
            min: 0,
            max: 255
        }
    })
); // END Genre

function validateMovie(movie){
    const schema = {
        title: Joi.string().min(5).max(200).required(),
        //Here instead of genre we want to client to send only an id of genre so we validate for a string
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()

    };
    return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
