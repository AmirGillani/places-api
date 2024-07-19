const express = require("express");

const multer = require('multer');

// IMPORT CHECK METHOD
const { check } = require("express-validator");

const checkAuth = require("../middlewares/check-auth");

//CREATER ROUTER OBJECT
const route = express.Router();

//FUNCTIONS ARE WRITTEN IN CONTROLLER
const placeControler = require("../controllers/places-controller");

//DECLARE ROUTER SOME GET AND POST METHODS

route.get("/", placeControler.Home);

route.get("/:placeid", placeControler.foundPlaceById);

route.get("/user/:userid", placeControler.foundUserPlaces);

// CALL MIDDLEWARE TO CHECK USER HAS TOKEN OR NOT

route.use(checkAuth);

// Multer configuration
const storage = multer.diskStorage({});

const upload = multer({ storage });


//APPLY CHECK METHOD FOR VALIDATION

//check('title').not().isEmpty(), check("description").isLength({ min: 5 })
route.post(
  "/",upload.single("image"),
  [check('title').not().isEmpty(), check("description").isLength({ min: 5 })],
  placeControler.createPlace
);

route.patch("/:placeid", placeControler.updatePlace);

route.delete("/:placeid", placeControler.deletePlace);

module.exports = route;
