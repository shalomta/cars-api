const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const {config} = require("../config/secret_keys");

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String, default: "regular"
    },
    creation_date: {
        type: Date, default: Date.now()
    }
})

exports.UserModel = mongoose.model("users", userSchema);

// Generating a token for a secure connection with the user
// The token is valid for 60 minutes
exports.genToken = (_id) => {
    let token = jwt.sign({ _id: _id }, config.TokenSecret, { expiresIn: "60min" });
    return token;
}

// Validating a user when adding a new one
exports.validateUser = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(3).max(99).required()
    })
    return joiSchema.validate(_reqBody);
}

// Validating a user on login
exports.validateLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(3).max(99).required()
    })
    return joiSchema.validate(_reqBody);
}