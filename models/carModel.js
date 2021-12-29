const mongoose = require("mongoose");
const Joi = require("joi");

// Creating car schema
let carSchema = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    img_url: String,
    price: Number,
    creation_date: {
        type: Date, default: Date.now()
    },
    user_id: String
})

// Creating a car model using the car schema
exports.CarModel = mongoose.model("cars", carSchema);

// Validating a car object 
// Return true if the object follows a certain rules and false if not
exports.validateCar = (_reqBody) => {
    let joiSchema = Joi.object({
        name:Joi.string().min(2).max(99).required(),
        info:Joi.string().min(2).max(500).required(),
        category:Joi.string().min(2).max(99).required(),
        img_url:Joi.string().min(2).max(999).required(),
        price:Joi.number().min(1).max(2000000).required(),
    })
    return joiSchema.validate(_reqBody);
}