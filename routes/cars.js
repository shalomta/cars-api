const express = require("express");
const { CarModel, validateCar } = require("../models/carModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

// Route for getting all cars from the data base
// domain/cars?s=
router.get("/", async (req, res) => {
  let page = req.query.page - 1 || 0;
  let perPage = 10;
  let searchQ = req.query.s || "";

  let searchRegExp = new RegExp(searchQ, "i");
  try {
    let data = await CarModel.find({ $or: [{ name: searchRegExp }, { info: searchRegExp }] })
      .limit(perPage) // Limit how many cars to show in one page
      .skip(page * perPage); // Which page to show

    res.json(data);
  }
  // In case the server is down
  catch (err) {
    console.log(err);
    res.status(500).json({ err: "DB down , come back later" });
  }
})

// Route for getting cars of a specific category
// domain/cars/cat/<cateName>/?page=
router.get("/cat/:catName", async (req, res) => {
  let catName = req.params.catName;
  let page = req.query.page - 1 || 0;
  let perPage = 10;
  let catRegExp = new RegExp(catName, "i");
  try {
    let data = await CarModel.find({ category: catRegExp })
      .limit(perPage) // Limit how many cars to show in one page
      .skip(page * perPage); // Which page to show

    res.json(data);
  }
  // In case the server is down
  catch (err) {
    console.log(err);
    res.status(500).json({ err: "DB down , come back later" });
  }
})

// Route for getting cars that their prices are between min and max
// domain/cars/prices/?min=<minimal price>&max=<maximal price>
router.get("/prices", async (req, res) => {
  let min = req.query.min || 0;
  let max = req.query.max || 1000000;
  let page = req.query.page - 1 || 0;
  let perPage = 10;

  try {
    let data = await CarModel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } }] })
      .limit(perPage) // Limit how many cars to show in one page
      .skip(page * perPage); // Which page to show

    res.json(data);
  }
  // In case the server is down
  catch (err) {
    console.log(err);
    res.status(500).json({ err: "DB down , come back later" });
  }
})


// Route for adding a new car
router.post("/", auth, async (req, res) => {
  // Validating the body
  let validBody = validateCar(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    let car = new CarModel(req.body);
    car.user_id = req.userTokenData._id;
    await car.save();
    res.status(201).json(car);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

// Route for editing a record in the database
// domain/cars/<idEdit>
router.put("/:idEdit", auth, async (req, res) => {
  // Validating the body
  let validBody = validateCar(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    let idEdit = req.params.idEdit;
    let data = await CarModel.updateOne({ _id: idEdit, user_id: req.userTokenData._id }, req.body);
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

// Route for deleting a record from the database
// domain/cars/<idDel>
router.delete("/:idDel", auth, async (req, res) => {
  try {
    let idDel = req.params.idDel;
    let data = await CarModel.deleteOne({ _id: idDel, user_id: req.userTokenData._id });
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

module.exports = router;