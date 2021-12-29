const jwt = require("jsonwebtoken");
const { config } = require("../config/secret_keys");

// Authorization of a user token
exports.auth = (req, res, next) => {
    let token = req.header("x-api-key");
    // Checking if token has been sent
    if (!token) {
        return res.status(401).json({ msg: "You need to send a token..." });
    }

    try {
        let decodeToken = jwt.verify(token, config.TokenSecret);
        req.userTokenData = decodeToken;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ msg: "Token is invalid" });
    }
}