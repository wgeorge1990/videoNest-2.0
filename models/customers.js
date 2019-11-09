const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer',
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 25
        },
        isGold: {
            type: Boolean,
            required: true,
            default: false
        },
        phone: {
            type: String,
            required: true,
            minlength: 7,
            maxlength: 30
        }
    })
);

function validateCustomer(customer){
    const schema = {
        name: Joi.string().min(3).max(25).required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string().required()
    };
    return Joi.validate(customer, schema);
}

//exports is a reference to module.exports, therefore, we can just say exports.Customer = Customer
module.exports.Customer = Customer;
module.exports.validate = validateCustomer;