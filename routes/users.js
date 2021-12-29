const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateUser, UserModel, validateLogin, genToken } = require("../models/userModel");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "Users page, nothing to see here!!!" });
})

// Route for adding a new user
router.post("/", async (req, res) => {
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    let user = new UserModel(req.body);
    // hasing the password
    user.password = await bcrypt.hash(user.password, 10);
    // saving the user to the database
    await user.save();
    // hide the hashed password from the client
    user.password = "*****";
    res.json(user);
  }
  catch (err) {
    // checkint if the error is because the email already exists in the system
    if (err.code == 11000) {
      return res.status(500).json({ msg: "Email already exists in the system, try login in" });
    }
    console.log(err);
    res.status(500).json(err);
  }
})

// Router for user login
router.post("/login", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try{
    let user = await UserModel.findOne({email: req.body.email})
    // Checking if email exists in the system
    if(!user){
      return res.status(401).json({msg: "Incorrect password or email"});
    }
    // Checking password
    let validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass){
      return res.status(401).json({msg: "Incorrect password or email"});
    }
    // Creating a token for the user using his id
    let userToken = genToken(user._id);
    res.json({token: userToken});
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);
  }
})


module.exports = router;